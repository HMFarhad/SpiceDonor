import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalyticsService, I18nService } from '@core/services';

@Component({
  selector: 'app-cookie-banner',
  template: `
    <div class="cookie-banner" *ngIf="showBanner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-description">
      <div class="container">
        <div class="cookie-content">
          <div class="cookie-text">
            <h3 id="cookie-title" class="cookie-title">{{ i18n.translate('cookie_consent') }}</h3>
            <p id="cookie-description" class="cookie-description">
              {{ i18n.translate('cookie_description') }}
            </p>
          </div>
          <div class="cookie-actions">
            <button class="btn btn-outline" (click)="declineConsent()">
              {{ i18n.translate('decline_cookies') }}
            </button>
            <button class="btn btn-primary" (click)="acceptConsent()">
              {{ i18n.translate('accept_cookies') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./cookie-banner.component.scss']
})
export class CookieBannerComponent implements OnInit, OnDestroy {
  showBanner = false;
  private destroy$ = new Subject<void>();

  constructor(
    private analyticsService: AnalyticsService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    // Check if consent has already been given or denied
    const hasConsentDecision = this.hasConsentDecision();
    this.showBanner = !hasConsentDecision;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  acceptConsent(): void {
    this.analyticsService.giveConsent();
    this.showBanner = false;
  }

  declineConsent(): void {
    this.analyticsService.withdrawConsent();
    this.showBanner = false;
  }

  private hasConsentDecision(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }
    return localStorage.getItem('analytics_consent') !== null;
  }
}