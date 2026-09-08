# frechowicz.com

Jakub Fręchowicz’s personal website. Static HTML from Astro, typed content collections, MDX, and a progressively loaded Three.js illustration. No framework hydration, database, CMS, analytics, or external font requests.

## Run locally

Use Node 22.12+ and pnpm 11.19 (the lockfile and build approvals are included).

```sh
pnpm install
pnpm dev
pnpm check
pnpm format
pnpm lint
pnpm build
pnpm test
pnpm preview
```

`check` runs Astro and TypeScript diagnostics. `lint` checks formatting through Prettier; there is no separate ESLint dependency. `test` checks the production output, so build first. Tests validate links/assets, page metadata, draft exclusion, the CV’s GPA, feed/sitemap output, and accidental publication of private identifiers.

## Structure

- `src/content.config.ts`: Zod schemas, date validation, collection references.
- `src/content/{projects,experience,education,writing}`: first-class MDX content entities.
- `src/content/pages/about.mdx`: editable About page.
- `src/lib/content.ts`: public-entry queries, sorting, date formatting, reference validation, reciprocal related links.
- `src/lib/profile.ts`: name, professional contact links, location, languages, awards.
- `src/components`: navigation-adjacent content primitives, project diagrams, hero.
- `src/pages/[section].astro`: public indexes, including the grouped `/work` view.
- `src/pages/[section]/[slug].astro`: statically generated detail pages.
- `src/pages/cv.astro`: CV assembled from the same collection entries.
- `src/styles/tokens.css`: palette, fonts, content widths.

Each entity’s filename becomes its URL slug. Linking a project to education automatically creates a connection in both directions. The build explicitly rejects missing reference targets. Draft writing is excluded from production routes, related links, RSS, and sitemap, including its body text.

## Add a project, employer, or education entry

Create `src/content/projects/my-project.mdx`, or use the corresponding `experience` or `education` directory:

```mdx
---
title: "Project title"
summary: "A factual one-sentence overview."
dateStart: "2026-09"
status: current
featured: true
featuredOrder: 1
tags: [Autonomous systems, Planning]
technologies: [Python]
relatedEducation: [eth-zurich]
cv:
  show: true
  priority: 20
  summary:
    - "A concise, supported CV statement."
---

## Context

Describe the problem.

## Approach

Explain the decisions, implementation, results, and limitations you can support.
```

Dates use `YYYY-MM`; optional `dateEnd` must not precede `dateStart`. Status is `current`, `completed`, `prospective`, or `archived`. Omit uncertain dates rather than invent them. Optional fields: `role`, `organization`, `location`, `grade`, `links: [{label, url}]`, `relatedProjects`, `relatedExperience`, `relatedEducation`, `relatedWriting`, and `art` (`pipeline`, `latent`, `matrix`). Concepts in `tags` receive stronger treatment than `technologies`. Use `featuredOrder` only for deliberate curation; otherwise entries use date order. CV order is independently controlled by `cv.priority`.

## Write a post

Create `src/content/writing/my-post.mdx`:

```mdx
---
title: "Article title"
summary: "A short description."
publishedAt: 2026-09-08
type: article
draft: true
tags: [Autonomous systems]
relatedProjects: [single-cell-representations]
---

Write in Markdown. MDX also supports imports and custom Astro components.
```

Types are `article`, `note`, and `project-log`. Optional `updatedAt` is displayed on the article. Change `draft` to `false`, commit, and push; a connected Cloudflare Pages project rebuilds automatically. No index edits are required. Drafts are excluded even in development to keep the behaviour predictable. Images can live in `src/assets/projects/<slug>/`; import them into MDX and use Astro’s `Image` with meaningful alt text and explicit dimensions. Markdown tables, code blocks, lists, and blockquotes are styled. Math rendering and search are intentionally deferred.

Three published sample posts demonstrate the templates and one draft demonstrates exclusion. Samples have `sample: true`, conspicuous labels, and noindex metadata. They are omitted from the homepage’s latest posts. Delete them or replace their bodies and remove `sample` before launching the public personal domain. The Writing index notice disappears when no samples remain.

