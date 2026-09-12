# Spice Döner production launch plan

Assessment date: 12 September 2026

## Decision

Keep GitHub as the code repository and deploy the site to Cloudflare Pages. The domains
`spicedonor.fi` and `spicedonor.com` have now been purchased and will point to Cloudflare. The current site is
a static Angular application: ordering is handled by external services, menu data is
packaged in the build, and the contact form uses EmailJS. It does not need a VPS,
database, managed backend, or paid web-hosting package.

The existing GitHub Pages deployment is useful as a preview, but GitHub states that
Pages is not intended to run an online business. Cloudflare Pages is therefore the
safer permanent home for the restaurant site.

## What to buy

| Item | Quantity | Supplier | Cost | Decision |
| --- | ---: | --- | ---: | --- |
| `spicedonor.fi` and `spicedonor.com` | 2 domains | Existing registrar | Already purchased; renewals vary by registrar/TLD | Purchased; keep auto-renew enabled |
| Static site hosting | 1 Cloudflare Pages project | Cloudflare Free | €0 | Required |
| DNS, CDN, DDoS protection, SSL certificate | 1 Cloudflare Free zone | Cloudflare | €0 | Required |
| Contact-form delivery | 1 existing EmailJS account | EmailJS Free | €0 up to 200 requests/month | Required; verify and secure before launch |
| Business email, lean option | `info@spicedonor.fi` forwarding | Cloudflare Email Routing | €0, inbound forwarding only | Minimum launch option |
| Business email, recommended option | 1 mailbox | Microsoft 365 Business Basic EEA (no Teams) | €4.67 + VAT/user/month on annual billing | Recommended for sending and receiving as `info@spicedonor.fi` |
| Analytics | 1 GA4 property | Google Analytics | €0 | Optional; either configure correctly or remove it |
| Uptime monitoring | 1 monitor | UptimeRobot/Better Stack free tier or equivalent | €0 | Recommended |

The two domains are already purchased, so the remaining mandatory hosting, DNS, CDN
and SSL cost is **€0** on Cloudflare's free plan. The only likely additional recurring
cost is an optional business mailbox. Keep both domain registrations on auto-renew and
record their actual renewal prices in the company account register.

## Current readiness

- Production Angular build passes.
- All five automated tests pass.
- The existing GitHub Pages site responds successfully.
- The static Cloudflare route is suitable; the repository's SSR build currently fails
  and is not needed for launch.
- The production build contains 304 files. Its largest file is about 12 MB, below the
  Cloudflare Pages 25 MiB per-file limit, and the file count is well below the 20,000
  free-plan limit.
- The build is about 290 MB because approximately 228 MB of original photographs are
  copied alongside approximately 16 MB of optimized menu images. This should be cleaned
  up before launch, although it does not require paid hosting.

## Action items

### 1. Secure ownership and accounts — owner, same day

- [ ] Confirm that “Spice Döner” / `spicedonor.fi` does not infringe another protected
      Finnish company name or trademark.
- [x] Register `spicedonor.fi` and `spicedonor.com`.
- [ ] Enable auto-renew and MFA; record the registrar login and recovery codes in the
      company's password manager.
- [x] Create a Cloudflare account owned by the business. Enable MFA and invite the
      developer separately instead of sharing the owner password.
- [ ] Decide whether the source repository will remain public. Cloudflare can deploy
      from either a public or private GitHub repository.

### 2. Complete production content — owner + developer, 1 day

- [ ] Confirm the telephone number, opening hours, customer-service email, and map pin.
- [x] Add the confirmed legal name `Spice Döners Suomi Oy`, Business ID `3614901-8`,
      and restaurant address at Kauppakeskus Forum, Mannerheimintie 20, 00100 Helsinki.
- [x] Keep the confirmed Wolt link and hide Uber Eats until an exact restaurant link is supplied.
- [x] Remove the placeholder phone number and stale “Bengali cuisine” metadata.
- [x] Hide unfinished Catering and FAQ pages from public navigation.
- [x] Add Finnish/English privacy information for contact-form data, EmailJS,
      hosting logs, and analytics; replace the current placeholder privacy/terms pages.
- [x] Keep analytics off until a real GA4 property is configured and consent is available.

### 3. Prepare the root-domain build — developer, 1 day

- [x] Change Angular `baseHref` from `/SpiceDonor/` to `/` for the custom domain.
- [x] Change canonical/Open Graph URLs and images to `https://spicedonor.fi`.
- [x] Add sitemap and robots references for the domain.
- [x] Put the confirmed production order link and GA4 choice in production config.
- [x] Make the SPA fallback work on Cloudflare (`/* /index.html 200`).
- [x] Stop copying unused original menu photographs into the deployed artifact; deploy
      optimized WebP variants and only intentional non-menu originals.
