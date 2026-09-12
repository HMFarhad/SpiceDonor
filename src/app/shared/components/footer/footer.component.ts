import { Component } from '@angular/core';
import { MenuDataService, I18nService } from '@core/services';
import { Observable } from 'rxjs';
import { SiteSettings } from '@core/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <div class="footer-logo">
              <img src="assets/images/logo.jpg" alt="" class="footer-logo-image">
              <app-brand-wordmark class="footer-logo-text"></app-brand-wordmark>
            </div>
            <p class="footer-description" *ngIf="settings$ | async as settings">
              {{ i18n.getLocalizedContent(settings.heroSubtitle) }}
            </p>
            <div class="footer-social" *ngIf="settings$ | async as settings">
              <a 
                *ngIf="settings.instagramUrl" 
                [href]="settings.instagramUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
                aria-label="Follow us on Instagram">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12,2.163c3.204,0,3.584,0.012,4.85,0.07c3.252,0.148,4.771,1.691,4.919,4.919c0.058,1.265,0.069,1.645,0.069,4.849 c0,3.205-0.012,3.584-0.069,4.849c-0.149,3.225-1.664,4.771-4.919,4.919c-1.266,0.058-1.644,0.07-4.85,0.07 s-3.584-0.012-4.849-0.07c-3.26-0.149-4.771-1.699-4.919-4.92c-0.058-1.265-0.07-1.644-0.07-4.849 c0-3.204,0.013-3.583,0.07-4.849c0.149-3.227,1.664-4.771,4.919-4.919C8.416,2.175,8.796,2.163,12,2.163 M12,0 C8.741,0,8.333,0.014,7.053,0.072C2.695,0.272,0.273,2.69,0.073,7.052C0.014,8.333,0,8.741,0,12c0,3.259,0.014,3.668,0.072,4.948 c0.2,4.358,2.618,6.78,6.98,6.98C8.333,23.986,8.741,24,12,24c3.259,0,3.668-0.014,4.948-0.072 c4.354-0.2,6.782-2.618,6.979-6.98C23.986,15.668,24,15.259,24,12c0-3.259-0.014-3.667-0.072-4.947 c-0.196-4.354-2.617-6.78-6.979-6.98C15.668,0.014,15.259,0,12,0L12,0z M12,5.838c-3.403,0-6.162,2.759-6.162,6.162 c0,3.403,2.759,6.162,6.162,6.162s6.162-2.759,6.162-6.162C18.162,8.597,15.403,5.838,12,5.838L12,5.838z M12,16 c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4S14.209,16,12,16L12,16z M19.846,4.77c0.795,0,1.439,0.647,1.439,1.44 s-0.644,1.439-1.439,1.439c-0.795,0-1.439-0.644-1.439-1.439S19.051,4.77,19.846,4.77L19.846,4.77z"/>
                </svg>
              </a>
              <a 
                *ngIf="settings.facebookUrl" 
                [href]="settings.facebookUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
                aria-label="Follow us on Facebook">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                *ngIf="settings.tiktokUrl" 
                [href]="settings.tiktokUrl" 
                target="_blank" 
                rel="noopener noreferrer"
                class="social-link"
                aria-label="Follow us on TikTok">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path d="M12.525,1.973c0.79,0,1.431,0,2.22,0c0.12,1.26,0.61,2.46,1.38,3.4c0.77,0.94,1.81,1.64,2.97,1.96v3.18c-1.03-0.22-2.1-0.64-2.97-1.29c-0.31-0.23-0.6-0.5-0.86-0.8v6.38c0,3.18-2.58,5.76-5.76,5.76s-5.76-2.58-5.76-5.76s2.58-5.76,5.76-5.76c0.3,0,0.59,0.02,0.88,0.07v3.24c-0.29-0.06-0.59-0.09-0.9-0.09c-1.42,0-2.57,1.15-2.57,2.57s1.15,2.57,2.57,2.57s2.57-1.15,2.57-2.57V1.973H12.525z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">{{ i18n.translate('menu') }}</h4>
            <ul class="footer-links">
              <li><a routerLink="/menu" class="footer-link">{{ i18n.translate('view_menu') }}</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">{{ i18n.translate('contact') }}</h4>
            <div class="footer-contact" *ngIf="settings$ | async as settings">
              <p *ngIf="settings.phone">
                <a [href]="'tel:' + settings.phone" class="footer-link">{{ settings.phone }}</a>
              </p>
              <p *ngIf="settings.email">
                <a [href]="'mailto:' + settings.email" class="footer-link">{{ settings.email }}</a>
              </p>
              <p *ngIf="settings.addressLine1" class="footer-address">
                {{ settings.addressLine1 }}<br>
                <span *ngIf="settings.addressLine2">{{ settings.addressLine2 }}<br></span>
                {{ settings.postalCode }} {{ settings.city }}
              </p>
            </div>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">{{ i18n.translate('order_now') }}</h4>
            <app-platform-buttons [variant]="'compact'" [fallbackLinks]="orderLinks$ | async"></app-platform-buttons>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-legal">
            <a routerLink="/privacy" class="footer-link">{{ i18n.translate('privacy_policy') }}</a>
            <span class="footer-separator">•</span>
            <a routerLink="/terms" class="footer-link">{{ i18n.translate('terms_of_service') }}</a>
          </div>
          <div class="footer-copyright">
            <p>&copy; {{ currentYear }} Spice Döners Suomi Oy · Business ID 3614901-8. {{ i18n.translate('rights_reserved') }}</p>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  settings$: Observable<SiteSettings | null>;
  orderLinks$: Observable<any>;
  currentYear = new Date().getFullYear();

  constructor(
    private menuDataService: MenuDataService,
    public i18n: I18nService
  ) {
    this.settings$ = this.menuDataService.menuData$.pipe(
      map(data => data?.settings || null)
    );

    this.orderLinks$ = this.settings$.pipe(
      map(settings => settings ? {
        wolt: settings.externalOrderWoltUrl,
        uberEats: settings.externalOrderUberEatsUrl
      } : null)
    );
  }
}
