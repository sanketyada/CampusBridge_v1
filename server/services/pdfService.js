const pdf = require('pdf-parse');
const axios = require('axios');

/**
 * Extract text from a PDF URL (Cloudinary or other)
 */
const extractTextFromPDF = async (pdfUrl) => {
  try {
    console.log(`[PDF Service] Starting extraction for: ${pdfUrl}`);
    
    // Fetch the PDF as a buffer
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer'
    });
    
    const dataBuffer = Buffer.from(response.data);
    
    // Parse the PDF buffer
    const data = await pdf(dataBuffer);
    
    console.log(`[PDF Service] Extraction complete. Text length: ${data.text?.length || 0}`);
    return data.text;
  } catch (error) {
    console.error(`[PDF Service] Error in extractTextFromPDF: ${error.message}`);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};

module.exports = {
  extractTextFromPDF
};
