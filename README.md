# sejabur.dev - Personal Portfolio

**Live Deployment:** [https://sejabur.dev](https://sejabur.dev)

## Overview
This repository contains the source code for the professional portfolio of **Md Sejabur Rahat**. The project is a highly optimized, fully responsive web application. The architecture minimizes external dependencies in favor of native CSS and vanilla JavaScript. 

The application functions as a decoupled, headless frontend, dynamically sourcing its content from a live Google Spreadsheet backend. This ensures seamless content updates with zero deployment overhead, maintaining peak performance across all viewports.

## Core Technical Features
- **Headless CMS Architecture:** The primary data models are fetched asynchronously via REST utilizing `opensheet.elk.sh`. This guarantees a strict separation of concerns between layout and content.
- **Dynamic Data Preloader:** A preloader ensures that all external DOM injections from the backend resolve completely before the user interface is exposed.
- **Intersection Observer Engine:** Scroll-spying, active navigation highlighting, and reveal animations are handled natively via the `IntersectionObserver` API.
- **Native CSS Scroll Snap:** The project display utilizes CSS scroll-snap modules combined with JavaScript-assisted controls, providing a native, lightweight carousel alternative.
- **Infinite Marquee:** The skills section is powered by a continuous CSS animation loop, maximizing performance.

---

## Google Sheets Integration

The website relies on a single public Google Spreadsheet to render its content dynamically. 

1. Create a Google Spreadsheet and ensure the sharing settings are set to **"Anyone with the link can view"**.
2. Open `js/app.js` and assign your Sheet ID to the constant: `const GOOGLE_SHEET_ID = "YOUR_ID";`
3. Create exactly 6 tabs (sheets) within that single file named: `Experience`, `Projects`, `Education`, `Certifications`, `Skills`, and `Connect`.
4. Ensure Row 1 of each tab contains the correct headers (e.g., `Title`, `Description`, `Link`) that the JavaScript engine expects.

---

## Licensing
Developed by **MD SEJABUR RAHAT**. 

This project is open-sourced under the MIT License. See the `LICENSE` file for full copyright details.
