# Vitals/Labs Trend Tracker

A small app that pulls a patient's A1C and glucose lab results from a SMART on FHIR sandbox and charts them over time, flagging the out of range values.

---

## Why

Tracking A1C and glucose trends, rather than isolated readings, is central to diabetes management. This project tries pulling that data from a real clinical data standard and visualizing it in a clinically useful way.

## How It Works

- Authenticates via SMART on FHIR (OAuth2 + PKCE) using the `fhirclient` library.
- Queries Observation resources by LOINC code (A1C: `4548-4`, Glucose: `2339-0`).
- Parses the FHIR response into clean data that is now chartable.
- Renders both trends with `Recharts`, flagging the values outside of the normal ranges (A1c ≥ 5.7%, glucose outside 70–99 mg/dL).

---

## Resources

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [fhirclient](https://www.npmjs.com/package/fhirclient) ~ SMART on FHIR OAuth2/PKCE client library.
- [Recharts](https://recharts.org/)
- [SMART on FHIR](https://docs.smarthealthit.org/) ~ the launch/auth standard this app implements.
- [SMART Health IT Sandbox](https://launch.smarthealthit.org/) ~ the test server and synthetic patient data used.
- [LOINC](https://loinc.org/) ~ the coding system used to identify lab types (A1C, glucose).

---

## Build

- npm install
- npm run dev 
- Click "Connect to SMART Sandbox"

---

## Data

Uses SMART Health IT's public sandbox with synthetic (`Synthea`) patient data.
