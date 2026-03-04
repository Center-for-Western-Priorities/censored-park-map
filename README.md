# Doug Burgum's National Park Censorship Map

An interactive, responsive React application visualizing the sweeping impact of Department of the Interior Secretary Doug Burgum’s [Secretarial Order 3431](https://www.whitehouse.gov/secretarial-orders/secretarial-order-3431/) (SO 3431) on National Park Service public exhibits, media, and visitor experiences.

## Project Overview
This tool allows journalists, researchers, and the public to geographically explore areas targeted for censorship under the "Grandeur, Beauty, and Abundance" mandate. It plots confirmed targeted parks, monuments, and historic sites on a nationwide map. Visitors can interact with individual sites to expose the exact issues flagged by the department, the demanded corrective actions, and accompanying photographic evidence.

## The Underlying Data
The application is powered by a "Censorship Spreadsheet" containing the operational metadata tracking the internal NPS review process (Tracking IDs, Park Codes, Flagged Issues, and Directives). 

Accompanying the spreadsheet is a sprawling [7.6GB raw archive](https://archive.org/details/nps-removal-targets) composed of thousands of PDFs, videos, and raw smartphone photography submitted by park staff documenting exhibits scheduled for removal or alteration (such as references to climate change, the Civil War, enslavement, or Native American perspectives).

The leaked database was first [reported by The Washington Post](https://www.washingtonpost.com/climate-environment/2026/03/02/national-parks-signs-censorship-slavery/) on March 2, 2026.

## How it was Built

The project was coded in [Google Antigravity](https://antigravity.google) by Gemini Pro 3.1 (High). [Aaron Weiss](https://github.com/aaronwe) oversaw the project.

### 1. The Python Data Pipeline
The backend of this project is a python extraction script (`prepare_data.py`) decoupled from the web application. 
- **Geocoding Engine:** The script dynamically cross-references NPS standard 4-letter acronyms (e.g. `COLO`) against standard park names, utilizing the **Nominatim** indexing API to resolve exact longitude/latitude geographic coordinates.
- **Asset Interception & Compression:** The raw 7.6 GB evidence database is simply too massive for a web application. The script utilizes the **Pillow** Python library to intercept the massive high-resolution imagery and dynamically scales twin compressed `.jpg` models:
    - **Thumbnails (`400px`):** Ultra-lightweight images loaded immediately into the map's sidebar popup.
    - **Originals (`2000px`):** High-resolution detail images strictly loaded when a user clicks the sidebar thumbnail for further inspection. 
- **PDF Exclusion:** The script actively strips out monolithic PDFs and Video files.
- **JSON Compilation:** The tool binds the generated geographic coordinates, spreadsheet directives, and the optimized image paths into a standalone, minified JSON graph (`parks.json`). The web-app size successfully dropped from 7.6 GB to under 200 MB.

### 2. The Frontend Architecture
The actual visual client is a lightning-fast Single Page Application (SPA) driven by **Vite** and **React**.
- **Interactive Mapping:** Powered by `react-leaflet` and Carto Light Map Tiles, presenting an elegant and responsive geographic interface.
- **Dynamic Render:** The map natively consumes the generated JSON graph, plotting precise `.custom-alert-marker` nodes that, when clicked, dynamically render a rich informational Sidebar.
- **Robust Testing:** The interface is guarded by `Vitest` and the `React Testing Library`, actively mounting mock DOMs simulating user interaction to guarantee components won't break during future updates.

## Deployment (GitHub Pages)
The project is strictly optimized for free tier hosting on **GitHub Pages**. 

The configuration naturally divorces the 7.6GB raw data archive from the web application. When pushed to GitHub, the repository will only hold the source code and the compressed image assets.

**To Deploy:**
1. Connect this repository to your tracking GitHub account.
2. Run `npm run deploy`.
3. The Vite bundler will execute `npm run build`, packaging the entire site into a minified `dist/` envelope.
4. The `gh-pages` NPM module will automatically isolate the `dist/` payload and push it directly to your repository's live publishing branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
