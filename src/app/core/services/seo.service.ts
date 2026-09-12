import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SiteSettings } from '../models';
import { I18nService } from './i18n.service';
import { environment } from '@environments/environment';
import { BUSINESS_DETAILS } from '@core/business-details';

export interface SeoData {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  
  constructor(
    private meta: Meta,
    private title: Title,
    private router: Router,
    private i18nService: I18nService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  public updateSeoData(data: SeoData): void {
    // Update title
    this.title.setTitle(data.title);
    
    // Update meta tags
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({ name: 'keywords', content: data.keywords || '' });
    
    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: data.title });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: data.type || 'website' });
    this.meta.updateTag({ property: 'og:url', content: data.url || this.getCurrentUrl() });
    
    if (data.image) {
      this.meta.updateTag({ property: 'og:image', content: data.image });
      this.meta.updateTag({ property: 'og:image:alt', content: data.title });
    }
    
    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: data.title });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });
    
    if (data.image) {
      this.meta.updateTag({ name: 'twitter:image', content: data.image });
    }
    
    // Canonical URL
    this.updateCanonicalUrl(data.url || this.getCurrentUrl());
    
    // Language meta tags
    this.updateLanguageTags();
  }

  public generateRestaurantJsonLd(settings: SiteSettings): void {
    const currentLang = this.i18nService.getCurrentLanguage();
    
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      'name': this.i18nService.getLocalizedContent(settings.heroTitle),
      'legalName': BUSINESS_DETAILS.legalName,
      'identifier': BUSINESS_DETAILS.businessId,
      'description': this.i18nService.getLocalizedContent(settings.heroSubtitle),
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': `${settings.addressLine1}${settings.addressLine2 ? ', ' + settings.addressLine2 : ''}`,
        'addressLocality': settings.city,
        'postalCode': settings.postalCode,
        'addressCountry': 'FI'
      },
      'telephone': settings.phone,
      'email': settings.email,
      'url': environment.siteUrl,
      'servesCuisine': 'Middle Eastern',
      'priceRange': '€€',
      'acceptsReservations': false,
      'hasMenu': this.getAbsoluteUrl('/menu')
    };

    this.insertJsonLd('restaurant', jsonLd);
  }

  public generateMenuJsonLd(categories: any[], items: any[]): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Menu',
      'hasMenuSection': categories.filter(cat => cat.visible).map(category => ({
        '@type': 'MenuSection',
        'name': this.i18nService.getLocalizedContent(category.name),
        'description': this.i18nService.getLocalizedContent(category.description),
        'hasMenuItem': items
          .filter(item => item.categoryId === category.id && item.available)
          .map(item => ({
            '@type': 'MenuItem',
            'name': this.i18nService.getLocalizedContent(item.name),
            'description': this.i18nService.getLocalizedContent(item.description),
            'offers': {
              '@type': 'Offer',
              'price': item.discountPrice || item.price,
              'priceCurrency': item.currency,
              'availability': 'https://schema.org/InStock'
            }
          }))
      }))
    };

    this.insertJsonLd('menu', jsonLd);
  }

  public generateOpeningHoursJsonLd(hours: any[]): void {
    const openingHours = hours
      .filter(h => !h.closed)
      .map(h => `${this.getDayOfWeek(h.day)} ${h.open}-${h.close}`);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'openingHours': openingHours
    };

    this.insertJsonLd('opening-hours', jsonLd);
  }

  public generateBreadcrumbJsonLd(breadcrumbs: { name: string; url: string }[]): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': breadcrumb.name,
        'item': this.getAbsoluteUrl(breadcrumb.url)
      }))
    };

    this.insertJsonLd('breadcrumb', jsonLd);
  }

  public generateFaqJsonLd(faqs: { question: string; answer: string }[]): void {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    };

    this.insertJsonLd('faq', jsonLd);
  }

  private insertJsonLd(id: string, jsonLd: any): void {
    const existingScript = this.document.getElementById(`json-ld-${id}`);
    if (existingScript) {
      existingScript.remove();
    }

    const script = this.document.createElement('script');
    script.id = `json-ld-${id}`;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonLd, null, 2);
    this.document.head.appendChild(script);
  }

  private updateCanonicalUrl(url: string): void {
    let canonicalElement = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!canonicalElement) {
      canonicalElement = this.document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonicalElement);
    }
    
    canonicalElement.setAttribute('href', this.getAbsoluteUrl(url));
  }

  private updateLanguageTags(): void {
    const currentLang = this.i18nService.getCurrentLanguage();
    const currentUrl = this.getCurrentUrl();
    
    // Update html lang attribute
    this.document.documentElement.setAttribute('lang', currentLang);
    
    // Update hreflang tags
    this.removeExistingHreflangTags();
    
    const languages = ['en', 'fi'];
    languages.forEach(lang => {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', lang);
      link.setAttribute('href', this.getAbsoluteUrl(currentUrl));
      this.document.head.appendChild(link);
    });
  }

  private removeExistingHreflangTags(): void {
    const hreflangTags = this.document.querySelectorAll('link[hreflang]');
    hreflangTags.forEach(tag => tag.remove());
  }

  private getCurrentUrl(): string {
    return this.router.url;
  }

  private getAbsoluteUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    
    const baseUrl = environment.production
      ? environment.siteUrl
      : `${this.document.location.protocol}//${this.document.location.host}`;
    return `${baseUrl}${path.startsWith('/') ? path : '/' + path}`;
  }

  private getDayOfWeek(day: string): string {
    const dayMap: Record<string, string> = {
      'Mon': 'Monday',
      'Tue': 'Tuesday', 
      'Wed': 'Wednesday',
      'Thu': 'Thursday',
      'Fri': 'Friday',
      'Sat': 'Saturday',
      'Sun': 'Sunday'
    };
    return dayMap[day] || day;
  }

  public setRobotsMeta(content: string): void {
    this.meta.updateTag({ name: 'robots', content });
  }

  public generateSitemap(routes: string[]): string {
    const baseUrl = this.getAbsoluteUrl('');
    const urls = routes.map(route => {
      return `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
  }

  public getRobotsTxt(): string {
    const baseUrl = this.getAbsoluteUrl('');
    return `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /*.json

Sitemap: ${baseUrl}/sitemap.xml`;
  }
}
