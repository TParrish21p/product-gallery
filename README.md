# Product Gallery (HTML + CSS + JS)

A responsive product gallery built with **just** HTML, CSS, and a pinch of JavaScript.  
Features **search**, **category filter**, **price slider**, **sorting**, and **shareable URLs** (filters sync to query params).

## Demo
Open `index.html` directly in your browser, or host with GitHub Pages (instructions below).

## Features
- Mobile-first responsive CSS Grid layout
- Search, category, max-price slider, and sorting (price/rating)
- Accessible forms and results (labels, focus styles, `aria-live` updates)
- URL sync: copy the address bar to share current filters
- No build tools, no dependencies

## How it works
- Static data lives in `script.js` (`products` array).
- Filtering/sorting are done in memory and re-rendered into a simple card grid.
- Result count updates in a `role="status"` live region.
- Filters are kept in the URL via `URLSearchParams`.

## Customize
- Add/edit products in `script.js`:
  ```js
  { id:'p7', title:'New Item', price:129, rating:4.1, category:'Audio', img:'https://...', desc:'Short blurb.' }