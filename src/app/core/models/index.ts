export enum DietaryTag {
  VEGAN = 'vegan',
  VEGETARIAN = 'vegetarian',
  HALAL = 'halal',
  GLUTEN_FREE = 'gluten-free',
  DAIRY_FREE = 'dairy-free',
  KETO = 'keto',
  SPICY1 = 'spicy1',
  SPICY2 = 'spicy2',
  SPICY3 = 'spicy3',
  // Short codes used in CSV
  L = 'L',
  G = 'G',
  K = 'K',
  V = 'V',
  H = 'H',
  VL = 'VL',
  M = 'M',
  GLUTEN_FREE_ON_REQUEST = '(G)'
}

export enum AllergenTag {
  GLUTEN = 'gluten',
  NUTS = 'nuts',
  SESAME = 'sesame',
  SOY = 'soy',
  DAIRY = 'dairy',
  EGG = 'egg',
  FISH = 'fish',
  SHELLFISH = 'shellfish',
  CELERY = 'celery',
  MUSTARD = 'mustard',
  SULPHITES = 'sulphites',
  LUPIN = 'lupin',
  MOLLUSCS = 'molluscs'
}

export enum SelectionType {
  SINGLE = 'single',
  MULTIPLE = 'multiple'
}

export enum DataSourceType {
  GOOGLE_SHEET = 'googleSheet',
  FILE_URL = 'fileUrl'
}

export interface LocalizedContent {
  en: string;
  fi: string;
}

export interface Category {
  id: string;
  name: LocalizedContent;
  description?: LocalizedContent;
  sortOrder: number;
  visible: boolean;
}

export interface OrderLinks {
  wolt?: string;
  uberEats?: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: LocalizedContent;
  description: LocalizedContent;
  price: number;
  priceLarge?: number;
  priceAlt?: number;
  priceAltLarge?: number;
  priceLabel?: LocalizedContent;
  priceAltLabel?: LocalizedContent;
  discountPrice?: number;
  currency: string;
  dietaryTags: DietaryTag[];
  allergens: AllergenTag[];
  available: boolean;
  imageUrl?: string;
  imageUrls: string[];
  orderLinks?: OrderLinks;
  optionsGroupIds: string[];
}

export interface OptionGroup {
  id: string;
  name: LocalizedContent;
  selectionType: SelectionType;
  minSelect: number;
  maxSelect: number;
}

export interface Option {
  id: string;
  groupId: string;
  name: LocalizedContent;
  priceDelta: number;
}

export interface Special {
  id: string;
  title: LocalizedContent;
  description: LocalizedContent;
  price: number;
  discountPrice?: number;
  active: boolean;
  startDate?: Date;
  endDate?: Date;
}

export interface Hours {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

export interface SiteSettings {
  heroTitle: LocalizedContent;
  heroSubtitle: LocalizedContent;
  ctaPrimaryText: LocalizedContent;
  ctaPrimaryLink: string;
  externalOrderWoltUrl: string;
  externalOrderUberEatsUrl: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  mapEmbedUrl: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  currency: string;
  brandPrimaryColor?: string;
  brandSecondaryColor?: string;
}

export interface MenuData {
  categories: Category[];
  items: MenuItem[];
  optionGroups: OptionGroup[];
  options: Option[];
  specials: Special[];
  hours: Hours[];
  settings: SiteSettings;
  lastUpdated: Date;
}

export interface DataSourceConfig {
  type: DataSourceType;
  googleSheet?: {
    spreadsheetId: string;
    apiKey?: string;
    ranges: {
      categories: string;
      items: string;
      optionGroups: string;
      options: string;
      specials: string;
      hours: string;
      settings: string;
    };
  };
  fileUrl?: {
    workbookUrl?: string;
    categories: string;
    items: string;
    optionGroups: string;
    options: string;
    specials: string;
    hours: string;
    settings: string;
  };
}

export interface Environment {
  production: boolean;
  siteUrl: string;
  dataSource: DataSourceConfig;
  externalOrder: OrderLinks;
  defaultLocale: string;
  supportedLocales: string[];
  brandColors: {
    primary: string;
    secondary: string;
  };
  ga4MeasurementId?: string;
}

// Utility types for forms and UI
export interface MenuFilters {
  search: string;
  categoryId: string | null;
  dietaryTags: DietaryTag[];
  excludeAllergens: AllergenTag[];
  showUnavailable: boolean;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject: string;
}

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}
