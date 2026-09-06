import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, BehaviorSubject, throwError, timer } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { 
  MenuData, 
  DataSourceConfig, 
  Category, 
  MenuItem, 
  OptionGroup, 
  Option, 
  Special, 
  Hours, 
  SiteSettings,
  DataSourceType,
  CacheEntry,
  DietaryTag,
  AllergenTag,
  SelectionType
} from '../models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuDataService {
  private menuDataSubject = new BehaviorSubject<MenuData | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);
  
  public menuData$ = this.menuDataSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();
  
  private readonly CACHE_KEY = 'restaurant_menu_data';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadMenuData();
    if (isPlatformBrowser(this.platformId)) {
      timer(this.CACHE_DURATION, this.CACHE_DURATION).subscribe(() => {
        this.loadMenuData(true).catch(error => console.error('Background menu refresh failed:', error));
      });
    }
  }

  public async loadMenuData(forceRefresh: boolean = false): Promise<MenuData> {
    if (this.loadingSubject.value) {
      return this.menuData$.pipe(map(data => data!)).toPromise() as Promise<MenuData>;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    try {
      // Check cache first
      if (!forceRefresh && isPlatformBrowser(this.platformId)) {
        const cachedData = this.getCachedData();
        if (cachedData) {
          this.menuDataSubject.next(cachedData);
          this.loadingSubject.next(false);
          // Load fresh data in background
          this.loadFreshData().catch(error => console.error('Background menu refresh failed:', error));
          return cachedData;
        }
      }

      const menuData = await this.loadFreshData();
      return menuData;
    } catch (error) {
      this.errorSubject.next('Failed to load menu data');
      this.loadingSubject.next(false);
      throw error;
    }
  }

  private async loadFreshData(): Promise<MenuData> {
    const config = environment.dataSource;
    let menuData: MenuData;

    if (config.type === DataSourceType.GOOGLE_SHEET) {
      menuData = await this.loadFromGoogleSheet(config);
    } else {
      menuData = await this.loadFromFileUrls(config);
    }

    menuData.lastUpdated = new Date();
    this.menuDataSubject.next(menuData);
    this.cacheData(menuData);
    this.loadingSubject.next(false);
    
    return menuData;
  }

  private async loadFromGoogleSheet(config: DataSourceConfig): Promise<MenuData> {
    const { spreadsheetId, ranges, apiKey } = config.googleSheet!;
    
    const promises = Object.entries(ranges).map(([key, range]) => 
      this.fetchGoogleSheetData(spreadsheetId, range, apiKey).then(data => ({ key, data }))
    );

    const results = await Promise.all(promises);
    const dataMap = results.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {} as any);

    return this.parseMenuData(dataMap);
  }

  private async loadFromFileUrls(config: DataSourceConfig): Promise<MenuData> {
    const { fileUrl } = config;

    if (fileUrl?.workbookUrl) {
      const dataMap = await this.fetchWorkbookData(fileUrl.workbookUrl);
      return this.parseMenuData(dataMap);
    }
    
    const promises = Object.entries(fileUrl!).map(([key, url]) => 
      this.fetchFileData(url).then(data => ({ key, data }))
    );

    const results = await Promise.all(promises);
    const dataMap = results.reduce((acc, { key, data }) => {
      acc[key] = data;
      return acc;
    }, {} as any);

    return this.parseMenuData(dataMap);
  }

  private fetchWorkbookData(url: string): Promise<Record<string, any[]>> {
    const separator = url.includes('?') ? '&' : '?';
    const cacheBustedUrl = `${url}${separator}menu_refresh=${Date.now()}`;
    return this.http.get(cacheBustedUrl, {
      responseType: 'arraybuffer',
      headers: new HttpHeaders({ 'Cache-Control': 'no-cache' })
    }).pipe(
      map(buffer => this.parseWorkbook(buffer)),
      catchError(error => throwError(() => new Error(`Failed to fetch menu workbook: ${error.message}`)))
    ).toPromise().then(result => result || {});
  }

  private fetchGoogleSheetData(spreadsheetId: string, range: string, apiKey?: string): Promise<any[]> {
    let url: string;
    
    if (apiKey) {
      url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
      return this.http.get<any>(url).pipe(
        map(response => this.convertGoogleSheetsResponse(response)),
        catchError(error => throwError(() => new Error(`Failed to fetch Google Sheet data: ${error.message}`)))
      ).toPromise().then(result => result || []);
    } else {
      // Use published CSV URL
      url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${range}`;
      return this.http.get(url, { responseType: 'text' }).pipe(
        map(csvText => this.parseCSV(csvText)),
        catchError(error => throwError(() => new Error(`Failed to fetch Google Sheet CSV: ${error.message}`)))
      ).toPromise().then(result => result || []);
    }
  }

  private fetchFileData(url: string): Promise<any[]> {
    if (url.endsWith('.csv')) {
      return this.http.get(url, { responseType: 'text' }).pipe(
        map(csvText => this.parseCSV(csvText))
      ).toPromise().then(result => result || []);
    } else if (url.endsWith('.xlsx')) {
      return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
        map(buffer => this.parseXLSX(buffer))
      ).toPromise().then(result => result || []);
    } else {
      throw new Error(`Unsupported file format: ${url}`);
    }
  }

  private parseCSV(csvText: string): any[] {
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim()
    });
    return result.data;
  }

  private parseXLSX(buffer: ArrayBuffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  }

  private parseWorkbook(buffer: ArrayBuffer): Record<string, any[]> {
    const workbook = XLSX.read(buffer, { type: 'array', cellDates: true });
    const sheetAliases: Record<string, string[]> = {
      categories: ['categories'],
      items: ['items'],
      optionGroups: ['option_groups', 'optiongroups'],
      options: ['options'],
      specials: ['specials'],
      hours: ['hours'],
      settings: ['site_settings', 'settings']
    };

    const normalizedNames = new Map(
      workbook.SheetNames.map(name => [name.toLowerCase().replace(/[\s-]+/g, '_'), name])
    );

    return Object.entries(sheetAliases).reduce((dataMap, [key, aliases]) => {
      const sheetName = aliases.map(alias => normalizedNames.get(alias)).find(Boolean);
      dataMap[key] = sheetName
        ? XLSX.utils.sheet_to_json(workbook.Sheets[sheetName!], { defval: '' })
        : [];
      return dataMap;
    }, {} as Record<string, any[]>);
  }

  private convertGoogleSheetsResponse(response: any): any[] {
    if (!response.values || response.values.length === 0) {
      return [];
    }
    
    const [headers, ...rows] = response.values;
    return rows.map((row: any[]) => {
      const obj: any = {};
      headers.forEach((header: string, index: number) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });
  }

  private parseMenuData(dataMap: any): MenuData {
    return {
      categories: this.parseCategories(dataMap.categories || []),
      items: this.parseItems(dataMap.items || []),
      optionGroups: this.parseOptionGroups(dataMap.optionGroups || []),
      options: this.parseOptions(dataMap.options || []),
      specials: this.parseSpecials(dataMap.specials || []),
      hours: this.parseHours(dataMap.hours || []),
      settings: this.parseSettings(dataMap.settings || []),
      lastUpdated: new Date()
    };
  }

  private parseCategories(data: any[]): Category[] {
    return data.map(row => ({
      id: row.id,
      name: {
        en: row.name_en || row.name,
        fi: row.name_fi || row.name
      },
      description: row.description_en || row.description_fi ? {
        en: row.description_en || '',
        fi: row.description_fi || ''
      } : undefined,
      sortOrder: parseInt(row.sort_order) || 0,
      visible: row.visible === 'TRUE' || row.visible === true
    }));
  }

  private parseItems(data: any[]): MenuItem[] {
    return data.map(row => ({
      id: row.id,
      categoryId: row.category_id,
      name: {
        en: row.name_en || row.name,
        fi: row.name_fi || row.name
      },
      description: {
        en: row.description_en || '',
        fi: row.description_fi || ''
      },
      price: parseFloat(row.price) || 0,
      priceLarge: row.price_large ? parseFloat(row.price_large) : undefined,
      priceAlt: row.price_alt ? parseFloat(row.price_alt) : undefined,
      priceAltLarge: row.price_alt_large ? parseFloat(row.price_alt_large) : undefined,
      priceLabel: row.price_label_en || row.price_label_fi ? {
        en: row.price_label_en || '',
        fi: row.price_label_fi || ''
      } : undefined,
      priceAltLabel: row.price_alt_label_en || row.price_alt_label_fi ? {
        en: row.price_alt_label_en || '',
        fi: row.price_alt_label_fi || ''
      } : undefined,
      discountPrice: row.discount_price ? parseFloat(row.discount_price) : undefined,
      currency: row.currency || 'EUR',
      dietaryTags: this.parseDietaryTags(row.dietary_tags),
      allergens: this.parseAllergens(row.allergens),
      available: row.available === 'TRUE' || row.available === true,
      imageUrl: row.image_url || undefined,
      orderLinks: this.parseOrderLinks(row.order_links),
      optionsGroupIds: this.parseTags(row.options_group_ids)
    }));
  }

  private parseOptionGroups(data: any[]): OptionGroup[] {
    return data.map(row => ({
      id: row.id,
      name: {
        en: row.name_en || row.name,
        fi: row.name_fi || row.name
      },
      selectionType: row.selection_type === 'multiple' ? SelectionType.MULTIPLE : SelectionType.SINGLE,
      minSelect: parseInt(row.min_select) || 0,
      maxSelect: parseInt(row.max_select) || 1
    }));
  }

  private parseOptions(data: any[]): Option[] {
    return data.map(row => ({
      id: row.id,
      groupId: row.group_id,
      name: {
        en: row.name_en || row.name,
        fi: row.name_fi || row.name
      },
      priceDelta: parseFloat(row.price_delta) || 0
    }));
  }

  private parseSpecials(data: any[]): Special[] {
    return data.map(row => ({
      id: row.id,
      title: {
        en: row.title_en || row.title,
        fi: row.title_fi || row.title
      },
      description: {
        en: row.description_en || '',
        fi: row.description_fi || ''
      },
      price: parseFloat(row.price) || 0,
      discountPrice: row.discount_price ? parseFloat(row.discount_price) : undefined,
      active: row.active === 'TRUE' || row.active === true,
      startDate: row.start_date ? new Date(row.start_date) : undefined,
      endDate: row.end_date ? new Date(row.end_date) : undefined
    }));
  }

  private parseHours(data: any[]): Hours[] {
    return data.map(row => ({
      day: row.day,
      open: row.open,
      close: row.close,
      closed: row.closed === 'TRUE' || row.closed === true
    }));
  }

  private parseSettings(data: any[]): SiteSettings {
    const row = data[0] || {};
    return {
      heroTitle: {
        en: row.hero_title_en || 'Welcome to Our Restaurant',
        fi: row.hero_title_fi || 'Tervetuloa ravintolaamme'
      },
      heroSubtitle: {
        en: row.hero_subtitle_en || 'Fresh, delicious food',
        fi: row.hero_subtitle_fi || 'Tuoretta, herkullista ruokaa'
      },
      ctaPrimaryText: {
        en: row.cta_primary_text_en || 'View Menu',
        fi: row.cta_primary_text_fi || 'Katso menu'
      },
      ctaPrimaryLink: row.cta_primary_link || '/menu',
      externalOrderWoltUrl: row.external_order_wolt_url || environment.externalOrder.wolt || '',
      externalOrderUberEatsUrl: row.external_order_uber_eats_url || environment.externalOrder.uberEats || '',
      phone: row.phone || '',
      email: row.email || '',
      addressLine1: row.address_line1 || '',
      addressLine2: row.address_line2,
      city: row.city || '',
      postalCode: row.postal_code || '',
      mapEmbedUrl: row.map_embed_url || '',
      instagramUrl: row.instagram_url,
      facebookUrl: row.facebook_url,
      tiktokUrl: row.tiktok_url,
      currency: row.currency || 'EUR',
      brandPrimaryColor: row.brand_primary_color,
      brandSecondaryColor: row.brand_secondary_color
    };
  }

  private parseTags(tagString: string): string[] {
    if (!tagString) return [];
    return tagString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }

  private parseDietaryTags(tagString: string): DietaryTag[] {
    if (!tagString) return [];
    return tagString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter(tag => Object.values(DietaryTag).includes(tag as DietaryTag))
      .map(tag => tag as DietaryTag);
  }

  private parseAllergens(tagString: string): AllergenTag[] {
    if (!tagString) return [];
    return tagString.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .filter(tag => Object.values(AllergenTag).includes(tag as AllergenTag))
      .map(tag => tag as AllergenTag);
  }

  private parseOrderLinks(linkString: string): any {
    if (!linkString) return undefined;
    
    try {
      // Try parsing as JSON first
      return JSON.parse(linkString);
    } catch {
      // Fall back to pipe-separated format
      const links: any = {};
      const pairs = linkString.split('|');
      pairs.forEach(pair => {
        const [key, value] = pair.split(':');
        if (key && value) {
          links[key.trim()] = value.trim();
        }
      });
      return Object.keys(links).length > 0 ? links : undefined;
    }
  }

  private getCachedData(): MenuData | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      if (!cached) return null;

      const cacheEntry: CacheEntry<MenuData> = JSON.parse(cached);
      const now = Date.now();

      if (now - cacheEntry.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CACHE_KEY);
        return null;
      }

      // Restore Date objects
      cacheEntry.data.lastUpdated = new Date(cacheEntry.data.lastUpdated);
      cacheEntry.data.specials.forEach(special => {
        if (special.startDate) special.startDate = new Date(special.startDate);
        if (special.endDate) special.endDate = new Date(special.endDate);
      });

      return cacheEntry.data;
    } catch (error) {
      console.error('Error loading cached data:', error);
      localStorage.removeItem(this.CACHE_KEY);
      return null;
    }
  }

  private cacheData(data: MenuData): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const cacheEntry: CacheEntry<MenuData> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  public clearCache(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.CACHE_KEY);
    }
  }

  public getLastUpdated(): Date | null {
    const menuData = this.menuDataSubject.value;
    return menuData ? menuData.lastUpdated : null;
  }
}
