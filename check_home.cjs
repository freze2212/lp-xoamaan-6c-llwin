const https = require('https');

https.get('https://xoaipmang.com/', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const matches = d.match(/class="grid-item/g) || [];
    console.log('Homepage Status:', res.statusCode);
    console.log('Total bookmakers rendered in HTML:', matches.length);
  });
});
