# Eudirok Jewellery website

Static site: HTML, one stylesheet, one small script. No build step.

## Pages

- `/` Home: hero video, metals, stones, services, Dubai band, vaulting, sourcing and compliance summaries
- `/about-us/` About us, mission and vision, Dubai photos
- `/services/` The seven services, storage and vaulting, weight converter
- `/sourcing/` Responsible gold sourcing: twelve steps, supplier requirements, what is not traded
- `/compliance/` Governance, company register, roles, programme, policy request
- `/contacts/` Enquiry form (prepares an email), phone, address

All photos, videos and the logo are in `media/`.

## Publishing

GitHub Pages serves this repository from the root of `main`. The `CNAME` file holds `eudirok.com`.
For the domain, point the apex to GitHub Pages (A records 185.199.108.153, 185.199.109.153,
185.199.110.153, 185.199.111.153) and `www` to `<username>.github.io`, then enable "Enforce HTTPS".

## Editing

- Text: edit the `index.html` file of each page.
- Colours and type: variables at the top of `assets/css/style.css`.
- Contact details: search for `info@eudirok.com` and `+971585509345`.
