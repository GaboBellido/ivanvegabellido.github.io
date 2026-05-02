# ivanvegabellido.com

Personal site for Ivan Vega Bellido — Materials Scientist & Policy Researcher.

Single-page static site, no build step required.

## Files

- `index.html` — page structure & content
- `styles.css` — all styling
- `script.js` — minor enhancements (footer year, smooth scroll)

## Editing content

All copy lives directly in `index.html`. Find a section by the comment header (`<!-- HERO -->`, `<!-- ABOUT -->`, etc.) and edit the text in place.

To add an essay to the Writing section later, replace the `.writing-empty` block in `index.html` with a grid of article cards. The CSS already supports a clean grid layout — just match the existing `.research-card` styling or build something simpler.

## Local preview

From the project folder, run any static server. The simplest option:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Deploying to GitHub Pages

1. **Create the repo on GitHub.** Name it `ivanvegabellido.github.io` (this gives you a free `https://ivanvegabellido.github.io` URL automatically) — or any name if you'll only use a custom domain.

2. **Push these files:**

   ```bash
   cd /path/to/this/folder
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. **Turn on Pages.** Repo → Settings → Pages → Source: `Deploy from a branch`, Branch: `main`, Folder: `/ (root)`. Save. Give it a minute.

4. **Custom domain (`ivanvegabellido.com`).** In the same Pages settings, enter your domain. Then at your domain registrar, add these DNS records pointing at GitHub:

   - `A` records on the apex (`@`) pointing to: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` record on `www` pointing to `<your-username>.github.io`

   Re-check the "Enforce HTTPS" box on GitHub once DNS propagates (can take up to 24h, usually much faster).

## Notes on the design

- Cormorant Garamond (display) + Inter (body) loaded from Google Fonts
- Cream / deep indigo / antique gold palette per the brief
- Sacred geometry (flower-of-life) background pattern, intentionally low opacity
- Scroll-triggered fade-in only on the hero — keeps it restrained
- Fully responsive down to ~360px wide
- Respects `prefers-reduced-motion`
