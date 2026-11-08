# ARV — High-end one-page landing site

Static HTML/CSS/JavaScript site prepared for GitHub Pages. The custom-domain binding is intentionally not configured yet because `somosarv.com` must be recovered first.

## Files
- `index.html` — page structure, SEO and Open Graph metadata.
- `styles.css` — responsive visual system and interactions.
- `script.js` — navigation overlay, scroll reveals, accordions.
- `assets/` — ARV identity, selected project visuals and optimized images.

## Local preview
Open `index.html` in a browser, or run a local server from this folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## GitHub Pages
1. Create a public repository named `arv-website`.
2. Upload the contents of this folder (not the parent folder).
3. In Settings → Pages, select Deploy from a branch, branch `main`, folder `/root`.
4. Test the generated `github.io` address before connecting the custom domain.
5. Only after the domain is recovered, add `somosarv.com` as the Custom domain in Pages and follow GitHub's current DNS instructions. GitHub will create or ask for a `CNAME` file.
6. Preserve all MX, SPF, DKIM, DMARC and email-verification DNS records. Only change website-related records when switching hosting.
7. Enable Enforce HTTPS after the certificate is issued.

## Before production
- Confirm permission to publish partner/client marks and screenshots, especially product-interface crops originating in a deck marked confidential.
- Confirm that `fbf@somosarv.com` and the WhatsApp contact number in the CTAs are still the preferred public contact details.
- The Open Graph image uses the final domain URL `https://somosarv.com/assets/arv-social-cover.jpg`; it will work once the site is published there.
- Review the public wording of case studies and keep numerical performance claims out until the underlying figures and attribution are confirmed.
