# Eudirok Jewellery website

Static site: HTML, one stylesheet, one small script. No build step.

## Pages

- `/` Home: hero video, metals, stones, services, Dubai band, vaulting, sourcing and compliance summaries
- `/about-us/` About us, mission and vision, Dubai photos
- `/services/` The seven services, storage and vaulting, weight converter
- `/sourcing/` Responsible gold sourcing: twelve steps, supplier requirements, what is not traded
- `/compliance/` Governance, company register, roles, programme, policy request
- `/contacts/` Enquiry form (prepares an email), phone, address
- `/privacy/` Privacy notice describing what the site does and does not collect

All photos, videos and the logo are in `media/`.

## Publishing

GitHub Pages serves this repository from the root of `main`. The `CNAME` file holds `www.eudirok.com`,
the address the previous site used, so existing search rankings carry over. At the registrar, point `www`
to `zianky.github.io` (CNAME record) and the bare `eudirok.com` to GitHub Pages (A records 185.199.108.153,
185.199.109.153, 185.199.110.153, 185.199.111.153) so it redirects to `www`. Then enable "Enforce HTTPS".

## Editing

- Text: edit the `index.html` file of each page.
- Colours and type: variables at the top of `assets/css/style.css`.
- Contact details: search for `info@eudirok.com` and `+971585509345`.

## Quality checks

Before publishing, the pages were checked at 1440px and 390px for text contrast (including over the photos and
video), touch-target size, keyboard focus, heading order, landmarks, form labels, page titles and descriptions,
and broken links. The fonts are loaded from Google Fonts; self-hosting them would remove that third-party request.
