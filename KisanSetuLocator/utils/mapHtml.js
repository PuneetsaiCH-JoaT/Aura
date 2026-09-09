/**
 * Builds a self-contained HTML page with a Leaflet map using OpenStreetMap tiles.
 * 100% Free - No Google API keys, billing, or usage limits required.
 * Satisfies SRS Section 3.8 (FR-8.1 & FR-8.2) & Section 4.3 (Leaflet/Mapbox).
 */
export function buildMapHtml(farmerCoords, rankedCentres) {
  const farmerLat = farmerCoords ? farmerCoords.latitude : 17.385;
  const farmerLng = farmerCoords ? farmerCoords.longitude : 78.4867;

  const pointsJs = [`[${farmerLat}, ${farmerLng}]`].concat(
    rankedCentres.map((c) => `[${c.location_lat}, ${c.location_lng}]`)
  );

  const centreMarkersJs = rankedCentres
    .map((centre, index) => {
      let color = '#2e7d32'; // Green for Low Load
      if (centre.load_level === 'heavy') color = '#c62828'; // Red for Heavy Load
      else if (centre.load_level === 'moderate') color = '#e65100'; // Orange for Moderate Load

      const isNearest = index === 0;
      const borderStyle = isNearest ? '3px solid #ffd700' : '2px solid white';
      const size = isNearest ? 20 : 16;
      const nearestBadge = isNearest ? '<b style="color:#2e7d32;">★ NEAREST CENTRE</b><br/>' : '';

      const popupHtml = `
        <div style="font-family:sans-serif;font-size:13px;line-height:1.4;">
          ${nearestBadge}
          <strong style="font-size:14px;color:#111;">${centre.name}</strong><br/>
          <span style="color:#555;">${centre.address || ''}</span><br/>
          <div style="margin-top:4px;">
            📍 <b>${centre.distanceKm.toFixed(1)} km</b> away<br/>
            📊 Capacity: <b>${centre.booked_count || 0}/${centre.daily_capacity}</b> (${centre.load_status || 'Active'})<br/>
            🌾 Crops: ${centre.crop_types.join(', ')}
          </div>
        </div>
      `;

      return `
        L.marker([${centre.location_lat}, ${centre.location_lng}], {
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
      .leaflet-popup-content-wrapper { border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const map = L.map('map', { zoomControl: true }).setView([${farmerLat}, ${farmerLng}], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // Farmer's own location pin — Blue pulsing marker
      L.marker([${farmerLat}, ${farmerLng}], {
        icon: L.divIcon({
          className: '',
          html: '<div style="background:#1a73e8;width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,0.5)"></div>',
          iconSize: [20, 20],
        })
      }).addTo(map).bindPopup('<div style="font-family:sans-serif;"><b>📍 You Are Here</b></div>');

      ${centreMarkersJs}

      // Auto-fit bounds so farmer and nearby centres are all visible
      const bounds = L.latLngBounds([${pointsJs.join(', ')}]);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [30, 30] });
      }

      // Ensure proper Leaflet rendering in WebView / web iframe
      setTimeout(function() {
        map.invalidateSize();
      }, 300);
    </script>
  </body>
</html>
  `;
}
