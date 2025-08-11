# Kanban Ticketing System (React + TypeScript + Vite)

A modern, accessible, and responsive Kanban ticketing system built with React, TypeScript, and Vite. It features drag-and-drop ticket management, theming, advanced filtering, mock data loading, CSV export, and local persistence.

## Features

- Drag-and-drop Kanban board (react-dnd) across columns: To Do, In Progress, In Review, Done
- Ticket CRUD with detail and inline editing
- Advanced search and filtering (assignee, priority, status, tags, overdue)
- Clean initial state with on-demand Mock Data loader
- Reset Board with confirmation (clears tickets and filters)
- Data Management modal:
  - Export Tickets (CSV) for Google Sheets/Excel (UTF-8 BOM, proper quoting, ISO dates)
  - Full backup export/import (JSON)
  - Storage usage information
- Persistent local storage for theme, board, and filters
- Theming with light/dark and an easter-egg “Brownie” mode
- Thoughtful typography with less-common, readable fonts
  - Body: Atkinson Hyperlegible
  - Headings: Space Grotesk
  - Monospace: DM Mono
- Accessibility enhancements (a11y checker, focus states, keyboard navigation)
- Mobile/touch support with responsive layouts

## Quick Start

Prerequisites:
- Node.js 18+ and npm 9+

Install and run:

```bash
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

## Scripts

- `npm run dev`: Start Vite dev server with HMR
- `npm run build`: Type-check and build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint

## Project Structure

```
Kanban-Ticketing-System/
├─ src/
│  ├─ components/
│  │  ├─ board/           # Board and columns
│  │  ├─ ticket/          # Ticket card, detail modal, form
│  │  └─ ui/              # Reusable UI (Button, Modal, Select, etc.)
│  ├─ contexts/           # Theme and Ticket providers
│  ├─ data/               # Mock data generation, defaults
│  ├─ styles/             # Global theme variables and animations
│  ├─ themes/             # Theme definitions
│  ├─ types/              # TypeScript models and enums
│  ├─ utils/              # DnD helpers, storage, animations
│  ├─ App.tsx             # App shell
│  └─ main.tsx            # Entry
├─ index.html             # Fonts and root markup
├─ vite.config.ts         # Vite config
├─ tsconfig*.json         # TS configs
└─ README.md
```

## Core Concepts

### Board and Tickets
- Columns are defined in `src/data/index.ts` as `defaultColumns`.
- Tickets are stored in the Ticket context state and persisted to localStorage.
- Drag-and-drop powered by `react-dnd` with multi-backend (mouse + touch) logic.

### Data Model (`src/types/index.ts`)
- `TicketStatus`: `todo`, `in-progress`, `in-review`, `done`
- `Priority`: `low`, `high`, `urgent`
- `Ticket`: id, title, description, status, priority, assignee, timestamps, optional dueDate/completedAt/estimatedHours, and tags.

### Storage (`src/utils/storage.ts`)
- Namespaced localStorage with simple TTL support.
- Convenience functions: `saveBoard/loadBoard`, `saveFilters/loadFilters`, `saveTheme/loadTheme`.
- Backup helpers: `createBackup` (JSON), `restoreBackup`.

### Themes and Fonts
- Themes live in `src/themes/`. The ThemeProvider writes CSS variables to `:root` for colors, spacing, typography, and shadows.
- Fonts imported in `index.html` via Google Fonts.

## Key UI Flows

### Use Mock Data
- The board starts empty. Click “Use Mock Data” in the header to populate tickets for demo/testing.

### Reset Board
- Click “Reset Board” in the header. A styled confirmation modal appears.
- Confirming clears tickets and filters and resets to an empty board.

### Export Tickets to CSV
- Open “Data” (Data Manager) from the header.
- Click “Export Tickets (CSV)” to download a spreadsheet-friendly CSV with:
  - UTF‑8 BOM for Excel compatibility
  - ISO 8601 timestamps
  - Quoted/escaped fields
  - Tags joined with `; `

### Full Backup (JSON)
- From Data Manager, “Export Full Backup (JSON)” downloads the app data.
- “Import Backup (JSON)” restores a previous backup and reloads the app.

## Accessibility
- Keyboard navigation for columns and focus management in modals.
- Visible focus rings and accessible labels.
- A11y checker panel available during development.

## Troubleshooting

- App looks jittery on open/refresh operations
  - We removed global CSS transitions that caused layout jank. If you reintroduce global transitions, scope them only to interactive elements.

- Drag-and-drop not working on mobile
  - We dynamically choose a touch-friendly backend. If issues persist, ensure no browser extensions or embedded webviews are blocking pointer events.

- Fonts not loading
  - Check your network for Google Fonts. The app falls back to system fonts if external fonts fail.

- CSV opens with garbled characters in Excel
  - The CSV includes a UTF‑8 BOM. If your environment still misinterprets encoding, import the file via “Data -> From Text/CSV” and choose UTF‑8.

## Development Notes

- Type safety: strict models in `src/types` and careful event handling for form inputs.
- Performance: Vite + React 19 with tree-shakable components and CSS modules.
- Animations: framer-motion for subtle, non-janky transitions.

## Extending

- Add new columns: update `defaultColumns` in `src/data/index.ts` and ensure `TicketStatus` supports them.
- Add fields to tickets: extend `Ticket` type and update `TicketForm`, `TicketDetailModal`, filters, and CSV export headers/rows.
- Add new themes: create another theme in `src/themes/` and include it in `availableThemes`.

## License

This project is provided for educational and assignment purposes. Adapt and extend as needed for your use case.
