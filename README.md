# Eudirok Jewellery website

Static site (HTML, CSS, one small JS file). No build step.

Pages: Home, About us, Services, Sourcing, Compliance, Contacts. Media (photos, background videos, logo) is in `media/`.

## Publish on GitHub Pages with eudirok.com

1. Settings > Pages: publish from the `main` branch, root folder.
2. `CNAME` already contains `eudirok.com`. Tick "Enforce HTTPS" once available.
3. DNS: apex `eudirok.com` with four A records to 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153; `www` as a CNAME to `<github-username>.github.io`.

## Editing

- Text: edit the `index.html` inside each page folder.
- Colours and fonts: variables at the top of `assets/css/style.css`.
- The enquiry form prepares an email in the visitor's own mail app (a static site cannot send mail).
