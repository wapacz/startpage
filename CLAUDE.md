# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm start` — dev server on http://localhost:3000
- `npm run build` — production build to `build/`
- `npm test` — Jest tests in watch mode (React Testing Library)

## Tech Stack

- **React 18** (Create React App / react-scripts 5.0.1)
- **Tailwind CSS 3** — utility-first styling, dark mode via `class` strategy
- **react-icons** — icon library (tree-shakeable, import from `react-icons/hi`)
- **Firebase 9** — Google OAuth (signInWithPopup) + Firestore (full CRUD)
- **React Router 6** — client-side routing

## Architecture

**Personal dashboard/startpage** with location-aware content filtering, search, and full link management.

### Auth Flow
`App.js` acts as an auth gate via `firebaseService.useState()`. Unauthenticated users see `LoginPage`; authenticated users get `LinksProvider` wrapping the app. Auth state is persisted to localStorage.

### FirebaseService (`src/FirebaseService.js`)
Singleton service object that wraps all Firebase operations: signIn/signOut, getDocs, addLink, updateLink, deleteLink. Exports a custom `useState` hook that ties React state to auth status.

### State Management
- `src/context/LinksContext.js` — React context providing centralized link state + CRUD operations via `useLinks()` hook. Optimistic local updates after Firestore writes.
- `src/context/FoldersContext.js` — React context for folders CRUD via `useFolders()` hook. Exports `buildTree(folders, links)` to construct nested tree from flat Firestore data.
- `src/hooks/useLocationContext.js` — IP-based auto-detection (ipapi.co, checks org for "ericsson" = work) + manual toggle. Cached in sessionStorage (IP data) and localStorage (user preference).
- `src/hooks/useSearch.js` — Client-side filtering via `useMemo`. Matches query against name, description, url, tags, keywords (case-insensitive).

### Data Pipeline
`allLinks → location filter → search filter → displayed cards`

### Pages
- `src/pages/Home.js` — homepage with pinned icon tiles grid + footer
- `src/pages/Links.js` — full-width card grid with search, location filter, CRUD modals
- `src/pages/Manager.js` — bookmarks manager with folder tree view, create/rename/delete folders, move links between folders

### Component Structure
- `src/App.js` — root: auth gate, LinksProvider + FoldersProvider, router
- `src/components/AppBar.js` — fixed top nav with Home/Links/Manager navigation, search, location toggle, add button, logout
- `src/components/PinnedTile.js` — large icon tile for pinned links (supports heroicon or favicon via `iconType`)
- `src/components/IconPicker.js` — icon selection grid (36 Heroicons), exports `getIconComponent()` and `AVAILABLE_ICONS`
- `src/components/LinkCard.js` — card with favicon, tags, context badge, hover action menu (edit/delete)
- `src/components/LinkFormModal.js` — add/edit form with pinned toggle + icon/favicon picker
- `src/components/FolderNode.js` — recursive tree node: expand/collapse, context menu (add link, subfolder, rename, delete)
- `src/components/TreeLinkItem.js` — link item in tree view with favicon and context menu (edit, move, delete)
- `src/components/FolderFormModal.js` — create/rename folder modal
- `src/components/MoveToFolderModal.js` — move link to folder picker with nested folder tree
- `src/components/DeleteConfirmModal.js` — delete confirmation dialog
- `src/components/Footer.js` — link count + "View all links" navigation
- `src/components/LoginPage.js`, `LoadingSpinner.js`, `EmptyState.js` — utility UI

### Data Model

**Firestore "links" collection:**
```
{ id, name, url, description?, tags?: string[], keywords?: string[], newTab?: boolean,
  context: "work"|"home"|"both", pinned?: boolean, icon?: string, iconType?: "heroicon"|"favicon",
  folderId?: string }
```

**Firestore "folders" collection:**
```
{ id, name, parentId?: string }
```

- `context` defaults to `"both"`, `iconType` defaults to `"heroicon"` for existing docs
- `pinned` links appear as icon tiles on the homepage
- `folderId` associates a link with a folder (null = root/uncategorized)
- `parentId` on folders enables nesting (null = root folder)
- Tree built client-side via `buildTree()` in FoldersContext

### Routing
- `/startpage` — homepage with pinned tiles
- `/startpage/links` — full link card grid with search
- `/startpage/manager` — bookmarks manager with folder tree
- All other routes redirect to `/startpage`
- Base path set during CI deploy (injected `homepage` in package.json)

### Styling
- Tailwind CSS with `darkMode: 'class'` (always-dark, `<html class="dark">`)
- Inter font via Google Fonts
- No CSS files — all styling via Tailwind utility classes inline

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` (Node 20):
1. Injects `"homepage": "/startpage"` into package.json
2. Builds with `npm ci && npm run build`
3. Copies `index.html` to `404.html` for SPA routing
4. Deploys `build/` to gh-pages branch

## Conventions

- All source files have a copyright header block
- Functional components with hooks (no class components)
- Firebase config lives in `src/config.js`
- Components in `src/components/`, hooks in `src/hooks/`, context in `src/context/`
