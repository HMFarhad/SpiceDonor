# Spice Döner - Restaurant Website

A modern, fast, and SEO-friendly Angular 18 restaurant website with dynamic menu management. Features spreadsheet-driven content management, external ordering integration, and comprehensive accessibility support.

## 🌟 Features

### Core Functionality
- **Dynamic Menu Management**: Update menu items via Google Sheets or CSV/XLSX files without redeployment
- **Multi-platform Ordering**: Integration with Wolt, Bolt Food, and Foodora
- **Internationalization**: English and Finnish language support with easy extensibility
- **PWA Support**: Offline functionality, app-like experience, installable
- **SEO Optimized**: Server-side rendering, structured data, meta tags, sitemap
- **GDPR Compliant**: Cookie consent management, analytics consent mode

### Technical Features
- **Angular 18**: Latest Angular with Universal SSR
- **TypeScript**: Strict mode with comprehensive type safety
- **SCSS**: Modern responsive design with CSS custom properties
- **Performance**: Lighthouse 90+ scores, code splitting, lazy loading
- **Accessibility**: WCAG 2.1 AA compliant, semantic HTML, ARIA attributes
- **Caching**: Smart cache strategies for menu data and assets

### Design
- **Mobile-first**: Responsive design optimized for all screen sizes
- **Mediterranean Theme**: Warm color palette inspired by Middle Eastern cuisine
- **Modern UI**: Clean cards, smooth transitions, appealing typography
- **Brand Consistency**: Customizable colors and styling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Angular CLI: `npm install -g @angular/cli`

### Installation

```bash
# Clone or download the project
cd restaurant-website

# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:4200
```

### Development Commands

```bash
npm start                 # Development server
npm run build            # Production build
npm run build:ssr        # SSR production build
npm run serve:ssr        # Serve SSR build locally
npm test                 # Unit tests
npm run lint            # Code linting
```

## 📊 Data Management

### Using one Excel workbook (default setup)

The site reads `outputs/menu/menu.xlsx`. The Angular build copies this one workbook to
`assets/data/menu.xlsx`; each worksheet is loaded by name at runtime:

- `items`
- `categories`
- `option_groups`
- `options`
- `specials`
- `hours`
- `site_settings`

Edit rows directly in Excel. Adding or removing an item, changing its category, renaming it,
or changing a price does not require an application rebuild. Replace the workbook at the same
deployed URL and the site refreshes it automatically within five minutes. For a cloud-hosted
workbook, set `workbookUrl` once to a stable public HTTPS download URL; the host must allow CORS.

The `available` and `visible` columns control whether items and categories appear. Do not rename
worksheet tabs or header columns. Keep IDs unique and use a `category_id` listed on the
`categories` sheet.

### Using CSV Files (legacy fallback)

CSV files in `src/assets/data/` remain supported if `workbookUrl` is removed from the environment configuration.

**To update menu data:**
1. Edit the CSV files in `src/assets/data/`
2. The app will automatically load the new data
3. Changes appear within 5 minutes due to caching

### Using Google Sheets (Recommended for Production)

For easier menu management, connect to Google Sheets:

**Setup Steps:**

1. **Create a Google Sheet** with the following tabs:
   - `categories`
   - `items` 
   - `option_groups`
   - `options`
   - `specials`
   - `hours`
   - `site_settings`

2. **Use the provided CSV templates** in `src/assets/data/` as column headers

3. **Configure data source** in `src/environments/environment.ts`:

```typescript
export const environment = {
  // ... other config
  dataSource: {
    type: 'googleSheet',
    googleSheet: {
      spreadsheetId: 'your-google-sheet-id',
      // Option A: Use published URLs (no API key needed)
      ranges: {
        categories: 'categories',
        items: 'items',
        // ... other ranges
      }
      // Option B: Use Sheets API (requires API key)
      // apiKey: 'your-api-key',
      // ranges: {
      //   categories: 'categories!A:Z',
      //   items: 'items!A:Z',
      //   // ...
      // }
    }
  }
};
```

4. **For published sheets (no API key):**
   - File > Share > Publish to web
   - Select each sheet individually
   - Choose "Comma-separated values (.csv)"
   - Copy the published URL pattern

5. **For API access:**
   - Enable Google Sheets API in Google Cloud Console
   - Create API key with Sheets API access
   - Make sheet readable by "Anyone with the link"

### Data Schema

#### Categories (categories.csv)
```csv
id,name_en,name_fi,description_en,description_fi,sort_order,visible
bowls,Bowls,Kulhot,Signature hummus bowls,Hummus kulhoja,1,TRUE
```

#### Items (items.csv)
```csv
id,category_id,name_en,name_fi,description_en,description_fi,price,discount_price,currency,dietary_tags,allergens,available,image_url,order_links,options_group_ids
classic_bowl,bowls,Classic Hummus,Klassinen hummus,Traditional hummus bowl,Perinteinen hummus,11.90,,EUR,"vegan,gluten-free","sesame",TRUE,assets/images/bowl.jpg,,toppings
```

#### Site Settings (site-settings.csv)
```csv
hero_title_en,hero_title_fi,hero_subtitle_en,hero_subtitle_fi,phone,email,address_line1,city,postal_code
"Fresh Middle Eastern","Tuoreita makuja","Crafted daily","Valmistettu päivittäin","+358...",hello@restaurant.fi,"Street 1","Helsinki","00100"
```

