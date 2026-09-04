import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

import { formatDateYmd, formatTwdAmount } from '../../utils/formatters';

type PayeeType = 'corp' | 'person';
type IdentityType = 'taxId' | 'mobile' | 'accountName' | 'ssnLast4';

type IssuanceDraft = {
  checkNo: string;
  issuerName: string;
  issueDateYmd: string;
  payeeName: string;
  amount: number;
};

function isIntegerString(value: string): boolean {
  return /^[0-9]+$/.test(value);
}

@Component({
  selector: 'app-issuance-form-page',
  imports: [ReactiveFormsModule, Button, Dialog],
  templateUrl: './issuance-form-page.component.html',
  styleUrl: './issuance-form-page.component.scss'
})
export class IssuanceFormPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly issuerTaxId = '15639870';
  protected readonly issuerName = '票交測試公司';
  protected readonly paymentPlace = '台北市中正區';
  protected readonly issuerAccounts = ['123-456-789012', '987-654-321098'];
  protected readonly checkNo = 'TCH9074863';

  protected readonly bankOptions = ['XX銀行 南門分行', 'XX銀行 總行營業部', 'XX銀行 松山分行'];

  protected readonly previewVisible = signal(false);
  protected readonly verifiedPayeeName = signal<string | null>(null);

  protected readonly form = this.fb.group({
    issuerAccount: [this.issuerAccounts[0], [Validators.required]],
    amount: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    issueDate: [this.todayAsInputValue(), [Validators.required]],
    negotiable: [true],
    remark: [''],
    payeeType: ['corp' as PayeeType, [Validators.required]],
    payeeBank: [this.bankOptions[0], [Validators.required]],
    payeeAccount: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16), Validators.pattern(/^[0-9]{16}$/)]],
    identityType: ['taxId' as IdentityType, [Validators.required]],
    identityValue: ['', [Validators.required]]
  });

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() }
  );

  private readonly payeeIdentityKey = computed(() => {
    const v = this.formValue();
    return [
      v.payeeType,
      v.payeeBank,
      v.payeeAccount,
      v.identityType,
      v.identityValue
    ].join('|');
  });

  protected readonly amountNumber = computed(() => {
    const raw = this.formValue().amount ?? '';
    return isIntegerString(raw) ? Number(raw) : null;
  });

  protected readonly issueDateYmd = computed(() => {
    const raw = this.formValue().issueDate ?? '';
    if (!raw) return '';
    const date = new Date(`${raw}T00:00:00`);
    return formatDateYmd(date);
  });

  protected readonly amountTwdText = computed(() => {
    const amount = this.amountNumber();
    if (amount == null) return '';
    return formatTwdAmount(amount);
  });

  constructor() {
    effect(() => {
      void this.payeeIdentityKey();
      this.verifiedPayeeName.set(null);
    });
  }

  protected openPreview(): void {
    this.form.markAllAsTouched();
    if (!this.form.valid) return;
    this.previewVisible.set(true);
  }

  protected reset(): void {
    this.form.reset({
      issuerAccount: this.issuerAccounts[0],
      amount: '',
      issueDate: this.todayAsInputValue(),
      negotiable: true,
      remark: '',
      payeeType: 'corp',
      payeeBank: this.bankOptions[0],
      payeeAccount: '',
      identityType: 'taxId',
      identityValue: ''
    });
    this.verifiedPayeeName.set(null);
  }

  protected verifyPayeeName(): void {
    this.form.markAllAsTouched();
    if (!this.form.controls.payeeAccount.valid || !this.form.controls.identityValue.valid) return;
    this.verifiedPayeeName.set('○界線上金○股份有限公司');
  }

  protected confirmIssuance(): void {
    const amount = this.amountNumber();
    const payeeName = this.verifiedPayeeName();
    if (amount == null || !payeeName) return;

    const draft: IssuanceDraft = {
      checkNo: this.checkNo,
      issuerName: this.issuerName,
      issueDateYmd: this.issueDateYmd(),
      payeeName,
      amount
    };

    this.previewVisible.set(false);
    this.router.navigate(['/echeck/security'], { state: { issuanceDraft: draft } });
  }

  private todayAsInputValue(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}

