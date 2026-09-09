import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';

// Dynamically import WebView on mobile platforms only
let WebView = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    WebView = null;
  }
}

import { useFarmerLocation } from '../utils/useFarmerLocation';
import { fetchCentres } from '../services/centres';
import { filterAndRankCentres } from '../utils/distance';
import { buildMapHtml } from '../utils/mapHtml';

const CROPS = ['All', 'Paddy', 'Cotton', 'Maize', 'Groundnut', 'Redgram'];
const DISTANCE_OPTIONS = [
  { label: 'All Distances', value: null },
  { label: '< 15 km', value: 15 },
  { label: '< 30 km', value: 30 },
  { label: '< 50 km', value: 50 },
];

export default function CentreLocatorScreen() {
  const { coords, loading: locLoading, error: locError, isFallback, retry } =
    useFarmerLocation();

  const [centres, setCentres] = useState([]);
  const [centresLoading, setCentresLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState('All');
  const [maxDistance, setMaxDistance] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCentres()
      .then(setCentres)
      .finally(() => setCentresLoading(false));
  }, []);

  const loading = locLoading || centresLoading;

  const filteredCentres =
    coords && centres.length > 0
      ? filterAndRankCentres(coords.latitude, coords.longitude, centres, {
          cropFilter,
          maxDistanceKm: maxDistance,
          searchQuery,
        })
      : [];

  function openDirections(centre) {
    // Universal maps URL that works on Android, iOS, and Web browsers
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${centre.location_lat},${centre.location_lng}`;
    Linking.openURL(mapsUrl).catch(() => {
      alert('Could not open map navigation application.');
    });
  }

  function getLoadBadgeStyle(loadLevel) {
    switch (loadLevel) {
      case 'heavy':
        return { bg: '#ffebee', text: '#c62828', border: '#ef9a9a' };
      case 'moderate':
        return { bg: '#fff3e0', text: '#e65100', border: '#ffe0b2' };
      default:
        return { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' };
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loadingText}>Locating nearest procurement centres…</Text>
      </View>
    );
  }

  const mapHtml = buildMapHtml(coords, filteredCentres);

  return (
    <View style={styles.container}>
      {/* Top Header & Search / Filter Controls (FR-8.2) */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>🌾 KisanSetu Procurement Centre Locator</Text>
        {isFallback && locError && (
          <View style={styles.fallbackBanner}>
            <Text style={styles.fallbackText}>⚠️ {locError}</Text>
            <TouchableOpacity style={styles.smallRetryButton} onPress={retry}>
              <Text style={styles.smallRetryText}>Try GPS</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Search Bar */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by centre name, district or crop..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />

        {/* Crop Filter Chips */}
        <View style={styles.filterRowContainer}>
          <Text style={styles.filterLabel}>Crop:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CROPS.map((crop) => {
              const isActive = cropFilter === crop;
              return (
                <TouchableOpacity
                  key={crop}
                  style={[styles.chip, isActive && styles.activeChip]}
                  onPress={() => setCropFilter(crop)}
                >
                  <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                    {crop}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Distance Filter Chips */}
        <View style={styles.filterRowContainer}>
          <Text style={styles.filterLabel}>Distance:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DISTANCE_OPTIONS.map((opt) => {
              const isActive = maxDistance === opt.value;
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={[styles.chip, isActive && styles.activeChip]}
                  onPress={() => setMaxDistance(opt.value)}
                >
                  <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Cross-Platform Map View */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={mapHtml}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Procurement Centres Map"
          />
        ) : WebView ? (
          <WebView
            style={styles.map}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            scalesPageToFit={true}
            source={{ html: mapHtml }}
          />
        ) : (
          <View style={styles.centered}>
            <Text>Map preview unavailable on this platform</Text>
          </View>
        )}
      </View>

      {/* Ranked Centres List */}
      <FlatList
        style={styles.list}
        data={filteredCentres}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View style={styles.listHeaderRow}>
            <Text style={styles.listHeaderTitle}>
              Centres ({filteredCentres.length})
            </Text>
            <Text style={styles.listHeaderSubtitle}>
              Sorted nearest to your location
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No procurement centres match your filter criteria.
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const badgeStyle = getLoadBadgeStyle(item.load_level);
          const isNearest = index === 0 && cropFilter === 'All' && !maxDistance && !searchQuery;

          return (
            <TouchableOpacity
              style={[styles.centreCard, isNearest && styles.nearestCard]}
              onPress={() => openDirections(item)}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.centreName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  {isNearest && <Text style={styles.nearestBadge}>★ NEAREST</Text>}
                </View>

                {item.address ? (
                  <Text style={styles.addressText}>{item.address}</Text>
                ) : null}

                <Text style={styles.centreMeta}>
                  📍 <Text style={styles.boldText}>{item.distanceKm.toFixed(1)} km</Text> away
                  {'  '}·{'  '}🌾 {item.crop_types.join(', ')}
                </Text>

                {/* FR-8.1 Load Indicator Badge */}
                <View style={styles.loadRow}>
                  <View
                    style={[
                      styles.loadBadge,
                      {
                        backgroundColor: badgeStyle.bg,
                        borderColor: badgeStyle.border,
                      },
                    ]}
                  >
                    <Text style={[styles.loadBadgeText, { color: badgeStyle.text }]}>
                      ● {item.load_status || 'Active'} ({item.booked_count || 0}/{item.daily_capacity} slots)
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.directionsButton}
                onPress={() => openDirections(item)}
              >
                <Text style={styles.directionsButtonText}>Navigate 🗺️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fbf9' },
  headerContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b5e20',
    marginBottom: 6,
  },
  fallbackBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff3e0',
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  fallbackText: { fontSize: 11, color: '#e65100', flex: 1 },
  smallRetryButton: {
    backgroundColor: '#e65100',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  smallRetryText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  searchInput: {
    height: 38,
    backgroundColor: '#f1f3f1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    marginBottom: 8,
    color: '#222',
  },
  filterRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginRight: 6,
    width: 60,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: '#f0f4f0',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#d0ddd0',
  },
  activeChip: {
    backgroundColor: '#2e7d32',
    borderColor: '#1b5e20',
  },
  chipText: { fontSize: 12, color: '#333' },
  activeChipText: { color: '#ffffff', fontWeight: '600' },
  mapContainer: {
    height: 240,
    width: '100%',
    backgroundColor: '#e5e3df',
  },
  map: { flex: 1 },
  list: { flex: 1, backgroundColor: '#f9fbf9' },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  listHeaderTitle: { fontSize: 15, fontWeight: '700', color: '#111' },
  listHeaderSubtitle: { fontSize: 11, color: '#666' },
  emptyContainer: { padding: 30, alignItems: 'center' },
  emptyText: { color: '#777', fontSize: 13, textAlign: 'center' },
  centreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e6e0',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
  },
  nearestCard: {
    backgroundColor: '#f1f8f1',
    borderColor: '#2e7d32',
    borderWidth: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centreName: { fontSize: 14, fontWeight: '700', color: '#111', flex: 1 },
  nearestBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2e7d32',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  addressText: { fontSize: 11, color: '#666', marginTop: 1 },
  centreMeta: { fontSize: 12, color: '#444', marginTop: 4 },
  boldText: { fontWeight: '700', color: '#1b5e20' },
  loadRow: { marginTop: 6 },
  loadBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
  },
  loadBadgeText: { fontSize: 10, fontWeight: '700' },
  directionsButton: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#d2e3fc',
  },
  directionsButtonText: { color: '#1a73e8', fontSize: 12, fontWeight: '600' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 10, color: '#555', fontSize: 13 },
});
