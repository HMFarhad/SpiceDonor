import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuDataService, SeoService, I18nService } from '@core/services';
import { MenuItem, SiteSettings, Special } from '@core/models';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero" *ngIf="settings$ | async as settings">
        <div class="hero-slides" aria-hidden="true">
          <img
            *ngFor="let imageUrl of heroLayerImages; let layerIndex = index"
            [src]="imageUrl"
            [class.active]="layerIndex === activeHeroLayer"
            (load)="onHeroImageLoad(layerIndex)"
            alt="">
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
                <img [src]="item.imageUrl" [alt]="i18n.getLocalizedContent(item.name)" loading="lazy">
                <span class="signature-number">0{{ i + 1 }}</span>
              </div>
              <div class="signature-body">
                <div class="signature-title-row">
                  <h3>{{ i18n.getLocalizedContent(item.name) }}</h3>
                  <span class="signature-price">{{ i18n.formatPrice(item.discountPrice || item.price, item.currency) }}</span>
                </div>
                <p>{{ i18n.getLocalizedContent(item.description) }}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <!-- Highlights Section -->
      <section class="section highlights">
        <div class="container">
          <div class="section-header text-center">
            <h2>{{ i18n.translate('Why Choose Spice Döner?') }}</h2>
            <p class="text-muted">{{ i18n.translate('Fresh ingredients, authentic flavors, healthy options') }}</p>
            <small class="logo-dietary-text">
              {{ i18n.translate('L = Lactose Free | G = Gluten Free | K = Vegetarian | V = Vegan | H = Halal') }}
            </small>
          </div>
          
          <div class="grid grid-3">
            <div class="highlight-card card fresh-daily-bg">
              <div class="card-body text-center">
                <div class="highlight-icon"></div>
                <h3 class="highlight-title">{{ i18n.translate('Fresh Daily') }}</h3>
                <p class="text-muted">{{ i18n.translate('All ingredients are sourced fresh and prepared daily in our kitchen.') }}</p>
              </div>
            </div>

            <div class="highlight-card card vegan-bg">
              <div class="card-body text-center">
                <div class="highlight-icon"></div>
                <h3 class="highlight-title">{{ i18n.translate('Vegan') }}</h3>
                <p class="text-muted">{{ i18n.translate('Delicious plant-based options perfect for vegan diets.') }}</p>
              </div>
            </div>

            <div class="highlight-card card vegetarian-bg">
              <div class="card-body text-center">
                <div class="highlight-icon"></div>
                <h3 class="highlight-title">{{ i18n.translate('Vegetarian') }}</h3>
                <p class="text-muted">{{ i18n.translate('Wide selection of vegetarian dishes for every taste.') }}</p>
              </div>
            </div>

            <div class="highlight-card card gluten-free-bg">
              <div class="card-body text-center">
                <div class="highlight-icon"></div>
                <h3 class="highlight-title">{{ i18n.translate('Gluten Free') }}</h3>
                <p class="text-muted">{{ i18n.translate('Many gluten-free options available for dietary restrictions.') }}</p>
              </div>
            </div>

            <div class="highlight-card card lactose-free-bg">
              <div class="card-body text-center">
                <div class="highlight-icon"></div>
                <h3 class="highlight-title">{{ i18n.translate('Lactose Free') }}</h3>
                <p class="text-muted">{{ i18n.translate('Dairy-free alternatives for lactose intolerant guests.') }}</p>
              </div>
            </div>

            <div class="highlight-card card halal-bg">
              <div class="card-body text-center">
                <div class="highlight-icon"></div>
                <h3 class="highlight-title">{{ i18n.translate('Halal') }}</h3>
                <p class="text-muted">{{ i18n.translate('All our meat is halal-certified following Islamic dietary laws.') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Specials Section -->
      <section class="section specials" *ngIf="activeSpecials$ | async as specials">
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
                  <h3>{{ i18n.translate('Location') }}</h3>
                  <p class="address">
                    <strong>{{ settings.addressLine1 }}</strong><br>
                    {{ settings.postalCode }} {{ settings.city }}
                  </p>
                  
                  <h4>{{ i18n.translate('Opening Hours') }}</h4>
                  <ul class="hours-list">
                    <li>{{ i18n.translate('Monday - Friday') }}: 11:00 - 21:00</li>
                    <li>{{ i18n.translate('Saturday') }}: 12:00 - 22:00</li>
                    <li>{{ i18n.translate('Sunday') }}: 12:00 - 20:00</li>
                  </ul>
                  
                  <h4>{{ i18n.translate('Contact') }}</h4>
                  <p class="contact-info">
                    <strong>{{ i18n.translate('Phone') }}:</strong> {{ settings.phone }}<br>
                    <strong>{{ i18n.translate('Email') }}:</strong> {{ settings.email }}
                  </p>
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
export class HomeComponent implements OnInit, OnDestroy {
  private readonly heroSlideDuration = 2500;
  private readonly heroCrossfadeDuration = 800;
  private heroImages: string[] = [];
  private heroSlideTimer?: ReturnType<typeof setInterval>;
  private heroPreloadTimer?: ReturnType<typeof setTimeout>;
  private heroDataSubscription?: Subscription;
  private currentHeroImageIndex = 0;
  private heroLayerLoaded = [false, false];

  settings$: Observable<SiteSettings | null>;
  specials$: Observable<Special[]>;
  activeSpecials$: Observable<Special[]>;
  featuredItems$: Observable<MenuItem[]>;
  heroLayerImages: string[] = ['assets/images/image1.jpg', 'assets/images/image1.jpg'];
  activeHeroLayer = 0;

  constructor(
    private menuDataService: MenuDataService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object,
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
    this.heroDataSubscription = this.menuDataService.menuData$.subscribe(data => {
      if (!data) return;

      const imageUrls = Array.from(new Set(
        data.items
          .filter((item: MenuItem) => item.available)
          .flatMap((item: MenuItem) => item.imageUrls)
      ));
      this.configureHeroSlider(imageUrls);
    });

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

  ngOnDestroy(): void {
    this.heroDataSubscription?.unsubscribe();
    this.stopHeroSlider();
  }

  onHeroImageLoad(layerIndex: number): void {
    this.heroLayerLoaded[layerIndex] = true;
  }

  private configureHeroSlider(imageUrls: string[]): void {
    this.stopHeroSlider();
    this.heroImages = imageUrls.length ? imageUrls : ['assets/images/image1.jpg'];
    this.currentHeroImageIndex = 0;
    this.activeHeroLayer = 0;
    this.heroLayerLoaded = [false, false];
    this.heroLayerImages = [
      this.heroImages[0],
      this.heroImages[1] || this.heroImages[0]
    ];

    if (
      !isPlatformBrowser(this.platformId)
      || this.heroImages.length < 2
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    this.heroSlideTimer = setInterval(() => this.advanceHeroImage(), this.heroSlideDuration);
  }

  private advanceHeroImage(): void {
    const nextLayer = this.activeHeroLayer === 0 ? 1 : 0;
    if (!this.heroLayerLoaded[nextLayer]) return;

    this.currentHeroImageIndex = (this.currentHeroImageIndex + 1) % this.heroImages.length;
    this.activeHeroLayer = nextLayer;

    if (this.heroPreloadTimer) clearTimeout(this.heroPreloadTimer);
    this.heroPreloadTimer = setTimeout(() => {
      const preloadLayer = this.activeHeroLayer === 0 ? 1 : 0;
      const preloadIndex = (this.currentHeroImageIndex + 1) % this.heroImages.length;
      const nextImageUrl = this.heroImages[preloadIndex];

      if (this.heroLayerImages[preloadLayer] !== nextImageUrl) {
        const updatedLayers = [...this.heroLayerImages];
        updatedLayers[preloadLayer] = nextImageUrl;
        this.heroLayerLoaded[preloadLayer] = false;
        this.heroLayerImages = updatedLayers;
      }
    }, this.heroCrossfadeDuration);
  }

  private stopHeroSlider(): void {
    if (this.heroSlideTimer) clearInterval(this.heroSlideTimer);
    if (this.heroPreloadTimer) clearTimeout(this.heroPreloadTimer);
    this.heroSlideTimer = undefined;
    this.heroPreloadTimer = undefined;
  }

  trackBySpecialId(index: number, special: Special): string {
    return special.id || index.toString();
  }
}
