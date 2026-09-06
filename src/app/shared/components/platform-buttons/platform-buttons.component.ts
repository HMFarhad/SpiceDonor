import { Component, Input } from '@angular/core';
import { OrderLinks } from '@core/models';
import { AnalyticsService } from '@core/services';

type ButtonVariant = 'full' | 'compact' | 'icons';

@Component({
  selector: 'app-platform-buttons',
  template: `
    <div class="platform-buttons" [attr.data-variant]="variant">
      <button 
        *ngIf="orderLinks?.wolt || fallbackLinks?.wolt"
        (click)="onOrderClick('wolt', orderLinks?.wolt || fallbackLinks?.wolt!)"
        class="platform-btn wolt-btn"
        [attr.aria-label]="'Order on Wolt'">
        <img src="assets/images/wolt_logo.jpg" alt="Wolt" 
             [class]="variant === 'icons' ? 'platform-icon wolt-icon' : 'platform-logo wolt-logo'">
        <span *ngIf="variant === 'full'" class="platform-text">Order Now</span>
      </button>

      <button 
        *ngIf="orderLinks?.uberEats || fallbackLinks?.uberEats"
        (click)="onOrderClick('uber-eats', orderLinks?.uberEats || fallbackLinks?.uberEats!)"
        class="platform-btn uber-eats-btn"
        [attr.aria-label]="'Order on Uber Eats'">
        <img src="assets/images/uber_eats_logo.svg" alt="Uber Eats" 
             [class]="variant === 'icons' ? 'platform-icon uber-eats-icon' : 'platform-logo uber-eats-logo'">
        <span *ngIf="variant === 'full'" class="platform-text">Order Now</span>
      </button>
    </div>
  `,
  styleUrls: ['./platform-buttons.component.scss']
})
export class PlatformButtonsComponent {
  @Input() orderLinks?: OrderLinks;
  @Input() fallbackLinks?: OrderLinks;
  @Input() variant: ButtonVariant = 'full';
  @Input() itemId?: string;

  constructor(private analyticsService: AnalyticsService) {}

  onOrderClick(platform: string, url: string): void {
    this.analyticsService.trackExternalOrder(platform, this.itemId);
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
