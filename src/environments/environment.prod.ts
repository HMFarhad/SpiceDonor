import { Environment, DataSourceType } from '@core/models';

export const environment: Environment = {
  production: true,
  siteUrl: 'https://spicedonor.fi',
  dataSource: {
    type: DataSourceType.FILE_URL,
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
    wolt: 'https://wolt.com/fi/restaurant/spice-donor'
  },
  defaultLocale: 'en',
  supportedLocales: ['en', 'fi'],
  brandColors: {
    primary: '#2E6F40',
    secondary: '#D4A373'
  },
  ga4MeasurementId: undefined
};
