# Eudirok Jewellery website

Static site (HTML, CSS, one small JS file). No build step needed.

## Publish on GitHub Pages with eudirok.com

1. Create a GitHub repository and upload everything in this folder to the root of the `main` branch.
2. In the repository, open Settings > Pages and publish from the `main` branch, root folder.
3. The `CNAME` file already contains `eudirok.com`. In Settings > Pages, confirm the custom domain and tick "Enforce HTTPS" once it is available.
4. At your domain registrar, point the domain to GitHub Pages:
   - Apex `eudirok.com`: four A records to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153.
   - `www`: a CNAME record to `<your-github-username>.github.io`.
5. Remove or redirect the old Webador site only after the new one loads on eudirok.com.

## Things to edit

- Contact email: `CONTACT_EMAIL` at the top of the build script, or the `data-to` attribute on the form in `contacts/index.html`.
- Page text: edit the `index.html` files directly.
- Colours and type: the variables at the top of `assets/css/style.css`.