## Content provenance and remaining author edits

Factual content comes from the supplied `CV 15.08.pdf` and the TU Delft GPA statement dated 24 August 2026. The GPA statement gives **9.12/10**, superseding **9.11/10** in the earlier CV. Cum laude is from the CV. The MSc and ETH teaching appointment retain the CV’s **prospective September 2026** status; confirm and update them when appropriate.

Three projects derive from documented work: Google Cloud enablement software, the bachelor’s thesis, and PRIME mathematics animations. Public project titles are editorial labels, not official project names. Source documents do not supply complete implementation details, repository URLs, or measured outcomes; detail pages acknowledge these gaps. The research project date reflects the transcript’s June 2026 completion record, not an inferred start date. No thesis results, automotive project, GitHub account, or publications have been invented. Raw PDFs, student ID, birth date, and phone number are not copied into the public build.

Before public launch: confirm prospective statuses, replace sample writing, add substantive case studies and any approved project links/screenshots, and review wording against your preferred voice. Update `src/lib/profile.ts` for contact and About MDX for biography.

## CV and print

The CV uses `cv.show`, `cv.priority`, and `cv.summary` from the content entries. Employer/university titles link to their full pages. Open `/cv` and choose **Print / Save PDF**. Use A4 or Letter, scale 100%, and disable browser-generated headers/footers in the print dialog. Print CSS removes site navigation, footer, controls and link arrows; keeps text grayscale; and avoids splitting individual entries. Legible pagination is preferred over forcing one page.

PDF generation is not a build dependency. There is no fake download link. Browser Save as PDF is the supported path. The source CV remains unchanged.

## Hero

`AutonomousHero.astro` renders a static trajectory diagram immediately. An IntersectionObserver loads `autonomous-scene.ts` only near the viewport. Three.js builds a vehicle from primitives, with an orthographic camera, trajectory, road, sparse sensor points and restrained motion. Pixel ratio is capped at 1.5. Animation pauses offscreen, in hidden tabs, on user request, or with reduced motion. ResizeObserver handles layout changes. Page exit disposes GPU resources and listeners. WebGL/context failure leaves the static fallback intact. Core content and navigation never depend on JavaScript.

## Styling and metadata

Edit CSS custom properties in `src/styles/tokens.css`. The system font stack avoids external requests. Indexes use the wider editorial measure and prose uses a narrower one. A minimal navigation stays visible on mobile without a menu script. Metadata uses `https://frechowicz.com` as canonical; RSS is `/rss.xml`, and Astro generates the sitemap. Default social artwork is `public/og-default.png`; replace it with another 1200×630 PNG while preserving the URL. SVG favicon and Apple touch icon are included.

## Deployment

The repository builds independently into **`dist/`**.

### Cloudflare Pages (intended public hosting)

Push this repository to GitHub, create a Pages project connected to that repository, and set:

- Build command: `pnpm build`
- Output directory: `dist`
- Node version: 22.12 or newer
- Install: `pnpm install --frozen-lockfile`

No Cloudflare adapter, runtime binding, or server is necessary. Configure `frechowicz.com` as the custom domain in Pages. Domain/DNS changes are not made by this project. The in-app Sites preview is separate; `.openai/hosting.json` points to the private preview’s static output.

For `jakubfrechowicz.com`, configure a Cloudflare redirect rule matching that hostname and redirect with HTTP **301**, preserving the original path and query string. Its DNS must route through Cloudflare for the redirect rule to apply. Do not serve two indexable copies. Validate, for example, that `/cv?ref=test` redirects to `https://frechowicz.com/cv?ref=test`.

### Other static hosts

Upload `dist/` to any static host supporting directory indexes and a custom 404 page. For GitHub Pages at a custom domain, add the matching `CNAME` configuration; a repository-subpath deployment requires updating Astro’s `base` and root-relative links. Do not claim the personal domains are live until their hosting and DNS setup is complete.
