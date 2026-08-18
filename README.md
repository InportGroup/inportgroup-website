# INPORTGROUP — Corporate Website

Static one-page site for INPORTGROUP, industrial technology solutions.

- **Live:** https://www.inportgroup.com
- **Source:** `index.html` (self-contained: inline CSS, no build step)

## Structure

| File | Purpose |
|---|---|
| `index.html` | The full site — hero, technology, solutions, benefits, process, contact |
| `CNAME` | Custom domain for GitHub Pages (`www.inportgroup.com`) |
| `.nojekyll` | Disables Jekyll processing |
| `robots.txt` / `sitemap.xml` | Search engine directives |

## Local preview

```bash
python -m http.server 8000
# open http://localhost:8000
```

## Deploy

Push to `main`. GitHub Pages rebuilds automatically.

```bash
git add -A && git commit -m "Update site" && git push
```

## DNS (IONOS)

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 / .109.153 / .110.153 / .111.153 |
| AAAA | @ | 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153 |
| CNAME | www | inportgroup.github.io |

## Contact

Beatriz Abuelo — Solutions Director — beatriz.abuelo@inportgroup.com
