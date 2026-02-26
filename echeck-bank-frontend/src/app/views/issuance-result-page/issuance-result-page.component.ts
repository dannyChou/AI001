import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

import { formatTwdAmount } from '../../utils/formatters';

type IssuanceResult = {
  seqNo: string;
  checkNo: string;
  payeeName: string;
  amount: number;
  issuedAt: string;
};

@Component({
  selector: 'app-issuance-result-page',
  imports: [RouterLink, Button],
  templateUrl: './issuance-result-page.component.html',
  styleUrl: './issuance-result-page.component.scss'
})
export class IssuanceResultPageComponent {
  private readonly router = inject(Router);

  protected readonly result = signal<IssuanceResult | null>(this.readResult());
  protected readonly amountText = computed(() => {
    const r = this.result();
    if (!r) return '';
    return formatTwdAmount(r.amount);
  });

  protected backHome(): void {
    this.router.navigate(['/menu']);
  }

  protected downloadCertificate(): void {
    const r = this.result();
    if (!r) return;

    const content = [
      'E-Check Issuance Certificate',
      `seqNo: ${r.seqNo}`,
      `checkNo: ${r.checkNo}`,
      `payee: ${r.payeeName}`,
      `amount: ${r.amount}`,
      `issuedAt: ${r.issuedAt}`,
      ''
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `echeck-${r.checkNo}-certificate.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  protected print(): void {
    window.print();
  }

  private readResult(): IssuanceResult | null {
    const state = (this.router.getCurrentNavigation()?.extras?.state ?? history.state) as {
      issuanceResult?: IssuanceResult;
    };
    return state?.issuanceResult ?? null;
  }
}

