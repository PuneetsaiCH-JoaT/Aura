import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

// Default pilot region coordinates (Hyderabad / Ranga Reddy, Telangana)
const DEFAULT_COORDS = {
  latitude: 17.385,
  longitude: 78.4867,
};

/**
 * Handles the full location-fetching flow with multi-tier fallbacks:
 *  1. Asks for foreground location permission.
 *  2. Tries to fetch live position with high accuracy.
 *  3. Falls back to last known position or low accuracy if live GPS times out.
 *  4. Seamlessly falls back to default pilot region coordinates if GPS is unavailable
 *     so the app/demo never crashes or gets stuck on error screens.
 *  5. Provides setManualLocation to test custom location points.
 */
export function useFarmerLocation() {
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  async function requestLocation() {
    setLoading(true);
    setError(null);
    setIsFallback(false);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setCoords(DEFAULT_COORDS);
        setIsFallback(true);
        setError('Location permission denied. Showing default pilot region centres.');
        setLoading(false);
        return;
      }

      // Try live location first
      let position = null;
      try {
        position = await Promise.race([
          Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('GPS timeout')), 5000)
          ),
        ]);
      } catch (err) {
        // Fallback to last known position if live position timed out
        position = await Location.getLastKnownPositionAsync();
      }

      if (position && position.coords) {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsFallback(false);
      } else {
        setCoords(DEFAULT_COORDS);
        setIsFallback(true);
        setError('Could not establish GPS fix. Showing default pilot region.');
      }
    } catch (e) {
      setCoords(DEFAULT_COORDS);
      setIsFallback(true);
      setError('GPS unavailable. Showing default pilot region.');
    } finally {
      setLoading(false);
    }
  }

  function setManualLocation(newCoords) {
    setCoords(newCoords);
    setIsFallback(true);
    setError(null);
  }

  useEffect(() => {
    requestLocation();
  }, []);

  return {
    coords,
    loading,
    error,
    isFallback,
    retry: requestLocation,
    setManualLocation,
  };
}
