# Eudirok Jewellery website

Static site: HTML, one stylesheet, one small script. No build step.

## Pages

- `/` Home: hero video, metals, stones, services, Dubai band, vaulting, sourcing and compliance summaries
- `/about-us/` About us, mission and vision, Dubai photos
- `/services/` The seven services, storage and vaulting, weight converter
- `/sourcing/` Responsible gold sourcing: twelve steps, supplier requirements, what is not traded, the UAE five-step framework
- `/guide/` Buyer's guide: purity, weight and paperwork for gold, silver, platinum and palladium
- `/uae-gold-market/` Dubai and the UAE gold market: DMCC, UAE Good Delivery, storage, events
- `/market-notes/` Market notes: figures from the World Gold Council, Silver Institute and WPIC, to be updated each quarter
- `/compliance/` Governance, company register, roles, programme, policy request
- `/contacts/` Enquiry form (prepares an email), phone, address
- `/privacy/` Privacy notice: what is collected from visitors, enquiries and trading counterparties, who receives it, retention, rights
- `/cookies/` Cookie policy: the site sets no cookies and uses no browser storage; lists what loads from other companies

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

## Cookies and privacy

The site sets no cookies, uses no browser storage, and has no analytics, advertising or social plugins, so it shows no cookie banner.
The only requests to other companies are Google Fonts (typefaces), Unsplash (some photographs) and the host, GitHub Pages. If you add any tracking or
analytics tool, update `/cookies/` and `/privacy/` first and add a consent banner where the law requires one.
To remove the Google Fonts request, host the two typefaces in `assets/fonts/` and change the stylesheet links in each page.

## Photography

Some photographs are linked from Unsplash (free to use under the Unsplash License) and credited on `/credits/`. They are not stored in this repository. To restore the version before the redesign: `git checkout before-redesign`.
