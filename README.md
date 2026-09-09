# Aura — KisanSetu Project

This repository hosts the **Aura / KisanSetu** application codebase and documentation for the team.

## Contents
- **KisanSetu_SRS.docx**: Software Requirements Specification (SRS) document detailing all functional requirements (FRs) and architecture.
- **KisanSetuLocator/**: React Native (Expo) implementation of the **Procurement Centre Locator** feature (FR-8.1 / FR-8.2).
  - Uses GPS to find the nearest procurement centres (via Haversine distance formula).
  - Visual Leaflet & OpenStreetMap interactive map rendering.
  - Directions integration with native maps.
  - Mock centre data in services/centres.js ready for backend API integration.

## Getting Started with KisanSetuLocator
`ash
cd KisanSetuLocator
npm install
npx expo start
`
Scan the QR code with Expo Go on your mobile device to test GPS coordinates and map locator features.
