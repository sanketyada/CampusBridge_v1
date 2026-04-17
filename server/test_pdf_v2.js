const { PDFParse } = require('pdf-parse');

async function testExtraction() {
    const pdfUrl = 'https://res.cloudinary.com/dxptmoqve/image/upload/v1776414787/campusbridge/resources/plzdoyczfdvzzig1mxfc.pdf';
    console.log(`Testing extraction for: ${pdfUrl}`);
    
    try {
        const parser = new PDFParse({ url: pdfUrl });
        const result = await parser.getText();
        await parser.destroy();
        
        console.log('Success!');
        console.log('Text length:', result.text.length);
        console.log('Sample text:', result.text.substring(0, 100));
    } catch (err) {
        console.error('Extraction failed:', err.message);
    }
}

testExtraction();
