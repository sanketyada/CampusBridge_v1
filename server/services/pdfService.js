const { PDFParse } = require('pdf-parse');

/**
 * Extract text from a PDF URL (Cloudinary or other)
 */
const extractTextFromPDF = async (pdfUrl) => {
  let parser = null;
  try {
    console.log(`[PDF Service] Starting extraction for: ${pdfUrl}`);
    
    // PDFParse v2 can handle URLs directly!
    parser = new PDFParse({ url: pdfUrl });
    const result = await parser.getText();
    
    console.log(`[PDF Service] Extraction complete. Text length: ${result.text?.length || 0}`);
    return result.text;
  } catch (error) {
    console.error(`[PDF Service] Error in extractTextFromPDF: ${error.message}`);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};

module.exports = {
  extractTextFromPDF
};
