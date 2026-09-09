import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewportScroller } from '@angular/common';
import { MenuDataService, SeoService, I18nService } from '@core/services';
import { Category, MenuItem } from '@core/models';

@Component({
  selector: 'app-menu',
  template: `
    <div class="menu-page">
      <!-- Menu Content -->
      <section class="section">
        <div class="container">
          <!-- Loading State -->
          <div *ngIf="(loading$ | async) && !(menuData$ | async)" class="loading" role="status" aria-live="polite">
            <div class="loading-spinner"></div>
            <p>{{ i18n.translate('loading') }}...</p>
          </div>

          <!-- Error State -->
          <div *ngIf="error$ | async as error" class="error-container" role="alert">
            <div class="error-icon">⚠️</div>
            <h3 class="error-title">{{ i18n.translate('error_loading_menu') }}</h3>
            <p class="error-message">{{ error }}</p>
            <button (click)="retryLoad()" class="btn btn-primary">{{ i18n.translate('retry') }}</button>
          </div>

          <!-- Menu Content -->
          <div *ngIf="menuData$ | async as menuData">
            <header class="menu-intro">
              <p class="menu-eyebrow">Spice Döner · Malmi</p>
              <h1>{{ i18n.translate('menu') }}</h1>
              <p>{{ i18n.translate('Fresh ingredients, authentic flavors, healthy options') }}</p>
            </header>
            
            <!-- Dietary Legend -->
            <div class="dietary-legend card mb-4">
              <div class="card-body">
                <h4 class="legend-title">{{ i18n.translate('dietary_guide') }}</h4>
                <div class="legend-items">
                  <span class="legend-item"><strong>L</strong> = {{ i18n.translate('lactose_free') }}</span>
                  <span class="legend-item"><strong>G</strong> = {{ i18n.translate('gluten_free') }}</span>
                  <span class="legend-item"><strong>M</strong> = {{ i18n.translate('dairy_free') }}</span>
                  <span class="legend-item"><strong>K</strong> = {{ i18n.translate('vegetarian') }}</span>
                  <span class="legend-item"><strong>V</strong> = {{ i18n.translate('vegan') }}</span>
                </div>
                <p class="legend-note">{{ i18n.translate('(G) = Available gluten-free on request. Pitas, mezze plates and bowls can be made gluten-free, except wraps.') }}</p>
              </div>
            </div>
            
            <!-- Categories Navigation -->
            <div class="categories-nav">
              <button 
                *ngFor="let category of visibleCategories$ | async" 
                (click)="setActiveCategory(category.id)"
                [class.active]="activeCategory === category.id"
                [attr.aria-pressed]="activeCategory === category.id"
                class="category-btn">
                {{ i18n.getLocalizedContent(category.name) }}
              </button>
            </div>

            <div *ngIf="menuData.items.length === 0" class="empty-menu card" role="status">
              <div class="card-body">
                <h2>{{ i18n.translate('menu') }}</h2>
                <p>{{ i18n.translate('unavailable') }}</p>
              </div>
            </div>

            <!-- Menu Items -->
            <div class="menu-items" *ngFor="let category of visibleCategories$ | async">
              <div 
                *ngIf="!activeCategory || activeCategory === category.id"
                class="category-section"
                [id]="'category-' + category.id">
                <h2 class="category-title">{{ i18n.getLocalizedContent(category.name) }}</h2>
                <p 
                  *ngIf="category.description"
                  class="category-description">
                  {{ i18n.getLocalizedContent(category.description) }}
                </p>
                
                <div class="grid grid-2">
                  <div 
                    *ngFor="let item of getItemsForCategory(menuData.items, category.id); let i = index"
                    class="menu-item card"
                    [class.has-image]="item.imageUrls.length">
                    <div
                      class="menu-item-image"
                      *ngIf="item.imageUrls.length as imageCount"
                      [class.has-multiple]="imageCount > 1"
                      [class.image-count-2]="imageCount === 2"
                      [class.image-count-3]="imageCount === 3"
                      [class.image-count-4]="imageCount === 4">
                      <img 
                        *ngFor="let imageUrl of item.imageUrls; let imageIndex = index"
                        [src]="imageUrl"
                        [alt]="imageIndex === 0 ? i18n.getLocalizedContent(item.name) : ''"
                        [attr.aria-hidden]="imageIndex > 0 ? 'true' : null"
                        loading="lazy">
                      <div *ngIf="imageCount > 1" class="image-rotation-dots" aria-hidden="true">
                        <span *ngFor="let imageUrl of item.imageUrls"></span>
                      </div>
                    </div>
                    <div class="card-body">
                      <div class="menu-item-header">
                        <div class="menu-item-title-row">
                          <span class="menu-item-number">{{ getCategoryItemNumber(category.id, i) }}</span>
                          <h3 class="menu-item-name">
                            {{ i18n.getLocalizedContent(item.name) }}
                            <span *ngIf="item.dietaryTags && item.dietaryTags.length > 0" class="dietary-codes-inline">
                              ({{ item.dietaryTags.join(', ') }})
                            </span>
                          </h3>
                        </div>
                        <div class="menu-item-price">
                          <span class="price-current">
                            <span *ngIf="item.priceLabel">{{ i18n.getLocalizedContent(item.priceLabel) }}: </span>
                            {{ i18n.formatPrice(item.discountPrice || item.price, item.currency) }}
                            <span *ngIf="item.priceLarge" class="price-large">/ {{ i18n.translate('meal') }} {{ i18n.formatPrice(item.priceLarge, item.currency) }}</span>
                          </span>
                          <span *ngIf="item.priceAlt" class="price-current price-alternate">
                            <span *ngIf="item.priceAltLabel">{{ i18n.getLocalizedContent(item.priceAltLabel) }}: </span>
                            {{ i18n.formatPrice(item.priceAlt, item.currency) }}
                            <span *ngIf="item.priceAltLarge" class="price-large">/ {{ i18n.translate('meal') }} {{ i18n.formatPrice(item.priceAltLarge, item.currency) }}</span>
                          </span>
                          <span 
                            *ngIf="item.discountPrice" 
                            class="price-original">
                            {{ i18n.formatPrice(item.price, item.currency) }}
                          </span>
                        </div>
                      </div>
                      <p class="menu-item-description">{{ i18n.getLocalizedContent(item.description) }}</p>
                      
                      <!-- Order Buttons -->
                      <div class="menu-item-actions">
                        <app-platform-buttons 
                          [variant]="'compact'"
                          [orderLinks]="item.orderLinks"
                          [itemId]="item.id">
                        </app-platform-buttons>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Last Updated Info -->
            <div class="last-updated text-center text-muted">
              <small>
                {{ i18n.translate('last_updated') }}: 
                {{ i18n.formatDate(menuData.lastUpdated) }}
              </small>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  menuData$ = this.menuDataService.menuData$;
  loading$ = this.menuDataService.loading$;
  error$ = this.menuDataService.error$;
  
  visibleCategories$: Observable<Category[]>;
  activeCategory: string | null = null;

  constructor(
    private menuDataService: MenuDataService,
    private seoService: SeoService,
    private viewportScroller: ViewportScroller,
    public i18n: I18nService
  ) {
    this.visibleCategories$ = this.menuData$.pipe(
      map(data => data?.categories.filter(cat => cat.visible).sort((a, b) => a.sortOrder - b.sortOrder) || [])
    );
  }

  ngOnInit(): void {
    // Update SEO for menu page
    this.seoService.updateSeoData({
      title: 'Menu - Spice Döner',
      description: 'Explore our fresh Middle Eastern menu featuring hummus bowls, warm pitas, and healthy salads.',
      keywords: 'menu, hummus bowls, pita, salads, middle eastern food, vegan, vegetarian',
      type: 'website'
    });

    // Generate structured data for menu
    this.menuData$.subscribe(data => {
      if (data) {
        this.seoService.generateMenuJsonLd(data.categories, data.items);
      }
    });
  }

  setActiveCategory(categoryId: string): void {
    this.activeCategory = this.activeCategory === categoryId ? null : categoryId;
    
    // Scroll to the category section after a short delay to allow DOM updates
    if (this.activeCategory) {
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor('category-' + categoryId);
      }, 100);
    }
  }

  getItemsForCategory(items: MenuItem[], categoryId: string): MenuItem[] {
    return items.filter(item => item.categoryId === categoryId && item.available);
  }

  getCategoryItemNumber(categoryId: string, itemIndex: number): number {
    return itemIndex + 1;
  }

  retryLoad(): void {
    this.menuDataService.loadMenuData(true);
  }
}
