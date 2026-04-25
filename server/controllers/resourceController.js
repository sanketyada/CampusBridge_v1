const Resource = require('../models/Resource');
const { summarizeResource, chatWithResource } = require('../services/aiService');
const { extractTextFromPDF } = require('../services/pdfService');
const { uploadResource } = require('../config/cloudinary');

/**
 * @desc    Get all resources
 * @route   GET /api/resources
 */
const getResources = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const resources = await Resource.find(query)
      .populate('uploadedBy', 'name role avatar')
      .sort('-createdAt');
      
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Upload new resource
 * @route   POST /api/resources
 */
const createResource = async (req, res) => {
  try {
    const { title, description, category, type } = req.body;
    
    // Validate request
    if (!req.file && !req.body.url) {
      return res.status(400).json({ message: "Please upload a file or provide a link" });
    }

    const fileUrl = req.file ? req.file.path : req.body.url;
    const publicId = req.file ? req.file.filename : null;

    let aiSummary = "";
    let keyInsights = [];
    let contentText = "";

    // Trigger AI Summarization & Content Extraction for PDFs
    if (type === 'PDF' && fileUrl) {
      try {
        const aiData = await processResourceAI(fileUrl);
        contentText = aiData.contentText;
        aiSummary = aiData.aiSummary;
        keyInsights = aiData.keyInsights;
      } catch (aiErr) {
        console.error("AI Auto-summarization failed:", aiErr.message);
      }
    }

    const resource = await Resource.create({
      title,
      description,
      category,
      type,
      fileUrl,
      publicId,
      aiSummary,
      keyInsights,
      contentText: contentText || "",
      uploadedBy: req.user._id
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Upload Route Error:", err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * @desc    Get single resource details (Notebook LM view)
 * @route   GET /api/resources/:id
 */
const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('uploadedBy', 'name role avatar');
    
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    
    res.json(resource);
  } catch (err) {
    console.error(`Error in getResourceById for ${req.params.id}:`, err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Chat with a resource using AI
 * @route   POST /api/resources/:id/chat
 */
const chatWithResourceController = async (req, res) => {
  try {
    const { message } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const isImage = resource.fileUrl && resource.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i);
    
    if (!resource.contentText && !isImage) {
      return res.status(400).json({ message: "This resource does not support AI chat (no text content or image found)." });
    }

    // Use the new LangChain service for stateful chat
    const { getLangChainChatResponse } = require('../services/langchainService');
    const aiResponse = await getLangChainChatResponse({
      userId: req.user._id,
      resourceId: resource._id,
      userMessage: message,
      resourceContext: resource.contentText,
      imageUrl: isImage ? resource.fileUrl : null
    });

    res.json({ response: aiResponse });
  } catch (err) {
    console.error(`Error in chatWithResource for ${req.params.id}:`, err.message);
    res.status(500).json({ message: err.message });
  }
};

/**
 * @desc    Manual trigger to refresh/generate AI summary for an existing resource
 * @route   POST /api/resources/:id/refresh-ai
 */
const reprocessResourceAIAction = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const isImage = resource.fileUrl && resource.fileUrl.match(/\.(jpg|jpeg|png|webp|gif)$/i);
    if (resource.type !== 'PDF' && !isImage) {
      return res.status(400).json({ message: "AI Summary is only supported for PDFs or Images at the moment." });
    }

    console.log(`Manual AI Refresh triggered for: ${resource.title} (${resource._id})`);
    
    const aiData = await processResourceAI(resource.fileUrl, isImage);
    
    resource.contentText = aiData.contentText || resource.contentText;
    resource.aiSummary = aiData.aiSummary;
    resource.keyInsights = aiData.keyInsights;
    
    await resource.save();

    res.json({
      message: "AI Summary generated successfully",
      aiSummary: resource.aiSummary,
      keyInsights: resource.keyInsights
    });
  } catch (err) {
    console.error("Manual AI Refresh Error:", err.message);
    res.status(500).json({ message: `AI Processing failed: ${err.message}` });
  }
};

/**
 * Helper: Process AI for a resource (Extract text -> Summarize)
 * Supports multi-modal (Vision) for images
 */
async function processResourceAI(fileUrl, isImage = false) {
  try {
    console.log(`[AI Process] Starting for: ${fileUrl} (Image: ${isImage})`);
    
    let contentText = "";
    if (!isImage) {
      contentText = await extractTextFromPDF(fileUrl);
      if (!contentText || contentText.trim().length === 0) {
        throw new Error("Could not extract any text from the PDF. It might be scanned or empty.");
      }
    }

    console.log(`[AI Process] Sending to Groq (Model: llama-4-scout)...`);
    const aiData = await summarizeResource(contentText, isImage ? fileUrl : null);
    
    return {
      contentText,
      aiSummary: aiData.summary,
      keyInsights: aiData.keyInsights
    };
  } catch (err) {
    console.error(`[AI Process] Error: ${err.message}`);
    throw err;
  }
}

module.exports = {
  getResources,
  createResource,
  getResourceById,
  chatWithResource: chatWithResourceController,
  reprocessResourceAI: reprocessResourceAIAction,
  uploadMiddleware: uploadResource.single('file')
};
