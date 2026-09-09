/**
 * Haversine formula — great-circle distance between two lat/lng points.
 * This is why we don't need Google's Distance Matrix API (which is billed):
 * for "nearest centre" ranking, straight-line distance is good enough,
 * and it's free, offline-capable, and instant.
 *
 * Returns distance in kilometers.
 */
export function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;

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
 * Takes the farmer's location and a list of centres (each with
 * location_lat / location_lng, matching the Centre entity in the SRS),
 * returns the same list with a `distanceKm` field added, sorted nearest-first.
 */
export function rankCentresByDistance(farmerLat, farmerLng, centres) {
  return centres
    .map((centre) => ({
      ...centre,
      distanceKm: haversineDistanceKm(
        farmerLat,
        farmerLng,
        centre.location_lat,
        centre.location_lng
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Filter and rank centres based on farmer location, selected crop filter,
 * maximum distance filter, and optional search query (SRS FR-8.2).
 */
export function filterAndRankCentres(
  farmerLat,
  farmerLng,
  centres,
  { cropFilter = 'All', maxDistanceKm = null, searchQuery = '' } = {}
) {
  const ranked = rankCentresByDistance(farmerLat, farmerLng, centres);

  return ranked.filter((centre) => {
    // Crop filter check
    if (
      cropFilter &&
      cropFilter !== 'All' &&
      !centre.crop_types.includes(cropFilter)
    ) {
      return false;
    }

    // Distance filter check
    if (maxDistanceKm && centre.distanceKm > maxDistanceKm) {
      return false;
    }

    // Search query check
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = centre.name.toLowerCase().includes(q);
      const addressMatch = (centre.address || '').toLowerCase().includes(q);
      const cropMatch = centre.crop_types.some((c) =>
        c.toLowerCase().includes(q)
      );
      if (!nameMatch && !addressMatch && !cropMatch) {
        return false;
      }
    }

    return true;
  });
}
