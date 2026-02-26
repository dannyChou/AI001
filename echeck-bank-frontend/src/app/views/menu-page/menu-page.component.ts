import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

type FeatureCard = {
  title: string;
  description: string;
  route?: string;
  disabled?: boolean;
};

@Component({
  selector: 'app-menu-page',
  imports: [RouterLink, Button],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.scss'
})
export class MenuPageComponent {
  protected readonly featureCards: FeatureCard[] = [
    {
      title: '支票簽發',
      description: '填寫簽發資料、預覽樣張並完成安控驗證後送出。',
      route: '/echeck/issuance'
    },
    {
      title: '空白票請領',
      description: '尚未開放（線框稿未包含流程畫面）。',
      disabled: true
    },
    {
      title: '背書轉讓',
      description: '尚未開放（線框稿未包含流程畫面）。',
      disabled: true
    },
    {
      title: '支票退回/作廢',
      description: '尚未開放（線框稿未包含流程畫面）。',
      disabled: true
    },
    {
      title: '記錄查詢',
      description: '尚未開放（線框稿未包含流程畫面）。',
      disabled: true
    }
  ];
}