### External Ordering Setup

Configure ordering platform links in your site settings or environment:

```typescript
// In environment.ts
externalOrder: {
  wolt: 'https://wolt.com/fi/your-restaurant',
  bolt: 'https://food.bolt.eu/your-restaurant', 
  foodora: 'https://www.foodora.fi/your-restaurant'
}
```

## 🎨 Customization

### Brand Colors

Update brand colors in `src/environments/environment.ts`:

```typescript
brandColors: {
  primary: '#2E6F40',    // Deep green
  secondary: '#D4A373'   // Warm ochre
}
```

Or override CSS custom properties in `src/styles.scss`:

```scss
:root {
  --primary-color: #your-primary-color;
  --secondary-color: #your-secondary-color;
}
```

### Content & Copy

- Update hero content in site settings CSV/sheet
- Modify translations in `src/app/core/services/i18n.service.ts`
- Replace placeholder images in `src/assets/images/`
- Update contact information in site settings

### Logo & Images

Replace the following placeholder files:
- `src/assets/images/logo.svg` - Main logo
- `src/assets/images/hero-bg.jpg` - Hero background
- `src/assets/images/menu/*.jpg` - Menu item images
- `src/assets/icons/*` - PWA icons and favicon

## 🚀 Deployment

### Static Hosting (Netlify/Vercel)

```bash
# Build for production
npm run build

# Deploy dist/ folder
```

### SSR Hosting (Vercel/Railway)

```bash
# Build SSR version
npm run build:ssr

# Deploy with Node.js support
```

### Environment Variables

Set these in your hosting platform:

- `GA4_MEASUREMENT_ID` - Google Analytics 4 measurement ID
- `GOOGLE_SHEETS_API_KEY` - For Sheets API access (optional)

## 🔧 Configuration

### Google Analytics 4

1. Create GA4 property
2. Update measurement ID in `src/environments/environment.prod.ts`
3. Cookie consent banner automatically handles consent mode

### SEO Configuration

The app automatically generates:
- Meta tags for each page
- Open Graph and Twitter Card tags
- JSON-LD structured data
- Sitemap.xml (at `/sitemap.xml`)
- Robots.txt (at `/robots.txt`)

### Performance Optimization

Built-in optimizations:
- Route-based code splitting
- Lazy loading of images and components
- Service worker caching
- Optimized bundle sizes
- Critical CSS inlining

## 📱 PWA Features

The app includes:
- App manifest for installation
- Service worker for offline functionality  
- Background sync for menu updates
- Push notification capability (ready to implement)
- App-like navigation and UI

## ♿ Accessibility

WCAG 2.1 AA compliant features:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Color contrast compliance
- Screen reader optimization
- Focus management

## 🌍 Internationalization

### Adding New Languages

1. Update `SupportedLanguage` type in `i18n.service.ts`
2. Add translations to the `translate()` method
3. Update content models to include new language keys
4. Add language option to header component

### Content Structure

All user-facing content uses the `LocalizedContent` interface:

```typescript
interface LocalizedContent {
  en: string;
  fi: string;
  // Add new languages here
}
```

## 🔍 Analytics & Tracking

Built-in tracking for:
- Page views
- Menu item views
- External order clicks
- Language changes
- Search queries
- Contact form submissions
- Errors and performance

## 🛠️ Development

### Project Structure

```
src/
├── app/
│   ├── core/               # Services, models, core functionality
│   │   ├── models/         # TypeScript interfaces
│   │   └── services/       # Data, i18n, SEO, analytics services
│   ├── features/           # Feature modules (home, menu, etc.)
│   ├── shared/             # Shared components and modules
│   └── app.module.ts       # Main app module
├── assets/                 # Static assets and data files
├── environments/           # Environment configurations
└── styles.scss            # Global styles
```

### Key Services

- **MenuDataService**: Handles data loading, caching, parsing
- **I18nService**: Language management and translations
- **SeoService**: Meta tags, structured data, sitemaps
- **AnalyticsService**: GA4 integration with consent management

### Adding New Features

1. Create feature module in `src/app/features/`
2. Add route to `app-routing.module.ts`
3. Update navigation in header component
4. Add translations to `i18n.service.ts`

## 🐛 Troubleshooting

### Common Issues

**Menu data not loading:**
- Check CSV file format and headers
- Verify Google Sheets publication settings
- Check browser network tab for errors
- Clear localStorage cache

**Build errors:**
- Ensure all dependencies are installed: `npm ci`
- Check TypeScript strict mode errors
- Verify environment configuration

**Deployment issues:**
- Check build output in `dist/` folder
- Verify routing configuration for SPA
- Ensure environment variables are set

## 📄 License

This project is provided as a template. Customize freely for your restaurant needs.

## 🤝 Support

For customization or setup assistance, the codebase is well-documented with TypeScript interfaces and inline comments.

## 🔄 Updates

The application is designed for easy maintenance:
- Menu updates via spreadsheet (no code changes)
- Modular architecture for feature additions
- Comprehensive typing for safe refactoring
- Automated testing setup ready for expansion

---

**Built with ❤️ for the restaurant industry**
