# Spice Döner Deployment Guide

## GitHub Pages Deployment

This application is configured for deployment to GitHub Pages at `hmfarhad.github.io/BengalRuokopaikka`.

### Prerequisites
- GitHub repository named `BengalRuokopaikka`
- GitHub Pages enabled for the repository

### Build and Deploy Steps

1. **Build for production:**
   ```bash
   ng build --configuration production
   ```

2. **Copy build files:**
   The build creates files in `dist/restaurant-website/`. Copy all contents to your GitHub repository.

3. **GitHub Repository Setup:**
   - Create repository: `https://github.com/hmfarhad/BengalRuokopaikka`
   - Enable GitHub Pages in repository settings
   - Set source to "Deploy from a branch" and select "main" branch

4. **Deploy Commands:**
   ```bash
   # Build the application
   ng build --configuration production

   # Navigate to dist folder
   cd dist/restaurant-website

   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Deploy Spice Döner website"

   # Add GitHub remote
   git remote add origin https://github.com/hmfarhad/BengalRuokopaikka.git
   git branch -M main
   git push -u origin main
   ```

### Configuration Details

- **Base HREF:** Set to `/BengalRuokopaikka/` for subdirectory deployment
- **Routing:** Configured with 404.html for GitHub Pages SPA routing
- **Assets:** Includes all necessary files (images, data, manifest)
- **PWA:** Service worker configured for GitHub Pages URLs

### File Structure After Build:
```
dist/restaurant-website/
├── index.html (with base href="/BengalRuokopaikka/")
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
`https://hmfarhad.github.io/BengalRuokopaikka/`

### Troubleshooting
- Ensure GitHub Pages is enabled in repository settings
- Check that all files are committed to the main branch
- Verify the base href is correctly set to `/BengalRuokopaikka/`
- Wait a few minutes for GitHub Pages to update after pushing changes