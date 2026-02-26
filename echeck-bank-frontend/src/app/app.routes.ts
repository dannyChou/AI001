import { Routes } from '@angular/router';

import { BankLayoutComponent } from './components/layout/bank-layout/bank-layout.component';
import { IssuanceFormPageComponent } from './views/issuance-form-page/issuance-form-page.component';
import { IssuanceResultPageComponent } from './views/issuance-result-page/issuance-result-page.component';
import { MenuPageComponent } from './views/menu-page/menu-page.component';
import { SecurityAuthPageComponent } from './views/security-auth-page/security-auth-page.component';

export const routes: Routes = [
  {
    path: '',
    component: BankLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'menu' },
      { path: 'menu', component: MenuPageComponent, data: { title: '電子支票功能' } },
      { path: 'echeck/issuance', component: IssuanceFormPageComponent, data: { title: '電子支票簽發申請' } },
      { path: 'echeck/security', component: SecurityAuthPageComponent, data: { title: '安全機制驗證' } },
      { path: 'echeck/result', component: IssuanceResultPageComponent, data: { title: '簽發完成' } },
      { path: '**', redirectTo: 'menu' }
    ]
  }
];
