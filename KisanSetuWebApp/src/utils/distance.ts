import type { Centre } from '../types';

/**
 * Haversine formula — great-circle distance between two lat/lng points in kilometers.
 * Offline-capable, zero API cost, instant distance computation.
 * Inspired by Aura navigation specification (KisanSetuLocator).
 */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371; // Earth radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Rank centres by Haversine distance from farmer coordinates,
 * updating `distanceKm` dynamically and sorting nearest-first.
 */
export function rankCentresByDistance(
  farmerLat: number,
  farmerLng: number,
  centres: Centre[]
): Centre[] {
  return centres
    .map((centre) => {
      const dist = haversineDistanceKm(farmerLat, farmerLng, centre.lat, centre.lng);
      return {
        ...centre,
        distanceKm: Math.round(dist * 10) / 10,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Filter and rank centres based on farmer location, crop type filter,
 * max distance filter, and search query. (SRS FR-8.1 / FR-8.2)
 */
export function filterAndRankCentres(
  farmerLat: number,
  farmerLng: number,
  centres: Centre[],
  filters: {
    cropFilter?: string;
    maxDistanceKm?: number | null;
    searchQuery?: string;
  } = {}
): Centre[] {
  const ranked = rankCentresByDistance(farmerLat, farmerLng, centres);

  return ranked.filter((centre) => {
    // Crop filter
    if (
      filters.cropFilter &&
      filters.cropFilter !== 'All' &&
      centre.cropTypes &&
      !centre.cropTypes.includes(filters.cropFilter)
    ) {
      return false;
    }

    // Distance filter
    if (filters.maxDistanceKm && centre.distanceKm > filters.maxDistanceKm) {
      return false;
    }

    // Search query
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const q = filters.searchQuery.toLowerCase().trim();
      const nameMatch = centre.name.toLowerCase().includes(q);
      const addressMatch = (centre.address || '').toLowerCase().includes(q);
      const cropMatch = centre.cropTypes?.some((c) => c.toLowerCase().includes(q));
      if (!nameMatch && !addressMatch && !cropMatch) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Generates an interactive OpenStreetMap / Leaflet HTML page string for web iframe display.
 * Includes color-coded load markers, farmer blue pulse location, popups, and direct Google Maps navigation link.
 * Built strictly according to Aura mapHtml.js specification.
 */
export function buildLeafletMapHtml(
  farmerCoords: { lat: number; lng: number },
  rankedCentres: Centre[]
): string {
  const farmerLat = farmerCoords.lat;
  const farmerLng = farmerCoords.lng;

  const pointsJs = [`[${farmerLat}, ${farmerLng}]`].concat(
    rankedCentres.map((c) => `[${c.lat}, ${c.lng}]`)
  );

  const centreMarkersJs = rankedCentres
    .map((centre, index) => {
      let color = '#22863A'; // Green for Open / Low Load
      if (centre.status === 'HIGH_LOAD') color = '#E65100'; // Orange for High Load
      else if (centre.status === 'BUSY' || centre.status === 'CLOSED') color = '#C62828'; // Red

      const isNearest = index === 0;
      const borderStyle = isNearest ? '3px solid #FFD700' : '2px solid white';
      const size = isNearest ? 22 : 16;
      const nearestBadge = isNearest ? '<b style="color:#22863A;font-size:12px;">★ NEAREST PROCUREMENT CENTRE</b><br/>' : '';

      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${centre.lat},${centre.lng}`;

      const popupHtml = `
        <div style="font-family:sans-serif;font-size:13px;line-height:1.4;padding:2px;">
          ${nearestBadge}
          <strong style="font-size:14px;color:#111;">${centre.name}</strong><br/>
          <span style="color:#666;font-size:12px;">${centre.address || ''}</span><br/>
          <div style="margin-top:6px;font-size:12px;color:#333;">
            📍 <b>${centre.distanceKm.toFixed(1)} km</b> away<br/>
            ⏱️ Est. Wait: <b>${centre.estimatedWaitMin[0]}–${centre.estimatedWaitMin[1]} min</b><br/>
            🌾 Crops: <b>${centre.cropTypes ? centre.cropTypes.join(', ') : 'Paddy, Wheat, Maize'}</b>
          </div>
          <div style="margin-top:8px;">
            <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:#22863A;color:white;text-decoration:none;padding:5px 10px;border-radius:6px;font-weight:bold;font-size:11px;">
              🧭 Get Directions
            </a>
          </div>
        </div>
      `;

      return `
        L.marker([${centre.lat}, ${centre.lng}], {
          icon: L.divIcon({
            className: '',
            html: '<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:${borderStyle};box-shadow:0 0 6px rgba(0,0,0,0.4)"></div>',
            iconSize: [${size}, ${size}],
          })
        }).addTo(map).bindPopup(${JSON.stringify(popupHtml)});
      `;
    })
    .join('\n');

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; background: #e5e3df; }
      .leaflet-popup-content-wrapper { border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map', { zoomControl: true }).setView([${farmerLat}, ${farmerLng}], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Farmer's location pin - Blue pulsing dot
      L.marker([${farmerLat}, ${farmerLng}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="background:#1a73e8;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 8px rgba(26,115,232,0.6)"></div>',
          iconSize: [20, 20],
        })
      }).addTo(map).bindPopup('<div style="font-family:sans-serif;"><b>📍 Farmer Location</b></div>');

      ${centreMarkersJs}

      const bounds = L.latLngBounds([${pointsJs.join(', ')}]);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [35, 35] });
      }

      setTimeout(function() {
        map.invalidateSize();
      }, 300);
    </script>
  </body>
</html>
  `;
}
