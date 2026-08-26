const fs = require('fs');

const js = fs.readFileSync('original_bundle.js', 'utf8');

const strRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"|'([^'\\]*(?:\\.[^'\\]*)*)'|`([^`\\]*(?:\\.[^`\\]*)*)`/g;
let m;
const vnStrings = new Set();
const assetUrls = new Set();
const allLinks = new Set();

while ((m = strRegex.exec(js)) !== null) {
  const str = m[1] || m[2] || m[3];
  if (!str) continue;
  if (/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(str)) {
    vnStrings.add(str.replace(/\\"/g, '"').replace(/\\n/g, '\n'));
  }
  if (str.includes('http://') || str.includes('https://') || str.includes('.png') || str.includes('.jpg') || str.includes('.svg') || str.includes('.webp')) {
    allLinks.add(str);
  }
}

fs.writeFileSync('extracted_vn_strings.json', JSON.stringify(Array.from(vnStrings), null, 2), 'utf8');
fs.writeFileSync('extracted_links.json', JSON.stringify(Array.from(allLinks), null, 2), 'utf8');

console.log('Done extracting: VN strings =', vnStrings.size, ', Links/Assets =', allLinks.size);
