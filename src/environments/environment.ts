import { DataSourceConfig, Environment, DataSourceType } from '@core/models';

export const environment: Environment = {
  production: false,
  dataSource: {
    type: DataSourceType.FILE_URL, // Change to DataSourceType.GOOGLE_SHEET if using Google Sheets API
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
    // Example Google Sheets configuration:
    // googleSheet: {
    //   spreadsheetId: 'your-spreadsheet-id',
    //   apiKey: 'your-api-key', // Optional, use published URLs instead
    //   ranges: {
    //     categories: 'categories!A:Z',
    //     items: 'items!A:Z',
    //     optionGroups: 'option_groups!A:Z',
    //     options: 'options!A:Z',
    //     specials: 'specials!A:Z',
    //     hours: 'hours!A:Z',
    //     settings: 'site_settings!A:Z'
    //   }
    // }
  },
  externalOrder: {
    wolt: 'https://wolt.com/fi/restaurant/bengal-ruokopaikka',
    foodora: 'https://www.foodora.fi/restaurant/bengal-ruokopaikka'
  },
  defaultLocale: 'en',
  supportedLocales: ['en', 'fi'],
  brandColors: {
    primary: '#2E6F40',
    secondary: '#D4A373'
  },
  ga4MeasurementId: undefined // Set your GA4 measurement ID here
};
