const fs = require('fs');

const js = fs.readFileSync('original_bundle.js', 'utf8');

// Find any image urls or banner names
const bannerMatches = js.match(/\/uploads\/[^\s"',]+\.(?:png|jpg|jpeg|webp|svg)|\/assets\/[^\s"',]+\.(?:png|jpg|jpeg|webp|svg|mp4)/gi);
console.log('Banner/Asset matches:', Array.from(new Set(bannerMatches || [])));

// Find references to banners or default list
const regex = /\{[^}]*id[^}]*imageUrl[^}]*\}/g;
console.log('Objects with imageUrl:', (js.match(regex) || []).slice(0, 10));

// Find any embedded svg or base64 or video
const video = js.match(/video[^\s"',]+\.mp4/gi);
console.log('Videos:', video);
