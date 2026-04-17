const pdf = require('pdf-parse');
console.log('--- PDF-PARSE EXPORTS ---');
console.log('Type of require("pdf-parse"):', typeof pdf);
console.log('Keys:', Object.keys(pdf));
if (pdf.default) {
    console.log('Type of .default:', typeof pdf.default);
}
console.log('-------------------------');
