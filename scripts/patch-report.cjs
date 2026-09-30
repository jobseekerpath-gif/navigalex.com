// PDF downloads are handled directly by src/App.tsx using the structured report payload.
// This build hook intentionally performs no DOM scraping or injection, preventing site chrome
// and the on-page result screen from leaking into the generated PDF.
console.log('Report PDF hook skipped: React now submits the structured personalized report directly.');
