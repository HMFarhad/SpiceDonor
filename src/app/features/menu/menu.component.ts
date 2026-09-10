import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';
import { MenuDataService, SeoService, I18nService } from '@core/services';
import { Category, MenuItem } from '@core/models';

@Component({
  selector: 'app-menu',
  template: `
    <div class="menu-page">
      <section class="section">
        <div class="container">
          <div *ngIf="(loading$ | async) && !(menuData$ | async)" class="loading" role="status">
            <div class="loading-spinner"></div><p>{{ i18n.translate('loading') }}</p>
          </div>
          <div *ngIf="error$ | async" class="error-container" role="alert">
            <h2>{{ i18n.translate('error_loading_menu') }}</h2>
            <button (click)="retryLoad()" class="btn btn-primary">{{ i18n.translate('retry') }}</button>
          </div>
          <ng-container *ngIf="menuData$ | async as menuData">
            <header class="menu-intro"><h1>{{ i18n.translate('menu') }}</h1></header>
            <nav class="categories-nav" [attr.aria-label]="i18n.translate('categories')">
              <label for="category-choice">{{ i18n.translate('all_categories') }}</label>
              <select id="category-choice" [ngModel]="activeCategory" (ngModelChange)="setActiveCategory($event)">
                <option [ngValue]="null">{{ i18n.translate('all_dishes') }}</option>
                <option *ngFor="let category of visibleCategories$ | async" [ngValue]="category.id">{{ shortCategoryName(category) }}</option>
              </select>
            </nav>
            <div class="dietary-legend">
              <p class="allergy-note">{{ i18n.translate('allergy_short') }}</p>
              <details>
                <summary>{{ i18n.translate('dietary_guide') }}</summary>
                <div class="legend-items">
                  <span><b>L</b> {{ i18n.translate('lactose_free') }}</span>
                  <span><b>G</b> {{ i18n.translate('gluten_free') }}</span>
                  <span><b>M</b> {{ i18n.translate('dairy_free') }}</span>
                  <span><b>K</b> {{ i18n.translate('vegetarian') }}</span>
                  <span><b>V</b> {{ i18n.translate('vegan') }}</span>
                  <span><b>H</b> {{ i18n.translate('halal') }}</span>
                </div>
                <p>{{ i18n.translate('(G) = Available gluten-free on request. Pitas, mezze plates and bowls can be made gluten-free, except wraps.') }}</p>
                <p>{{ i18n.translate('allergy_care_note') }}</p>
              </details>
            </div>
            <div id="menu-results" tabindex="-1">
              <div *ngIf="!hasAvailableItems(menuData.items)" class="empty-menu" role="status">{{ i18n.translate('unavailable') }}</div>
              <ng-container *ngFor="let category of visibleCategories$ | async">
                <section *ngIf="(!activeCategory || activeCategory === category.id) && getItemsForCategory(menuData.items, category.id).length"
                  class="category-section" [id]="'category-' + category.id">
                  <h2 class="category-title">{{ shortCategoryName(category) }}</h2>
                  <details *ngIf="i18n.getLocalizedContent(category.description)" class="category-description">
                    <summary>{{ i18n.translate('serving_options') }}</summary>
                    <p>{{ i18n.getLocalizedContent(category.description) }}</p>
                  </details>
                  <div class="menu-grid" [class.simple-list]="isSimpleCategory(category.id)">
                    <article *ngFor="let item of getItemsForCategory(menuData.items, category.id); let i = index"
                      class="menu-item" [id]="'dish-' + item.id" [class.has-image]="item.imageUrls.length && !isSimpleCategory(category.id)">
                      <app-food-photo *ngIf="item.imageUrls.length && !isSimpleCategory(category.id)"
                        [urls]="item.imageUrls" [alt]="i18n.getLocalizedContent(item.name)"></app-food-photo>
                      <div class="menu-item-header">
                        <h3>{{ i18n.getLocalizedContent(item.name) }}</h3>
                        <p *ngIf="item.dietaryTags.length" class="dietary-codes">{{ item.dietaryTags.join(' · ') }}</p>
                        <div class="price-row">
                          <span *ngIf="item.priceLabel">{{ i18n.getLocalizedContent(item.priceLabel) }}</span>
                          <strong>{{ i18n.formatPrice(item.discountPrice || item.price, item.currency) }}</strong>
                          <del *ngIf="item.discountPrice">{{ i18n.formatPrice(item.price, item.currency) }}</del>
                        </div>
                        <div *ngIf="item.priceLarge" class="meal-price">{{ i18n.translate('meal') }} {{ i18n.formatPrice(item.priceLarge, item.currency) }}</div>
                        <div *ngIf="item.priceAlt" class="price-row alternate-price">
                          <span>{{ i18n.getLocalizedContent(item.priceAltLabel) }}</span>
                          <strong>{{ i18n.formatPrice(item.priceAlt, item.currency) }}</strong>
                        </div>
                        <div *ngIf="item.priceAltLarge" class="meal-price">{{ i18n.translate('meal') }} {{ i18n.formatPrice(item.priceAltLarge, item.currency) }}</div>
                      </div>
                      <p *ngIf="item.description" class="menu-item-description">{{ summary(item) }}</p>
                      <details *ngIf="!isSimpleCategory(category.id) && i18n.getLocalizedContent(item.description)" class="ingredients">
                        <summary>{{ i18n.translate('ingredients') }}<span class="sr-only">: {{ i18n.getLocalizedContent(item.name) }}</span></summary>
                        <p>{{ i18n.getLocalizedContent(item.description) }}</p>
                      </details>
                      <div *ngIf="!isSimpleCategory(category.id)" class="menu-item-actions">
                        <app-platform-buttons variant="compact" [orderLinks]="item.orderLinks" [itemId]="item.id"
                          [fallbackLinks]="{wolt:menuData.settings.externalOrderWoltUrl, uberEats:menuData.settings.externalOrderUberEatsUrl}"></app-platform-buttons>
                      </div>
                    </article>
                  </div>
                </section>
              </ng-container>
            </div>
            <p class="last-updated">{{ i18n.translate('last_updated') }}: {{ i18n.formatDate(menuData.lastUpdated) }}</p>
          </ng-container>
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
    @Inject(DOCUMENT) private document: Document,
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

  setActiveCategory(categoryId: string | null): void {
    this.activeCategory = categoryId;
    // Native scrollIntoView honors the CSS offset for both fixed navigation bars.
    setTimeout(() => {
      this.document.getElementById('menu-results')?.scrollIntoView({ block: 'start' });
    });
  }

  shortCategoryName(category: Category): string {
    const key = category.id + '_short';
    const translated = this.i18n.translate(key);
    return translated === key ? this.i18n.getLocalizedContent(category.name) : translated;
  }

  isSimpleCategory(id: string): boolean { return ['beverages', 'dips'].includes(id); }
  hasAvailableItems(items: MenuItem[]): boolean {
    return items.some(item => item.available && (!this.activeCategory || item.categoryId === this.activeCategory));
  }
  summary(item: MenuItem): string {
    const description = this.i18n.getLocalizedContent(item.description);
    if (this.isSimpleCategory(item.categoryId) || description.length <= 95) return description;
    const excerpt = description.slice(0, 95);
    return excerpt.slice(0, excerpt.lastIndexOf(' ')) + '…';
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
