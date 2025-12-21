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
      <app-cookie-banner></app-cookie-banner>
      
      <!-- Floating Menu Button for Mobile -->
      <a 
        routerLink="/menu" 
        class="floating-menu-btn btn btn-primary"
        [attr.aria-label]="i18nService.translate('view_menu')">
        {{ i18nService.translate('view_menu') }}
      </a>
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
      title: 'Spice Döner - Authentic Bengali Cuisine',
      description: 'Fresh, vibrant Middle Eastern flavors. Hummus bowls, warm pitas, colorful salads crafted daily in Helsinki.',
      keywords: 'hummus, middle eastern food, helsinki restaurant, vegan, vegetarian, healthy food',
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