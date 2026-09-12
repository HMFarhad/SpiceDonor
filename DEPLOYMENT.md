# Spice Döner deployment guide

The production site is designed for Cloudflare Pages. GitHub remains the source-code
repository and its Pages workflow remains available as a secondary preview.

## Cloudflare Pages settings

Create one Pages project from the `HMFarhad/SpiceDonor` GitHub repository with:

- Production branch: `main`
- Framework preset: Angular
- Build command: `npm run build`
- Build output directory: `dist/restaurant-website/browser`
- Node.js version: `20`

No paid hosting space, VPS, database, or server is required. Cloudflare builds the
static Angular application after every push to `main` and provides HTTPS automatically.

## Domains

Use `spicedonor.fi` as the primary address. Add these custom domains to the same Pages
project:

- `spicedonor.fi`
- `www.spicedonor.fi`
- `spicedonor.com`
- `www.spicedonor.com`

Create Cloudflare redirect rules so all non-primary variants permanently redirect to
`https://spicedonor.fi` while preserving the path and query string. Do not enter custom
nameservers at the registrar until Cloudflare displays the exact two nameserver values
assigned to each domain. Then replace the registrar defaults with those values.

## Included production behavior

- Root-domain Angular routing and a Cloudflare SPA fallback
- Canonical, Open Graph, sitemap, and robots URLs for `spicedonor.fi`
- Security and caching headers
- Optimized menu images only in the deployed asset bundle
- `menu.xlsx` published at `assets/data/menu.xlsx`
- Legal company details and Finnish/English privacy and website terms
- Analytics disabled until a real GA4 measurement ID is deliberately configured

## Verification after the first Pages deployment

1. Test the generated `*.pages.dev` address before attaching domains.
2. Open `/`, `/menu`, `/contact`, `/privacy`, and `/terms` directly in a new tab.
3. Confirm the Forum address, menu prices, opening hours, Wolt link, map, and both
   languages with the restaurant owner.
4. Submit the contact form and confirm the message arrives at the intended mailbox.
5. Confirm HTTPS and all `.com`/`www` redirects after DNS becomes active.

## GitHub Pages preview

The GitHub Actions workflow supplies `/SpiceDonor/` as the base path only for the
GitHub Pages preview. The default production build uses `/` for Cloudflare and the
custom domains.
