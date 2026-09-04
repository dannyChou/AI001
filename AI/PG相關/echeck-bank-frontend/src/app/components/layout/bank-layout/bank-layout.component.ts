import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';

type NavItem = {
  label: string;
  route?: string;
  disabled?: boolean;
};

type NavGroup = {
  title: string;
  items: NavItem[];
};

@Component({
  selector: 'app-bank-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './bank-layout.component.html',
  styleUrl: './bank-layout.component.scss'
})
export class BankLayoutComponent {
  private readonly router = inject(Router);

  protected readonly pageTitle = signal<string>('電子支票服務');

  protected readonly navGroups: NavGroup[] = [
    {
      title: '預約轉帳',
      items: [{ label: '預約轉帳', disabled: true }]
    },
    {
      title: '電子支票功能',
      items: [
        { label: '支票簽發', route: '/echeck/issuance' },
        { label: '空白票請領', disabled: true },
        { label: '背書轉讓', disabled: true },
        { label: '支票退回/作廢', disabled: true },
        { label: '記錄查詢', disabled: true }
      ]
    },
    {
      title: '帳戶管理',
      items: [{ label: '帳戶管理', disabled: true }]
    }
  ];

  protected readonly showMenuHint = computed(() => this.router.url === '/menu' || this.router.url === '/');

  constructor() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe(() => {
      const title = this.getDeepestRouteTitle();
      this.pageTitle.set(title ?? '電子支票服務');
    });
    this.pageTitle.set(this.getDeepestRouteTitle() ?? '電子支票服務');
  }

  private getDeepestRouteTitle(): string | undefined {
    const root = this.router.routerState?.root;
    if (!root) return undefined;

    let route: typeof root | null = root;
    while (route?.firstChild) route = route.firstChild;

    const data = route?.snapshot?.data as Record<string, unknown> | undefined;
    const title = data?.['title'];
    return typeof title === 'string' ? title : undefined;
  }
}

