# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```sh
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
```

## Architecture

### Data Layer (no backend)
All content lives in `src/data/` as Markdown files organized by type (`anime/`, `manga/`, `novel/`, `game/`). Each `.md` file uses YAML frontmatter with fields: `title`, `cover`, `tags`, `publishDate`, `url`, `type`, `id`. The body is the author's commentary.

At build time, `import.meta.glob('/src/data/**/*.md', { as: 'raw', eager: true })` in `src/stores/works.js` loads all markdown files as raw strings. `parseFrontmatter()` in `src/composables/useWorks.js` parses frontmatter with a simple regex — no gray-matter dependency needed. The body is rendered with `marked` on detail pages.

### State Management (Pinia)
- **`works.js`** — global works store: loads and indexes all markdown data, provides computed collections (`animeWorks`, `mangaWorks`, etc.), search, and lookup by type+id.
- **`messages.js`** — message board store: mock API with `fetchMessages()` and `postMessage()`. No backend—data lives in memory only.

### Routing (Vue Router)
| Path | Page |
|---|---|
| `/` | Home — categorized grid with tag filtering |
| `/detail/:type/:id` | Detail — full work + markdown-rendered comment |
| `/message` | Message board — form + rich text editor |
| `/about` | About page |
| `/search?q=` | Search results |
| `/admin?psw=123` | Hidden admin panel — CRUD operations via GitHub API |

### Component Tree
```
App.vue
├── NavBar.vue          — fixed top nav, search with live suggestions
└── <router-view>
    ├── HomeView.vue     — hero + 4 category sections
    │   ├── TagFilter.vue
    │   └── WorkCard.vue  (×N)
    ├── DetailView.vue
    ├── MessageView.vue
    │   └── RichEditor.vue
    ├── AboutView.vue
    └── SearchView.vue
```

### Styling
Global design tokens in `src/styles/global.css` via CSS custom properties. Light/pastel theme with lavender background, semi-transparent white cards, and pink/blue/gold accents. Category gradients are defined per type. No CSS framework — all custom.

### Admin Panel
Hidden page at `/admin?psw=123` (`src/views/AdminView.vue`) for CRUD operations. It uses the **GitHub Contents API** to directly commit/delete files in the repository. Requires a GitHub Personal Access Token (`repo` scope) configured in the UI — saved to `localStorage`. Key flows:

- **Add/Edit**: constructs markdown with frontmatter → base64-encodes → PUT to `/repos/{owner}/{repo}/contents/src/data/{type}/{id}.md`
- **Delete**: fetches existing file SHA → DELETE via Contents API
- **Settings**: token, owner, repo, branch persisted in `localStorage`

### Pages CMS
`.pages.yml` at project root configures [Pages CMS](https://app.pagescms.org) for visual content editing. It defines 4 collections (anime/manga/novel/game) and a media config for cover image uploads to `public/covers/`. Connect at `app.pagescms.org` with your GitHub repo.

**Do not use YAML anchors** in `.pages.yml` — Pages CMS parser may not support them.

### Deployment (Cloudflare Pages)
- Build command: `npm run build`
- Build output: `dist/`
- Node.js version: 22+
- No `_redirects` needed — Cloudflare Pages handles SPA routing automatically

### Vite Notes
- Uses Vite 6.x with Rollup (stable). Do not upgrade to Vite 7+ — Rolldown (the new Rust bundler in Vite 7/8) has a known issue with `import.meta.glob({ as: 'raw' })` on `.md` files, causing `PARSE_ERROR: "Cannot assign to this expression"`.
- Path alias `@` maps to `/src`.
