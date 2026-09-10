import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { I18nService, MenuDataService } from '@core/services';
import { OrderPanelService } from '../../order-panel.service';

@Component({
  selector: 'app-order-panel',
  template: `
    <ng-container *ngIf="data.menuData$ | async as menu">
      <div class="mobile-order-bar">
        <a routerLink="/menu" class="btn btn-outline">{{ i18n.translate('menu') }}</a>
        <button type="button" class="btn btn-primary" (click)="open()">{{ i18n.translate('order_now') }}</button>
      </div>
    </ng-container>
    <dialog #panel aria-labelledby="order-panel-title" (click)="backdropClick($event)" (close)="restoreScroll()" (cancel)="restoreScroll()">
      <div class="panel-content">
        <div class="panel-heading">
          <h2 id="order-panel-title">{{ i18n.translate('choose_delivery') }}</h2>
          <button type="button" class="close-panel" (click)="panel.close()" [attr.aria-label]="i18n.translate('close')">×</button>
        </div>
        <p>{{ i18n.translate('delivery_note') }}</p>
        <app-platform-buttons *ngIf="data.menuData$ | async as menu" variant="full"
          [fallbackLinks]="{wolt:menu.settings.externalOrderWoltUrl, uberEats:menu.settings.externalOrderUberEatsUrl}"></app-platform-buttons>
      </div>
    </dialog>
  `,
  styles: [`
    .mobile-order-bar { display:none; }
    dialog { width:min(480px,calc(100% - 2rem)); padding:0; border:1px solid #69505e; border-radius:20px; color:#fff; background:#251d23; max-height:85svh; overflow:auto; }
    dialog::backdrop { background:rgba(0,0,0,.7); }
    .panel-content { padding:1.4rem; }
    .panel-heading { display:flex; gap:1rem; align-items:flex-start; }
    h2 { color:#fff; font-size:1.6rem; flex:1; }
    p { color:var(--text-light); font-size:.95rem; }
    .close-panel { min-width:44px; min-height:44px; background:#45323e; color:white; font-size:1.5rem; }
    @media(max-width:768px) {
      .mobile-order-bar { position:fixed; bottom:0; inset-inline:0; z-index:900; display:grid; grid-template-columns:1fr 2fr; gap:.6rem; padding:.6rem 1rem calc(.6rem + env(safe-area-inset-bottom)); background:#21191f; border-top:1px solid #69505e; }
      .mobile-order-bar .btn { min-height:46px; padding:.6rem; }
      dialog { margin:auto 0 0; width:100%; max-width:none; border-radius:20px 20px 0 0; padding-bottom:env(safe-area-inset-bottom); }
    }
  `]
})
export class OrderPanelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('panel') panel!: ElementRef<HTMLDialogElement>;
  private subscription?: Subscription;
  private previousOverflow: string | null = null;
  constructor(public i18n: I18nService, public data: MenuDataService, private orders: OrderPanelService,
    @Inject(DOCUMENT) private document: Document) {}
  ngAfterViewInit(): void { this.subscription = this.orders.requested.subscribe(() => this.open()); }
  open(): void {
    if (this.panel.nativeElement.open) return;
    this.previousOverflow = this.document.body.style.overflow;
    this.document.body.style.overflow = 'hidden';
    this.panel.nativeElement.showModal();
  }
  backdropClick(event: MouseEvent): void {
    if (event.target === this.panel.nativeElement) this.panel.nativeElement.close();
  }
  restoreScroll(): void {
    if (this.previousOverflow !== null) this.document.body.style.overflow = this.previousOverflow;
    this.previousOverflow = null;
  }
  ngOnDestroy(): void { this.subscription?.unsubscribe(); this.restoreScroll(); }
}
