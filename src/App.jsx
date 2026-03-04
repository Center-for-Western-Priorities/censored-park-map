import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Info, X, ExternalLink, MapPin } from 'lucide-react';
import parksData from './data/parks.json';
import './App.css';

// Fix for default leaflet icons in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom alert marker
const alertIcon = L.divIcon({
  className: 'custom-alert-marker',
  html: `<div class="marker-pulse"><div class="marker-core"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

function MapUpdater({ selectedPark }) {
  const map = useMap();
  useEffect(() => {
    if (selectedPark && selectedPark.lat && selectedPark.lon) {
      map.flyTo([selectedPark.lat, selectedPark.lon], 7, {
        duration: 2
      });
    }
  }, [selectedPark, map]);
  return null;
}

function App() {
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [showAbout, setShowAbout] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setParks(parksData);
    setLoading(false);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <MapPin color="#ff4757" size={28} />
          <h1>Doug Burgum's Censorship Map</h1>
        </div>
        <button className="about-btn" onClick={() => setShowAbout(true)}>
          <Info size={18} />
          <span>About</span>
        </button>
      </header>

      <main className="main-content">
        <div className={`map-wrapper ${selectedPark ? 'sidebar-open' : ''}`}>
          {loading ? (
            <div className="loading-state">Loading satellite data...</div>
          ) : (
            <MapContainer center={[39.8283, -98.5795]} zoom={4} className="leaflet-map" zoomControl={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              <MapUpdater selectedPark={selectedPark} />
              {parks.map((park) => (
                <Marker
                  key={park.code}
                  position={[park.lat, park.lon]}
                  icon={alertIcon}
                  eventHandlers={{
                    click: () => {
                      setSelectedPark(park);
                    },
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <strong>{park.name || park.code}</strong>
                  </Tooltip>
                  <Popup className="custom-popup">
                    <strong>{park.name || park.code}</strong>
                    <div>{park.items.length} targeted item(s)</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {selectedPark && (
          <aside className="sidebar slide-in">
            <div className="sidebar-header">
              <div>
                <h2>{selectedPark.name || selectedPark.code}</h2>
                <p className="park-code-subtitle">{selectedPark.code}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedPark(null)}>
                <X size={24} />
              </button>
            </div>
            <div className="sidebar-content">
              <p className="items-count"><strong>{selectedPark.items.length}</strong> items targeted for removal</p>

              <div className="items-list">
                {selectedPark.items.map((item, idx) => (
                  <div key={item.id} className="target-card">
                    <div className="target-header">
                      <span className="target-badge">ID: {item.id}</span>
                      <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="target-field">
                      <h4>Issue</h4>
                      <p>{item.issue}</p>
                    </div>

                    <div className="target-field">
                      <h4>Action Required</h4>
                      <p>{item.action}</p>
                    </div>

                    {item.filmProduced && item.filmProduced.toLowerCase() !== 'none' && (
                      <div className="target-field">
                        <h4>Film Produced</h4>
                        <p>{item.filmProduced}</p>
                      </div>
                    )}

                    {item.publicationsProduced && item.publicationsProduced.toLowerCase() !== 'none' && (
                      <div className="target-field">
                        <h4>Publications Produced</h4>
                        <p>{item.publicationsProduced}</p>
                      </div>
                    )}

                    {item.descriptionChanges && item.descriptionChanges.toLowerCase() !== 'none' && (
                      <div className="target-field">
                        <h4>Description Changes</h4>
                        <p>{item.descriptionChanges}</p>
                      </div>
                    )}

                    {item.thumbnail && (
                      <div className="thumbnail-container">
                        <p className="thumbnail-label">Evidence Media</p>
                        <a href={item.largeImage || item.thumbnail} target="_blank" rel="noopener noreferrer" className="thumbnail-link">
                          <img src={item.thumbnail} alt={`Censored media ${item.id}`} />
                          <div className="thumbnail-overlay">
                            <ExternalLink size={24} color="white" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </main>

      {showAbout && (
        <div className="modal-overlay" onClick={() => setShowAbout(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>About This Project</h2>
              <button className="close-btn" onClick={() => setShowAbout(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                In a sweeping effort to alter the narrative of American history and science, President Donald Trump's Executive Order 14253, "Restoring Truth and Sanity to American History," and Interior Secretary Doug Burgum's subsequent Secretarial Order 3431 have mandated the censorship of exhibits, signs, and publications across National Parks.
              </p>
              <p>
                This administration-wide directive explicitly targets educational materials detailing the lived realities of slavery, the contributions of marginalized communities, and the scientific realities of climate change, branding them as "disparaging" to Americans.
              </p>
              <p>
                This map documents the ongoing removal of these historical and scientific truths from our public lands, providing a permanent archive of the information they are trying to erase.
              </p>
              <div className="modal-footer">
                <a href="https://www.washingtonpost.com/climate-environment/2026/03/02/national-parks-signs-censorship-slavery/" target="_blank" rel="noopener noreferrer" className="primary-btn">
                  Read the Washington Post Investigation <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
