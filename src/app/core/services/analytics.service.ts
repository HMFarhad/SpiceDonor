import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@environments/environment';

declare let gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private consentGiven = false;
  private readonly CONSENT_KEY = 'analytics_consent';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadConsentStatus();
    this.initializeGoogleAnalytics();
  }

  private initializeGoogleAnalytics(): void {
    const measurementId = this.getMeasurementId();
    if (!isPlatformBrowser(this.platformId) || !measurementId) {
      return;
    }

    // Load gtag script
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gtagScript);

    // Initialize gtag
    const gtagConfigScript = document.createElement('script');
    gtagConfigScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('consent', 'default', {
        'analytics_storage': '${this.consentGiven ? 'granted' : 'denied'}',
        'ad_storage': 'denied'
      });
      gtag('config', '${measurementId}', {
        'send_page_view': ${this.consentGiven}
      });
    `;
    document.head.appendChild(gtagConfigScript);
  }

  public giveConsent(): void {
    this.consentGiven = true;
    this.saveConsentStatus();
    
    if (isPlatformBrowser(this.platformId) && typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  public withdrawConsent(): void {
    this.consentGiven = false;
    this.saveConsentStatus();
    
    if (isPlatformBrowser(this.platformId) && typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  }

  public hasConsent(): boolean {
    return this.consentGiven;
  }

  public isEnabled(): boolean {
    return Boolean(this.getMeasurementId());
  }

  public trackEvent(action: string, category: string, label?: string, value?: number): void {
    if (!this.consentGiven || !isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  }

  public trackPageView(title: string, path: string): void {
    if (!this.consentGiven || !isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: title,
        page_location: window.location.origin + path
      });
    }
  }

  public trackMenuItemView(itemId: string, itemName: string, categoryId: string): void {
    this.trackEvent('view_item', 'menu', `${categoryId}:${itemId}:${itemName}`);
  }

  public trackExternalOrder(platform: string, itemId?: string): void {
    this.trackEvent('external_order', 'conversion', `${platform}${itemId ? ':' + itemId : ''}`);
  }

  public trackMenuSearch(query: string): void {
    this.trackEvent('search', 'menu', query);
  }

  public trackLanguageChange(newLanguage: string): void {
    this.trackEvent('language_change', 'ui', newLanguage);
  }

  public trackContactForm(): void {
    this.trackEvent('submit', 'contact_form', 'contact_page');
  }

  public trackError(error: string, page: string): void {
    this.trackEvent('exception', 'error', `${page}:${error}`);
  }

  private loadConsentStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      const consent = localStorage.getItem(this.CONSENT_KEY);
      this.consentGiven = consent === 'true';
    }
  }

  private saveConsentStatus(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.CONSENT_KEY, this.consentGiven.toString());
    }
  }

  private getMeasurementId(): string | undefined {
    return environment.ga4MeasurementId;
  }
}
