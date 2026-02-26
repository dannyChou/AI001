import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

type AuthMethod = 'hardwareCert' | 'softwareCertOtp';

type IssuanceDraft = {
  checkNo: string;
  issuerName: string;
  issueDateYmd: string;
  payeeName: string;
  amount: number;
};

type IssuanceResult = IssuanceDraft & {
  seqNo: string;
  issuedAt: string;
};

function padLeft(input: string, len: number, fill = '0'): string {
  return input.padStart(len, fill);
}

@Component({
  selector: 'app-security-auth-page',
  imports: [ReactiveFormsModule, RouterLink, Button],
  templateUrl: './security-auth-page.component.html',
  styleUrl: './security-auth-page.component.scss'
})
export class SecurityAuthPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly issuanceDraft = signal<IssuanceDraft | null>(this.readIssuanceDraft());
  protected readonly otpCooldownSeconds = signal<number>(0);
  protected readonly lastOtpHint = signal<string | null>(null);

  protected readonly form = this.fb.group({
    method: ['hardwareCert' as AuthMethod, [Validators.required]],
    certPassword: ['', [Validators.required, Validators.minLength(6)]],
    otp: ['']
  });

  private readonly methodValue = toSignal(
    this.form.controls.method.valueChanges.pipe(startWith(this.form.controls.method.value)),
    { initialValue: this.form.controls.method.value }
  );

  protected readonly otpRequired = computed(() => this.methodValue() === 'softwareCertOtp');

  constructor() {
    effect(() => {
      if (!this.otpRequired()) this.form.controls.otp.setValue('');
    });
  }

  protected requestOtp(): void {
    if (this.otpCooldownSeconds() > 0) return;
    if (!this.otpRequired()) return;

    const otp = this.generateOtp();
    this.lastOtpHint.set(`測試用 OTP：${otp}`);
    this.otpCooldownSeconds.set(60);

    const timer = window.setInterval(() => {
      const next = this.otpCooldownSeconds() - 1;
      this.otpCooldownSeconds.set(next);
      if (next <= 0) window.clearInterval(timer);
    }, 1000);
  }

  protected executeSignature(): void {
    const draft = this.issuanceDraft();
    if (!draft) return;

    this.form.markAllAsTouched();
    if (!this.form.controls.method.valid || !this.form.controls.certPassword.valid) return;

    if (this.otpRequired()) {
      const otp = (this.form.controls.otp.value ?? '').trim();
      if (!otp) return;
    }

    const result: IssuanceResult = {
      ...draft,
      seqNo: this.generateSeqNo(),
      issuedAt: this.formatDateTime(new Date())
    };

    this.router.navigate(['/echeck/result'], { state: { issuanceResult: result } });
  }

  private readIssuanceDraft(): IssuanceDraft | null {
    const state = (this.router.getCurrentNavigation()?.extras?.state ?? history.state) as {
      issuanceDraft?: IssuanceDraft;
    };

    return state?.issuanceDraft ?? null;
  }

  private generateOtp(): string {
    const n = Math.floor(Math.random() * 1000000);
    return padLeft(String(n), 6);
  }

  private generateSeqNo(): string {
    const tail = Math.floor(Math.random() * 10000000);
    return `999${padLeft(String(tail), 7)}`;
  }

  private formatDateTime(date: Date): string {
    const y = date.getFullYear();
    const m = padLeft(String(date.getMonth() + 1), 2);
    const d = padLeft(String(date.getDate()), 2);
    const hh = padLeft(String(date.getHours()), 2);
    const mm = padLeft(String(date.getMinutes()), 2);
    const ss = padLeft(String(date.getSeconds()), 2);
    return `${y}/${m}/${d} ${hh}:${mm}:${ss}`;
  }
}

