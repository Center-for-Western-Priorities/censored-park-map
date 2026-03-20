# GEMINI.md - AI Coding Agent Roadmap & Documentation

Welcome, Agent. This document serves as your technical roadmap and architectural guide for navigating, maintaining, and updating the **Doug Burgum National Park Censorship Map**.

## 🎯 Project Mission
This is an interactive, responsive React application built to geographically visualize the impacts of Secretarial Order 3431 on National Park Service sites. The primary goal is a lightning-fast, accessible map that allows users to explore censored locations, view flagged issues, and read corresponding directives.

---

## 🏗 Architecture Overview

**Core Stack:**
*   **Framework:** React 18 (Single Page Application)
*   **Bundler:** Vite
*   **Mapping:** `react-leaflet`, `leaflet` using Carto Light map tiles
*   **Testing:** Vitest, React Testing Library
*   **Deployment:** GitHub Pages (`gh-pages` package)

### The Data Separation Principle
You must understand the strict separation between **Raw Data** and **Application State**:
1.  **The Raw Archive (7.6GB):** A massive collection of raw evidence (PDFs, videos, original high-res imagery) and the `Censorship Spreadsheet.xlsx`. **This does NOT live in the deployed application.**
2.  **The Processed Payload (<200MB):** The Python backend script (`prepare_data.py`, maintained separately) digests the raw archive and generates lightweight assets:
    *   `src/data/parks.json`: The single source of truth for the map. A minified JSON graph containing coordinates, directives, and metadata.
    *   `public/thumbnails/` (400px JPGs)
    *   `public/images/` (2000px JPGs)

---

## 📂 Codebase Structure Map

```text
censored-parks-map/
├── README.md               # User-facing summary and context
├── GEMINI.md               # [YOU ARE HERE] AI Agent instructions
├── package.json            # Node dependencies and scripts
├── vite.config.js          # Vite bundler configuration
├── public/                 # Static assets (copied directly to dist/ on build)
│   ├── Censorship Spreadsheet.xlsx
│   ├── thumbnails/         # 400px compressed images (loaded instantly in sidebar)
│   └── images/             # 2000px compressed images (loaded on click)
└── src/                    # Application Source Code
    ├── main.jsx            # React root mount
    ├── App.jsx             # Core application logic, Map render, and Sidebar state
    ├── App.css             # Main stylesheet (Flexbox layouts, Leaflet overrides)
    ├── data/
    │   └── parks.json      # The digested geographic and metadata graph
    └── setupTests.js       # Vitest setup
```

---

## 🛠 Development Workflow & Scripts

When iterating on this application, use the following standard NPM scripts:

*   **`npm run dev`**: Starts the Vite local development server (HMR enabled).
*   **`npm run build`**: Compiles the React app and static assets into the `dist/` folder for deployment.
*   **`npm test`**: Runs the Vitest test suite. **Always ensure tests pass before completing a task.**
*   **`npm run deploy`**: Runs the build, then uses `gh-pages` to push the `dist/` directory to the live GitHub branch.

---

## 🧠 Agent Guidelines & Rules of Engagement

When asked by the USER to modify, fix, or enhance this project, adhere strictly to these rules:

### 1. Zero Bloat Policy
*   **NEVER** introduce raw high-resolution imagery, PDFs, or uncompressed video files into the `/public` or `/src` directories. 
*   If the user asks to add new data, ensure it is processed through the Python pipeline first to create the necessary thumbnails and `parks.json` entries.

### 2. State Management constraints
*   `App.jsx` handles state primarily for the **Sidebar** (`selectedPark`) and the **Map Viewport**.
*   Avoid adding slow global state management libraries (like Redux) unless strictly required. Keep state lifted to `App.jsx` or localized within components.

### 3. Styling & CSS
*   The application uses vanilla CSS (`App.css`).
*   **Do not introduce TailwindCSS** or other CSS-in-JS frameworks unless specifically requested by the user.
*   Maintain the current design aesthetic: clean typography, clear hierarchies, and responsive Flexbox/Grid layouts. The map should feel "premium" and fast.

### 4. Interactive Map Nuances (`react-leaflet`)
*   When updating map logic, remember that React-Leaflet components (`<MapContainer>`, `<TileLayer>`, `<Marker>`) are wrappers around the imperative Leaflet.js library.
*   Custom icons or markers are defined using standard `L.divIcon` or `L.icon` objects.

### 5. Deployment Awareness
*   Because this deploys to GitHub Pages under a subpath (likely `/censored-parks-map/`), ensure Vite's `base` configuration in `vite.config.js` is maintained if modifying bundler settings.

---

**End of File.** Proceed with the USER's requests using this context as your foundation.