- [x] Configure long-lived caching for hashed JS/CSS/images and short/no-cache behavior
      for HTML and `assets/data/menu.xlsx`.
- [ ] Build from a clean checkout and run unit tests.

Exit criteria: production build succeeds, direct navigation to every route works, no
placeholder IDs/text remain, the deployed artifact contains no file above 25 MiB, and
the menu workbook refresh behavior is confirmed.

### 4. Secure the contact channel — owner + developer, half day

- [ ] Verify which mailbox currently receives EmailJS submissions and make the business
      owner an administrator of the EmailJS account.
- [ ] Add `https://spicedonor.fi` and `https://www.spicedonor.fi` to the allowed-origin
      list if the chosen EmailJS plan supports it.
- [ ] Add CAPTCHA/anti-bot protection and test success, failure, reply-to, and spam
      handling. The free plan stops processing after 200 requests/month; upgrade to the
      $9/month Personal plan only if volume/security needs require it.
- [ ] Create `info@spicedonor.fi`: use Cloudflare forwarding for inbound-only use, or
      create one Microsoft 365 mailbox for proper business sending and receiving.
- [ ] Configure and verify MX, SPF, DKIM and DMARC records for the selected mail option.

### 5. Create the Cloudflare deployment — developer, half day

- [ ] In Cloudflare Pages, connect the `HMFarhad/SpiceDonor` GitHub repository.
- [ ] Select the production branch (`main`).
- [ ] Set build command to `npm run build`.
- [ ] Set output directory to `dist/restaurant-website/browser`.
- [ ] Pin a supported Node.js version (Node 20 is the current repository workflow
      baseline).
- [ ] Deploy first to the generated `*.pages.dev` preview address.
- [ ] Test desktop/mobile navigation, menu images/data, language switching, order links,
      map, cookie choices, PWA install, and contact-form delivery.

### 6. Connect the domain and email — owner + developer, same day

- [ ] Add `spicedonor.fi` as a Cloudflare DNS zone.
- [ ] At Domainhotelli, replace the registrar nameservers with the two Cloudflare
      nameservers assigned to the zone.
- [ ] In the Pages project, add `spicedonor.fi` and `www.spicedonor.fi` as custom domains.
- [ ] Choose `https://spicedonor.fi` as canonical and permanently redirect `www` to it.
- [ ] Wait for Cloudflare to issue SSL, then enforce HTTPS.
- [ ] Add the selected email provider's MX/SPF/DKIM/DMARC records without proxying mail
      records.
- [ ] Keep the old GitHub Pages address only as a temporary rollback/preview, and ensure
      it does not compete as an indexed canonical site.

### 7. Launch verification — developer + owner, 1–2 hours

- [ ] Verify `http` → `https`, `www` → apex, and unknown route → Angular application.
- [ ] Test Chrome, Safari and Firefox plus an iPhone and Android-sized viewport.
- [ ] Submit a real contact request and reply from `info@spicedonor.fi`.
- [ ] Confirm the menu, prices, allergens, opening hours, address and order links with the
      restaurant owner.
- [ ] Run Lighthouse/PageSpeed and correct severe accessibility, performance or SEO
      failures.
- [ ] Add the domain to Google Search Console, submit the sitemap, and verify the Google
      Business Profile website URL.
- [ ] Enable a free uptime monitor and Cloudflare deployment notifications.
- [ ] Record launch date, account owners, renewal date, rollback procedure and who is
      responsible for menu/content updates.

## Operating procedure after launch

- A push to `main` creates a production deployment; pull requests should use preview
  deployments for review first.
- Cloudflare retains prior deployments for quick rollback.
- Review domain renewal, mailbox billing and account access quarterly.
- Test the contact form monthly and after every related code or email-provider change.
- Update the menu workbook through a reviewed change until a protected external content
  workflow is deliberately introduced.

## Sources checked

- Cloudflare Pages pricing and limits:
  https://developers.cloudflare.com/pages/functions/pricing/
  and https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare custom domains:
  https://developers.cloudflare.com/pages/configuration/custom-domains/
- Domainhotelli `.fi` pricing:
  https://www.domainhotelli.fi/domain/
- Traficom `.fi` guidance:
  https://www.traficom.fi/en/fi-domains/applying-and-using-fi-domains/how-get-fi-domain-name
- Microsoft 365 Finland pricing:
  https://www.microsoft.com/fi-fi/microsoft-365/business/microsoft-365-business-basic
- Cloudflare Email Routing:
  https://developers.cloudflare.com/email-service/platform/pricing/
- EmailJS pricing:
  https://www.emailjs.com/pricing/
- GitHub Pages product terms:
  https://docs.github.com/en/site-policy/github-terms/github-terms-for-additional-products-and-features
