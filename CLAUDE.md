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

### Adding New Content
Create a new `.md` file in the appropriate `src/data/<type>/` directory with the required frontmatter fields. The store auto-discovers it via `import.meta.glob` — no registration needed.
