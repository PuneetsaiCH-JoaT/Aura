# KisanSetu — Centre Locator (FR-8.1 / FR-8.2)

Implements the "find nearest procurement centre" feature from the SRS,
Section 3.8. 100% free — no API keys, no billing account, on either platform.

## What's inside

- `utils/useFarmerLocation.js` — requests permission, fetches GPS coords (expo-location)
- `utils/distance.js` — Haversine formula + sorts centres nearest-first
- `utils/mapHtml.js` — builds a Leaflet + OpenStreetMap page (no Google Maps)
- `services/centres.js` — mock centre data now; swap in your real API later
- `screens/CentreLocatorScreen.js` — the actual screen (map + ranked list + directions)

## Run it

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone (needed for real GPS — simulators
give fake/fixed coordinates).

## Swapping in your real backend

Once your team's `/centres` API is live, only one file changes —
`services/centres.js`:

```js
export async function fetchCentres() {
  const res = await fetch('https://YOUR_BACKEND/api/centres');
  if (!res.ok) throw new Error('Failed to load centres');
  return res.json();
}
```

Keep the response shape matching the `Centre` entity in the SRS
(`id, name, location_lat, location_lng, daily_capacity, crop_types`) and
nothing else in the app needs to change.

## Notes

- Distance shown is straight-line (Haversine), not driving distance — fine
  for "nearest centre" ranking. If you later want actual road distance/ETA,
  that's the one thing that would need a paid API (Google Distance Matrix
  or OSRM self-hosted, which is free but needs your own server) — not
  required for the MVP scope in your SRS.
- "Directions" button opens the phone's native Maps app for turn-by-turn —
  free, no key needed.
- Tested against Expo SDK 51 / React Native 0.74.
