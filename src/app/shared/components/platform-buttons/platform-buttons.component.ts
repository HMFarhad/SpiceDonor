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
        <span class="platform-icon wolt-icon">🛵</span>
        <span *ngIf="variant !== 'icons'" class="platform-text">
          {{ variant === 'compact' ? 'Wolt' : 'Order on Wolt' }}
        </span>
      </button>

      <button 
        *ngIf="orderLinks?.foodora || fallbackLinks?.foodora"
        (click)="onOrderClick('foodora', orderLinks?.foodora || fallbackLinks?.foodora!)"
        class="platform-btn foodora-btn"
        [attr.aria-label]="'Order on Foodora'">
        <span class="platform-icon foodora-icon">🍕</span>
        <span *ngIf="variant !== 'icons'" class="platform-text">
          {{ variant === 'compact' ? 'Foodora' : 'Order on Foodora' }}
        </span>
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