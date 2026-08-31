import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuDataService, SeoService, I18nService } from '@core/services';
import { SiteSettings, Special } from '@core/models';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero" 
               [class.slide-background]="true"
               [style.background-image]="'url(' + currentBackgroundImage + ')'"
               *ngIf="settings$ | async as settings">
        
        <!-- Slider Controls -->
        <div class="slider-controls">
          <button class="slider-btn slider-prev" (click)="previousImage()" aria-label="Previous image">
            <span class="slider-icon">‹</span>
          </button>
          <button class="slider-btn slider-next" (click)="nextImage()" aria-label="Next image">
            <span class="slider-icon">›</span>
          </button>
        </div>

        <!-- Slider Indicators -->
        <div class="slider-indicators">
          <button 
            *ngFor="let image of backgroundImages; let i = index" 
            class="slider-dot"
            [class.active]="i === currentImageIndex"
            (click)="goToSlide(i)"
            [attr.aria-current]="i === currentImageIndex ? 'true' : null"
            [attr.aria-label]="'Go to slide ' + (i + 1)">
          </button>
        </div>

        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <p class="hero-kicker">Malminkaari 9 · Helsinki</p>
              <h1 class="hero-title">
                {{ i18n.getLocalizedContent(settings.heroTitle) }}
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
                    foodora: settings.externalOrderFoodoraUrl
                  }">
                </app-platform-buttons>
              </div>
            </div>
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
              {{ i18n.translate('L = Lactose Free | G = Gluten Free | K = Vegetarian | V = Vegan') }}
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
                  foodora: settings.externalOrderFoodoraUrl
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
  settings$: Observable<SiteSettings | null>;
  specials$: Observable<Special[]>;
  activeSpecials$: Observable<Special[]>;
  currentBackgroundImage: string = 'assets/images/image1.jpg';
  
  backgroundImages: string[] = [
    'assets/images/image1.jpg',
    'assets/images/image2.jpg', 
    'assets/images/image3.jpg',
    'assets/images/image4.jpg',
    'assets/images/image5.jpg',
    'assets/images/image6.jpg',
    'assets/images/hero-bg.jpg',
    'assets/images/MainBG.jpg'
  ];
  
  currentImageIndex: number = 0;
  private slideSubscription?: Subscription;

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

    // Start background image slideshow
    this.startBackgroundSlideshow();
  }

  ngOnDestroy(): void {
    if (this.slideSubscription) {
      this.slideSubscription.unsubscribe();
    }
  }

  private startBackgroundSlideshow(): void {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Change background every 4 seconds
    this.slideSubscription = interval(4000).subscribe(() => {
      this.nextBackgroundImage();
    });
  }

  private nextBackgroundImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.backgroundImages.length;
    this.currentBackgroundImage = this.backgroundImages[this.currentImageIndex];
  }

  nextImage(): void {
    this.nextBackgroundImage();
  }

  previousImage(): void {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.backgroundImages.length - 1 
      : this.currentImageIndex - 1;
    this.currentBackgroundImage = this.backgroundImages[this.currentImageIndex];
  }

  goToSlide(index: number): void {
    this.currentImageIndex = index;
    this.currentBackgroundImage = this.backgroundImages[this.currentImageIndex];
  }

  trackBySpecialId(index: number, special: Special): string {
    return special.id || index.toString();
  }
}
