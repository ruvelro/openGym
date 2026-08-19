# openGym website

Source of the project website — plain hand-written HTML/CSS/JS, no build step.
Published to GitHub Pages by `.github/workflows/pages.yml`.

`img/` (the five screenshots from `../assets/screenshots/` plus `banner.png`) and
`icon-180.png` / `icon-512.png` (copied from `../frontend/public/`, the same icons
the PWA uses, so the browser tab, home screen and app all match) used to be added
at deploy time. They are checked in here now, so the folder is self-contained.

Nothing is added at deploy time any more. There was an `openGym.apk` download here; this
fork publishes no signed build, so the page points at `docs/MOBILE.md` instead of a file
that isn't there.

`site.js` fetches the star/fork counts from the public GitHub API at view time.

## Deployment

This folder is published at the root of GitHub Pages, with the demo build under `demo/`,
so paths inside the page are relative — the site lives at `/openGym/`, not at a domain
root. The workflow assembles both and deploys them together.
