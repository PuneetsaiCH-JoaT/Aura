/**
 * Centre data service.
 *
 * Right now this returns mock data shaped exactly like the `Centre`
 * entity in the SRS (Section 7 — Data Requirements):
 *   id, name, location_lat, location_lng, daily_capacity, crop_types
 *
 * WHEN YOUR BACKEND IS READY:
 * Replace the body of fetchCentres() with a real call, e.g.:
 *
 *   export async function fetchCentres() {
 *     const res = await fetch('https://YOUR_BACKEND/api/centres');
 *     if (!res.ok) throw new Error('Failed to load centres');
 *     return res.json();
 *   }
 *
 * Nothing else in the app needs to change — App.js only calls
 * fetchCentres() and doesn't care where the data comes from.
 */

const MOCK_CENTRES = [
  {
    id: 'C001',
    name: 'Ranga Reddy Procurement Centre',
    location_lat: 17.385,
    location_lng: 78.4867,
    daily_capacity: 500,
    booked_count: 175,
    load_status: 'Low Load',
    load_level: 'low', // low | moderate | heavy
    crop_types: ['Paddy', 'Maize'],
    address: 'LB Nagar Main Rd, Hyderabad',
  },
  {
    id: 'C002',
    name: 'Medchal Mandi Yard',
    location_lat: 17.6294,
    location_lng: 78.4813,
    daily_capacity: 350,
    booked_count: 290,
    load_status: 'Heavy Load',
    load_level: 'heavy',
    crop_types: ['Cotton', 'Maize'],
    address: 'NH 44, Medchal Town',
  },
  {
    id: 'C003',
    name: 'Shamshabad Collection Point',
    location_lat: 17.2403,
    location_lng: 78.4294,
    daily_capacity: 400,
    booked_count: 210,
    load_status: 'Moderate Load',
    load_level: 'moderate',
    crop_types: ['Paddy', 'Groundnut'],
    address: 'Near Airport Rd, Shamshabad',
  },
  {
    id: 'C004',
    name: 'Vikarabad Procurement Centre',
    location_lat: 17.3378,
    location_lng: 77.9042,
    daily_capacity: 300,
    booked_count: 90,
    load_status: 'Low Load',
    load_level: 'low',
    crop_types: ['Cotton', 'Redgram'],
    address: 'Station Road, Vikarabad',
  },
  {
    id: 'C005',
    name: 'Sangareddy Mandi',
    location_lat: 17.6274,
    location_lng: 78.0866,
    daily_capacity: 450,
    booked_count: 360,
    load_status: 'Moderate Load',
    load_level: 'moderate',
    crop_types: ['Paddy', 'Cotton'],
    address: 'Mandi Area, Sangareddy',
  },
];

export async function fetchCentres() {
  // Simulated network delay so the loading state is testable.
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_CENTRES;
}
