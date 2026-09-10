import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuDataService, SeoService, I18nService } from '@core/services';
import { MenuItem, SiteSettings, Special } from '@core/models';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero" *ngIf="settings$ | async as settings">
        <div class="hero-visual" aria-hidden="true">
          <app-food-photo [urls]="heroPhoto" alt="" [hero]="true" [priority]="true"></app-food-photo>
        </div>
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <p class="hero-kicker">Malminkaari 9 · Helsinki</p>
              <h1 class="hero-title">
                <app-brand-wordmark
                  *ngIf="i18n.getLocalizedContent(settings.heroTitle) === 'Spice Döner'; else customHeroTitle">
                </app-brand-wordmark>
                <ng-template #customHeroTitle>{{ i18n.getLocalizedContent(settings.heroTitle) }}</ng-template>
              </h1>
              <p class="hero-subtitle">
                {{ i18n.getLocalizedContent(settings.heroSubtitle) }}
              </p>
              <div class="hero-actions">
                <a 
                  [routerLink]="settings.ctaPrimaryLink" 
                  class="btn btn-primary btn-lg">
                  {{ i18n.getLocalizedContent(settings.ctaPrimaryText) }}
                </a>
                <app-platform-buttons 
                  [variant]="'compact'"
                  [fallbackLinks]="{
                    wolt: settings.externalOrderWoltUrl,
                    uberEats: settings.externalOrderUberEatsUrl
                  }">
                </app-platform-buttons>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="visit-strip"><div class="container"><app-visit-info [compact]="true"></app-visit-info></div></section>

      <!-- Signature dishes -->
      <section class="section signature-section" *ngIf="featuredItems$ | async as featuredItems">
        <div class="container">
          <div class="section-header signature-header">
            <p class="section-eyebrow">{{ i18n.translate('from_our_kitchen') }}</p>
            <h2>{{ i18n.translate('made_for_first_bite') }}</h2>
            <p class="text-muted">{{ i18n.translate('signature_intro') }}</p>
            <a routerLink="/menu" class="text-link">{{ i18n.translate('explore_full_menu') }} <span aria-hidden="true">↗</span></a>
          </div>

          <div class="signature-grid">
            <article class="signature-card" *ngFor="let item of featuredItems; let i = index">
              <div class="signature-image" *ngIf="item.imageUrl">
                <app-food-photo [urls]="[item.imageUrl]" [alt]="i18n.getLocalizedContent(item.name)"></app-food-photo>
                <span class="signature-number">0{{ i + 1 }}</span>
              </div>
              <div class="signature-body">
                <div class="signature-title-row">
                  <h3>{{ i18n.getLocalizedContent(item.name) }}</h3>
                  <span class="signature-price">{{ i18n.formatPrice(item.discountPrice || item.price, item.currency) }}</span>
                </div>
                <p>{{ shortDescription(item) }}</p>
                <a class="text-link" routerLink="/menu" [fragment]="'dish-' + item.id">{{ i18n.translate('view_dish') }} →</a>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="highlights section-sm">
        <div class="container">
          <h2>{{ i18n.translate('Why Choose Spice Döner?') }}</h2>
          <div class="benefit-list">
            <span *ngFor="let benefit of benefits">{{ i18n.translate(benefit) }}</span>
          </div>
          <a routerLink="/menu" class="text-link">{{ i18n.translate('dietary_guide') }} →</a>
        </div>
      </section>

      <!-- Specials Section -->
      <ng-container *ngIf="activeSpecials$ | async as specials">
      <section class="section specials" *ngIf="specials.length">
        <div class="container">
          <div class="section-header text-center">
            <h2>{{ i18n.translate('Current Specials') }}</h2>
            <p class="text-muted">{{ i18n.translate('Limited time offers') }}</p>
          </div>
          
          <div class="grid grid-2">
            <div *ngFor="let special of specials; trackBy: trackBySpecialId" class="special-card card">
              <div class="card-body">
                <h3 class="special-title">{{ i18n.getLocalizedContent(special.title) }}</h3>
                <p class="special-description">{{ i18n.getLocalizedContent(special.description) }}</p>
                <div class="special-price">
                  <span 
                    *ngIf="special.discountPrice" 
                    class="price-original">
                    {{ i18n.formatPrice(special.price) }}
                  </span>
                  <span class="price-current">
                    {{ i18n.formatPrice(special.discountPrice || special.price) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      </ng-container>
      <!-- CTA Section -->
      <section class="section cta-section">
        <div class="container">
          <div class="cta-content text-center">
            <h2>{{ i18n.translate('Ready to order?') }}</h2>
            <p class="text-muted">{{ i18n.translate('Choose from our delivery partners') }}</p>
            <div class="cta-actions" *ngIf="settings$ | async as settings">
              <app-platform-buttons 
                [variant]="'full'"
                [fallbackLinks]="{
                  wolt: settings.externalOrderWoltUrl,
                  uberEats: settings.externalOrderUberEatsUrl
                }">
              </app-platform-buttons>
            </div>
          </div>
        </div>
      </section>

      <!-- Location Section -->
      <section class="section location-section">
        <div class="container">
          <div class="section-header text-center">
            <h2>{{ i18n.translate('Find Us') }}</h2>
            <p class="text-muted">{{ i18n.translate('Visit our restaurant in Helsinki') }}</p>
          </div>
          
          <div class="grid grid-2 location-grid" *ngIf="settings$ | async as settings">
            <div class="location-info">
              <div class="info-card card">
                <div class="card-body">
                  <app-visit-info></app-visit-info>
                </div>
              </div>
            </div>
            
            <div class="location-map">
              <div class="map-container">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1949.8766879397847!2d25.010456716094384!3d60.25114438197743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x468df60c2b3d6a8d%3A0x5048c73b8e4b1c1e!2sMalminkaari%209%2C%2000700%20Helsinki!5e0!3m2!1sen!2sfi!4v1703078400000!5m2!1sen!2sfi"
                  width="100%" 
                  height="350"
                  style="border:0; border-radius: 8px;" 
                  allowfullscreen="" 
                  loading="lazy" 
                  referrerpolicy="no-referrer-when-downgrade"
                  [attr.aria-label]="'Map showing location of Spice Döner at Malminkaari 9, Helsinki'">
                </iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  readonly heroPhoto = ['assets/images/Items/Kana Döner.jpg'];
  readonly benefits = ['Fresh Daily', 'Vegan', 'Vegetarian', 'Gluten Free', 'Lactose Free', 'Halal'];
  settings$: Observable<SiteSettings | null>;
  specials$: Observable<Special[]>;
  activeSpecials$: Observable<Special[]>;
  featuredItems$: Observable<MenuItem[]>;
  constructor(
    private menuDataService: MenuDataService,
    private seoService: SeoService,
    public i18n: I18nService
  ) {
    this.settings$ = this.menuDataService.menuData$.pipe(
      map(data => data?.settings || null)
    );
    
    this.specials$ = this.menuDataService.menuData$.pipe(
      map(data => data?.specials || [])
    );
    
    this.activeSpecials$ = this.menuDataService.menuData$.pipe(
      map(data => data?.specials?.filter((special: Special) => special.active) || [])
    );

    this.featuredItems$ = this.menuDataService.menuData$.pipe(
      map(data => data?.items?.filter((item: MenuItem) => item.available).slice(0, 3) || [])
    );
  }

  ngOnInit(): void {
    // Update SEO for home page
    this.settings$.subscribe(settings => {
      if (settings) {
        this.seoService.updateSeoData({
          title: this.i18n.getLocalizedContent(settings.heroTitle) + ' - Fresh Middle Eastern Cuisine',
          description: this.i18n.getLocalizedContent(settings.heroSubtitle),
          keywords: 'hummus, middle eastern food, helsinki restaurant, vegan, vegetarian, healthy food, fresh',
          type: 'website'
        });

        // Generate JSON-LD structured data
        this.seoService.generateRestaurantJsonLd(settings);
      }
    });

  }

  shortDescription(item: MenuItem): string {
    const text = this.i18n.getLocalizedContent(item.description);
    if (text.length <= 90) return text;
    const excerpt = text.slice(0, 90);
    return excerpt.slice(0, excerpt.lastIndexOf(' ')) + '…';
  }

  trackBySpecialId(index: number, special: Special): string {
    return special.id || index.toString();
  }
}
