# Spice Döner Deployment Guide

## GitHub Pages Deployment

This application is configured for deployment to GitHub Pages at `hmfarhad.github.io/SpiceDonor`.

### Prerequisites
- GitHub repository named `SpiceDonor`
- GitHub Pages enabled for the repository

### Automated Deployment

The deployment is now fully automated using GitHub Actions. Simply push to the `main` branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### GitHub Pages Setup

1. Go to repository: `https://github.com/hmfarhad/SpiceDonor`
2. Navigate to **Settings** → **Pages**
3. Set source to **GitHub Actions**
4. The GitHub Actions workflow will automatically:
   - Install dependencies
   - Build the Angular application
   - Deploy to GitHub Pages

### Manual Build (Optional)

If you need to build locally:
```bash
npm install
npm run build
```

### Configuration Details

- **Base HREF:** Set to `/SpiceDonor/` for subdirectory deployment
- **GitHub Actions:** Automated build and deployment workflow
- **Routing:** Configured with 404.html for GitHub Pages SPA routing
- **Assets:** Includes all necessary files (images, data, manifest)
- **PWA:** Service worker configured for GitHub Pages URLs
- **Build Output:** `dist/restaurant-website/browser/` is deployed

### File Structure After Build:
```
dist/restaurant-website/
├── index.html (with base href="/SpiceDonor/")
├── 404.html (SPA routing fallback)
├── CNAME (custom domain config)
├── _redirects (fallback routing)
├── assets/
├── data/
├── manifest.json
└── ... (Angular build files)
```

### Verification
After deployment, the site should be available at:
`https://hmfarhad.github.io/SpiceDonor/`

### Troubleshooting
- Ensure GitHub Pages is enabled and set to "GitHub Actions" in repository settings
- Check the Actions tab for build/deployment status
- Verify the base href is correctly set to `/SpiceDonor/`
- Check that the workflow file `.github/workflows/deploy.yml` exists
- Wait a few minutes for GitHub Pages to update after successful deployment
- Review workflow logs if deployment fails