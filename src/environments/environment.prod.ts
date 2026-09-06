import { DataSourceConfig, Environment } from '@core/models';

export const environment: Environment = {
  production: true,
  dataSource: {
    type: 'fileUrl', // Configure for production
    fileUrl: {
      workbookUrl: 'assets/data/menu.xlsx',
      categories: 'assets/data/categories.csv',
      items: 'assets/data/items.csv',
      optionGroups: 'assets/data/option-groups.csv',
      options: 'assets/data/options.csv',
      specials: 'assets/data/specials.csv',
      hours: 'assets/data/hours.csv',
      settings: 'assets/data/site-settings.csv'
    }
  },
  externalOrder: {
    wolt: 'https://wolt.com/fi/your-restaurant',
    bolt: 'https://food.bolt.eu/your-restaurant',
    foodora: 'https://www.foodora.fi/your-restaurant'
  },
  defaultLocale: 'en',
  supportedLocales: ['en', 'fi'],
  brandColors: {
    primary: '#2E6F40',
    secondary: '#D4A373'
  },
  ga4MeasurementId: 'G-XXXXXXXXXX' // Set your actual GA4 measurement ID
};
