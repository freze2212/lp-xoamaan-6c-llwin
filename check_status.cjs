const https = require('https');

https.get('https://xoaipmang.com/api/status', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('STATUS CHECK:', d));
});
