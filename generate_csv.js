import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, 'src/data/parks.json');
const csvPath = path.resolve(__dirname, 'public/parks_expanded.csv');

function generateCsv() {
  if (!fs.existsSync(jsonPath)) {
    console.error(`Could not find ${jsonPath}`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '';
    const s = String(str);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };

  let csvContent = 'Park Abbreviation,Park Name,Latitude,Longitude,ID,Status,Issue,Action,Thumbnail,Large Image,Film Produced,Publications Produced,Description Changes\n';

  for (const park of data) {
    if (park.items && park.items.length > 0) {
      for (const item of park.items) {
        csvContent += [
          escapeCsv(park.code),
          escapeCsv(park.name),
          escapeCsv(park.lat),
          escapeCsv(park.lon),
          escapeCsv(item.id),
          escapeCsv(item.status),
          escapeCsv(item.issue),
          escapeCsv(item.action),
          escapeCsv(item.thumbnail),
          escapeCsv(item.largeImage),
          escapeCsv(item.filmProduced),
          escapeCsv(item.publicationsProduced),
          escapeCsv(item.descriptionChanges)
        ].join(',') + '\n';
      }
    } else {
      csvContent += [
        escapeCsv(park.code),
        escapeCsv(park.name),
        escapeCsv(park.lat),
        escapeCsv(park.lon),
        "","","","","","","","",""
      ].join(',') + '\n';
    }
  }

  fs.writeFileSync(csvPath, csvContent);
  console.log('Regenerated public/parks_expanded.csv');
}

generateCsv();
