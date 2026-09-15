import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { I18nService, SeoService, AnalyticsService } from '@core/services';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-header></app-header>
      <main role="main">
        <router-outlet></router-outlet>
      </main>
      <app-footer></app-footer>
      <app-order-panel></app-order-panel>
      <app-cookie-banner></app-cookie-banner>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    public i18nService: I18nService,
    private seoService: SeoService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    // Set initial SEO data
    this.seoService.updateSeoData({
      title: 'Spice Döner Helsinki | Döner Kebab at Forum',
      description: 'Spice Döner serves döner kebab, falafel, hummus and mezze at Forum food court, Mannerheimintie 20 in central Helsinki.',
      keywords: 'Spice Döner, Spice Doner, döner Helsinki, doner Helsinki, kebab Helsinki, Forum Helsinki restaurant',
      url: '/',
      type: 'website'
    });

    // Track language changes for analytics
    this.i18nService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(language => {
        this.analyticsService.trackLanguageChange(language);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
