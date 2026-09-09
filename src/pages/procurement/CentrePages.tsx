import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/appStore';
import { Button, Card, StatusBadge, PageHeader, ProgressBar } from '../../components/shared';
import { MOCK_CENTRES, CROP_LIST } from '../../data/mockData';
import { filterAndRankCentres, buildLeafletMapHtml } from '../../utils/distance';
import type { Centre } from '../../types';
import { clsx } from 'clsx';

// Preset locations for quick testing
const PRESET_LOCATIONS = [
  { name: 'Warangal / Hanamkonda', lat: 17.9689, lng: 79.5941 },
  { name: 'Ranga Reddy / LB Nagar', lat: 17.3850, lng: 78.4867 },
  { name: 'Medchal Mandi', lat: 17.6294, lng: 78.4813 },
  { name: 'Hyderabad Central', lat: 17.3850, lng: 78.4867 },
];

// ============================================================
// LOCATION ACCESS PAGE
// ============================================================
export const LocationAccessPage: React.FC = () => {
  const { setLocationGranted, setUserCoords } = useAppStore();
  const [showManual, setShowManual] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const handleAllowGPS = () => {
    setLoading(true);
    setGpsError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoords({ lat: latitude, lng: longitude }, 'Current GPS Location');
          setLoading(false);
          setLocationGranted(true, 'Current GPS Location', { lat: latitude, lng: longitude });
        },
        (err) => {
          console.warn('GPS Error, using Warangal pilot default:', err.message);
          setGpsError('GPS fix unavailable. Loaded default pilot region (Warangal, Telangana).');
          setUserCoords({ lat: 17.9689, lng: 79.5941 }, 'Warangal, Telangana (Pilot)');
          setLoading(false);
          setLocationGranted(true, 'Warangal, Telangana (Pilot)', { lat: 17.9689, lng: 79.5941 });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      setUserCoords({ lat: 17.9689, lng: 79.5941 }, 'Warangal, Telangana (Pilot)');
      setLoading(false);
      setLocationGranted(true, 'Warangal, Telangana (Pilot)', { lat: 17.9689, lng: 79.5941 });
    }
  };

  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setUserCoords({ lat: preset.lat, lng: preset.lng }, preset.name);
    setLocationGranted(true, preset.name, { lat: preset.lat, lng: preset.lng });
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div className="w-32 h-32 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6 relative">
          <svg className="w-16 h-16 text-[#22863A]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          <div className="absolute -bottom-1 w-6 h-3 bg-[#E8F5E9] rounded-full" />
          <div className="absolute bottom-0 w-4 h-2 bg-gray-200 rounded-full" />
        </div>

        <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">Allow Location Access</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          We calculate live Haversine distances to rank the nearest government procurement centres for your crops.
        </p>

        {gpsError && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-xl">
            {gpsError}
          </div>
        )}

        <div className="w-full flex flex-col gap-3">
          <Button onClick={handleAllowGPS} loading={loading} size="lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            Use Live Location (GPS)
          </Button>

          <Button variant="outline" onClick={() => setShowManual(!showManual)}>
            Select Pilot Region Manually
          </Button>

          {showManual && (
            <div className="flex flex-col gap-2 mt-1">
              <p className="text-xs text-gray-500 text-left font-medium">Select Pilot Location:</p>
              {PRESET_LOCATIONS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className="bg-gray-50 hover:bg-[#E8F5E9] hover:border-[#22863A] border border-gray-200 text-left p-3 rounded-xl text-xs font-semibold text-gray-800 transition-colors"
                >
                  📍 {preset.name}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => handleSelectPreset(PRESET_LOCATIONS[0])}
            className="text-sm text-gray-400 py-2 hover:text-gray-600"
          >
            Not Now (Use Default Warangal)
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// NEARBY CENTRES PAGE
// ============================================================
export const NearbycentresPage: React.FC = () => {
  const {
    farmer,
    selectCentre,
    navigate,
    userLocation,
    userCoords,
    cropFilter,
    maxDistanceKm,
    searchQuery,
    setCropFilter,
    setMaxDistanceKm,
    setSearchQuery,
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Dynamically filter and rank centres using Haversine distance algorithm
  const rankedCentres = filterAndRankCentres(
    userCoords.lat,
    userCoords.lng,
    MOCK_CENTRES,
    {
      cropFilter,
      maxDistanceKm,
      searchQuery,
    }
  );

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      {/* Header */}
      <div className="bg-[#22863A] px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-green-200 text-xs">Good morning 👋</p>
            <h1 className="text-white text-xl font-bold">{farmer?.name?.split(' ')[0] || 'Farmer'}</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-xl">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            </svg>
            <span className="text-white text-xs font-medium truncate max-w-[140px]">{userLocation}</span>
          </div>
        </div>
        <p className="text-green-200 text-xs mt-1">
          Nearest Procurement Centres · Ranked by Haversine Distance
        </p>
      </div>

      {/* Search + View Toggle */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            placeholder="Search centre, crop or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm flex-1 outline-none text-gray-700 placeholder:text-gray-400"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-xs text-gray-400">✕</button>
          )}
        </div>
        <button
          onClick={() => setViewMode(v => v === 'list' ? 'map' : 'list')}
          className="w-10 h-10 bg-[#E8F5E9] rounded-xl flex items-center justify-center flex-shrink-0"
          title={viewMode === 'list' ? 'View Map' : 'View List'}
        >
          {viewMode === 'list' ? (
            <svg className="w-5 h-5 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#22863A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
            </svg>
          )}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="px-4 py-2 bg-white border-b border-gray-100 flex items-center gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-1 flex-shrink-0 font-medium text-gray-500">
          🌾 Crop:
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-800 outline-none"
          >
            <option value="All">All Crops</option>
            {CROP_LIST.slice(0, 6).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 font-medium text-gray-500 ml-2">
          📏 Max Dist:
          <select
            value={maxDistanceKm ?? 'All'}
            onChange={(e) => setMaxDistanceKm(e.target.value === 'All' ? null : Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-semibold text-gray-800 outline-none"
          >
            <option value="All">Any Distance</option>
            <option value="15">&lt; 15 km</option>
            <option value="25">&lt; 25 km</option>
            <option value="50">&lt; 50 km</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Found {rankedCentres.length} centres near you</span>
          <span className="text-[#22863A] font-semibold">Nearest-first</span>
        </div>

        {rankedCentres.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 my-4">
            <p className="text-3xl mb-2">🌾</p>
            <p className="font-semibold text-gray-700 text-sm">No centres match your filters</p>
            <p className="text-xs text-gray-400 mt-1">Try clearing crop or distance filter</p>
            <button
              onClick={() => { setCropFilter('All'); setMaxDistanceKm(null); setSearchQuery(''); }}
              className="mt-3 text-xs bg-[#E8F5E9] text-[#22863A] font-semibold px-3 py-1.5 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="flex flex-col gap-3">
            {rankedCentres.map((centre, index) => (
              <CentreCard
                key={centre.id}
                centre={centre}
                isNearest={index === 0}
                onSelect={selectCentre}
              />
            ))}
          </div>
        ) : (
          <LeafletMapView farmerCoords={userCoords} centres={rankedCentres} onSelect={selectCentre} />
        )}
      </div>

      {/* AI Assistant Quick Access */}
      <div className="px-4 pb-4 mt-2">
        <button
          onClick={() => navigate('ai-assistant')}
          className="w-full bg-[#1B5E20] text-white rounded-2xl p-4 flex items-center gap-3 shadow-md"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm">AI / IVR Assistant</p>
            <p className="text-xs text-green-300">Call 1800-XXX-XXXX for voice help in Telugu/Hindi</p>
          </div>
          <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// ---- Centre Card Component ----
const CentreCard: React.FC<{
  centre: Centre;
  isNearest?: boolean;
  onSelect: (c: Centre) => void;
}> = ({ centre, isNearest, onSelect }) => {
  const loadPct = Math.min(100, Math.round((centre.farmersWaiting / 100) * 100));
  const loadColor = loadPct < 40 ? 'green' : loadPct < 70 ? 'amber' : 'red';
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${centre.lat},${centre.lng}`;

  return (
    <div className={clsx(
      'bg-white rounded-2xl border transition-all overflow-hidden relative shadow-sm',
      isNearest ? 'border-[#22863A] ring-2 ring-green-100' : 'border-gray-100'
    )}>
      {isNearest && (
        <div className="bg-[#22863A] text-white text-[10px] font-extrabold px-3 py-1 flex items-center gap-1">
          <span>★ NEAREST PROCUREMENT CENTRE</span>
          <span className="ml-auto font-normal">Haversine Ranked</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 pr-2">
            <h3 className="font-bold text-[#1B5E20] text-sm leading-tight">{centre.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{centre.address}</p>
          </div>
          <StatusBadge status={centre.status} />
        </div>

        <div className="grid grid-cols-3 gap-2 my-3 bg-gray-50/70 p-2.5 rounded-xl">
          <div className="text-center">
            <p className="text-lg font-extrabold text-[#22863A]">{centre.distanceKm}</p>
            <p className="text-[10px] text-gray-500 font-medium">km away</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <p className="text-lg font-bold text-amber-600">{centre.farmersWaiting}</p>
            <p className="text-[10px] text-gray-500 font-medium">farmers waiting</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-bold text-gray-700 mt-1">{centre.estimatedWaitMin[0]}–{centre.estimatedWaitMin[1]}m</p>
            <p className="text-[10px] text-gray-500 font-medium">est. wait</p>
          </div>
        </div>

        {centre.cropTypes && centre.cropTypes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {centre.cropTypes.map(c => (
              <span key={c} className="bg-green-50 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-green-200">
                🌾 {c}
              </span>
            ))}
          </div>
        )}

        {/* Load bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Current Centre Load</span>
            <span>Confidence: {centre.confidencePct}%</span>
          </div>
          <ProgressBar value={loadPct} color={loadColor as 'green' | 'amber' | 'red'} />
        </div>

        <div className="flex gap-2">
          <Button onClick={() => onSelect(centre)} size="sm" className="flex-1">
            Select This Centre
          </Button>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 rounded-xl flex items-center justify-center font-bold text-xs gap-1 border border-gray-200"
            title="Open directions in Google Maps"
          >
            🧭 Navigation
          </a>
        </div>
      </div>
    </div>
  );
};

// ---- Interactive Leaflet Map Component (Aura mapHtml.js specification) ----
const LeafletMapView: React.FC<{
  farmerCoords: { lat: number; lng: number };
  centres: Centre[];
  onSelect: (c: Centre) => void;
}> = ({ farmerCoords, centres, onSelect }) => {
  const mapHtml = buildLeafletMapHtml(farmerCoords, centres);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm" style={{ height: 380 }}>
        <iframe
          title="Leaflet Procurement Locator Map"
          srcDoc={mapHtml}
          className="w-full h-full border-none"
        />
      </div>

      <p className="text-xs text-gray-500 font-medium">Select a centre from the map list below:</p>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {centres.map((c, idx) => (
          <button
            key={c.id}
            onClick={() => onSelect(c)}
            className="flex-shrink-0 bg-white rounded-xl p-3 border border-gray-200 shadow-sm flex flex-col gap-1 text-left min-w-[180px] hover:border-[#22863A]"
          >
            <div className="flex items-center justify-between">
              <StatusBadge status={c.status} />
              {idx === 0 && <span className="text-[10px] text-[#22863A] font-bold">★ Nearest</span>}
            </div>
            <p className="text-xs font-bold text-gray-800 truncate mt-1">{c.name}</p>
            <p className="text-[10px] text-gray-500">📍 {c.distanceKm} km · ⏱️ {c.estimatedWaitMin[0]}–{c.estimatedWaitMin[1]} m</p>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================
// CENTRE DETAILS PAGE
// ============================================================
export const CentreDetailPage: React.FC = () => {
  const { selectedCentre, navigate, goBack } = useAppStore();
  const centre = selectedCentre;

  if (!centre) return null;

  const operationEntries = [
    { label: 'Registration', value: centre.operations.registration },
    { label: 'Quality Check', value: centre.operations.qualityCheck },
    { label: 'Weighing', value: centre.operations.weighing },
    { label: 'Storage', value: centre.operations.storage },
  ];

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${centre.lat},${centre.lng}`;

  return (
    <div className="flex flex-col bg-[#F8FCF8] min-h-screen">
      <PageHeader title={centre.name} subtitle={centre.address} onBack={goBack} />

      <div className="px-4 py-4 flex flex-col gap-4">
        {/* Status banner */}
        <div className="bg-[#22863A] rounded-2xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-green-200 text-xs">Live Location Status</p>
              <p className="text-xl font-bold">{centre.distanceKm} km away</p>
            </div>
            <StatusBadge status={centre.status} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-green-200 text-xs">Farmers Waiting</p>
              <p className="text-2xl font-bold">{centre.farmersWaiting}</p>
            </div>
            <div className="bg-white/15 rounded-xl p-3">
              <p className="text-green-200 text-xs">Est. Wait Time</p>
              <p className="text-lg font-bold">{centre.estimatedWaitMin[0]}–{centre.estimatedWaitMin[1]} min</p>
            </div>
          </div>
        </div>

        {/* Accepted Crops */}
        {centre.cropTypes && (
          <Card>
            <p className="font-semibold text-[#1B5E20] text-sm mb-2">🌾 Crops Accepted Here</p>
            <div className="flex flex-wrap gap-1.5">
              {centre.cropTypes.map(c => (
                <span key={c} className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-lg">
                  {c}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Today's Progress */}
        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">Today's Progress</p>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{centre.todayCompleted} bags completed</span>
            <span>Target: {centre.todayTarget} bags</span>
          </div>
          <ProgressBar value={centre.todayProgress} />
          <p className="text-xs text-[#22863A] font-medium mt-2 text-right">{centre.todayProgress}%</p>
        </Card>

        {/* Operations Status */}
        <Card>
          <p className="font-semibold text-[#1B5E20] text-sm mb-3">Operations Status</p>
          <div className="flex flex-col gap-2">
            {operationEntries.map(op => (
              <div key={op.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={clsx(
                    'w-2 h-2 rounded-full',
                    op.value === 'Active' ? 'bg-green-500' :
                    op.value === 'Moderate' ? 'bg-amber-500' : 'bg-red-500'
                  )} />
                  <span className="text-sm text-gray-700">{op.label}</span>
                </div>
                <StatusBadge status={op.value} />
              </div>
            ))}
          </div>
        </Card>

        {/* Navigation Action */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white border-2 border-[#22863A] text-[#22863A] font-bold rounded-xl py-3 text-center flex items-center justify-center gap-2"
        >
          🧭 Open Directions in Google Maps
        </a>

        <Button onClick={() => navigate('crop-quantity')} size="lg">
          Book Slot at This Centre
        </Button>
      </div>
    </div>
  );
};
