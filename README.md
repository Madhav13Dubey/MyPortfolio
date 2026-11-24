# Madhav Dubey — Portfolio

![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-24+-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![CI](https://img.shields.io/badge/CI-GitHub%20Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white)
![Commits](https://img.shields.io/badge/commits-conventional-FE5196?style=flat-square)

Personal developer portfolio: a fast, accessible, dependency-free front end built with Vite,
linted and tested on every push, and deployed to GitHub Pages (Vercel-ready).

## Quick start

```bash
nvm use            # Node 24 (see .nvmrc)
npm ci
npm run dev        # http://localhost:5173
```

| Command                                           | What it does                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                                     | Vite dev server                                                        |
| `npm run build`                                   | Production build to `dist/`                                            |
| `npm run preview`                                 | Serve the production build                                             |
| `npm run lint`                                    | Structure, assets, hygiene, ESLint, Stylelint, html-validate, Prettier |
| `npm test`                                        | Vitest unit tests                                                      |
| `npm run e2e`                                     | Playwright smoke tests against the production build                    |
| `npm run build:ci`                                | Everything CI runs: lint + build + bundle budget                       |
| `npm run images:optimize -- <file> [--width=900]` | Convert an image to compressed WebP                                    |

## Project structure

```
index.html              Page markup (single entry, Vite root)
src/
  main.js               Entry: wires all behaviour modules
  styles/               tokens -> base -> layout -> components -> effects -> responsive (main.css imports all)
  scripts/              typewriter, nav, tabs, reveal, contact-form, config
  assets/images/        Optimized WebP images (profile/, projects/)
public/                 Served as-is: favicon, robots.txt, 404.html, og-image.jpg, Madhav_Resume.pdf
scripts/                Repo guardrails: check-structure / check-assets / check-hygiene / optimize-images
tests/unit/             Vitest tests
tests/e2e/              Playwright smoke tests
.github/                Workflows, composite setup action, PR template, Dependabot
.husky/                 Git hooks: pre-commit (lint-staged), commit-msg (commitlint), pre-push
```

## Pipeline (GitHub Actions)

`validate -> test -> build -> smoke`, then deploy on `main`:

| Workflow      | Trigger                 | Jobs                                                                                                                     |
| ------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `ci.yml`      | every push, PRs to main | structure, hygiene+assets, lint, commitlint (PRs), unit tests, build + bundle budget, Playwright smoke, Lighthouse >= 90 |
| `deploy.yml`  | CI green on `main`      | Builds with `VITE_BASE=/MyPortfolio/` and publishes to GitHub Pages                                                      |
| `release.yml` | manual                  | Next semver tag, versioned `.tar.gz` + sha256, GitHub Release                                                            |
| `stale.yml`   | daily                   | Closes inactive issues/PRs                                                                                               |

### One-time GitHub setup

1. **Settings -> Pages -> Source:** GitHub Actions.
2. **Settings -> Branches:** protect `main`, require the CI jobs above.
3. **Contact form (optional but recommended):** create a free form at [formspree.io](https://formspree.io),
   then add the repo variable **Settings -> Secrets and variables -> Actions -> Variables ->
   `FORM_ENDPOINT`** = `https://formspree.io/f/<id>`. Messages then arrive in your inbox.
4. Add your resume at `public/Madhav_Resume.pdf` (the "Download CV" button points there).

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org), enforced by commitlint (locally and on PRs):

```
feat(projects): add Chat Analyzer card
fix(nav): close menu after selecting a link
chore(deps): bump vite
```

## Deploying to Vercel later

Import the repo in Vercel (framework: Vite). Nothing else is needed — `VITE_BASE` defaults to `/`.
Set `SITE_URL` (canonical / Open Graph URL) and `VITE_FORM_ENDPOINT` in Vercel's env settings.

## Privacy

The phone number is intentionally masked (`6006XXXXXX`); `npm run hygiene:check` fails if the real
number is ever committed.
