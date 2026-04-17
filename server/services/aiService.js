const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
require('dotenv').config();

// Initialize APIs
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Using the Scout model for multi-modal (Vision) capabilities as suggested by user
const GROQ_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

/**
 * Personas for AI Mentorship
 */
const PERSONAS = {
  beginner: "You are a helpful and patient Beginner Mentor for students in Tier 2/3 colleges. Use simple terms, explain concepts from scratch, and focus on fundamental clarity.",
  professional: "You are a Professional Career Mentor. Focus on industry standards, job readiness, resumes, and interview strategies for tech roles. Be concise and practical.",
  project: "You are a Technical Project Architect. Help students build real-world applications. Suggest tech stacks, code structures, and debugging strategies."
};

/**
 * Get response from Gemini
 */
const getGeminiResponse = async (prompt, personaType = 'beginner') => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const systemPrompt = PERSONAS[personaType] || PERSONAS.beginner;
    const fullPrompt = `${systemPrompt}\n\nStudent Query: ${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Failed to get response from Gemini");
  }
};

/**
 * Summarize Resource Content using Groq (Multi-modal ready)
 */
const summarizeResource = async (content, imageUrl = null) => {
  try {
    const textContent = content ? content.substring(0, 100000) : "";
    
    let userContent = [];
    if (textContent) {
      userContent.push({
        type: "text",
        text: `Analyze the following document and provide a JSON summary:\n\n${textContent}`
      });
    }
    
    if (imageUrl) {
      userContent.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }

    const systemPrompt = `
      You are an AI Academic Assistant (Notebook LM Style). 
      Provide:
      1. A concise professional summary (2-3 paragraphs).
      2. 5-7 Key Insights/Takeaways as a list.
      
      Format your response EXACTLY as a JSON object:
      {
        "summary": "...",
        "keyInsights": ["...", "..."]
      }
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      model: GROQ_MODEL,
      response_format: { type: "json_object" }
    });
    
    const responseText = completion.choices[0]?.message?.content;
    console.log("[Groq] Summary received, parsing JSON...");
    
    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch (parseErr) {
        // Fallback for wrapped JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        return { summary: responseText, keyInsights: [] };
      }
    }
    
    return { summary: "Failed to generate summary.", keyInsights: [] };
  } catch (error) {
    console.error("Groq Summarization Error:", error);
    return { summary: "Failed to parse summary content.", keyInsights: [] };
  }
};

/**
 * Chat with Resource (Context-Aware) using Groq
 */
const chatWithResource = async (content, userQuery, imageUrl = null) => {
  try {
    const textContent = content ? content.substring(0, 100000) : "";
    
    let userMessageContent = [];
    if (textContent) {
      userMessageContent.push({
        type: "text",
        text: `Context from document: ${textContent}`
      });
    }
    
    if (imageUrl) {
      userMessageContent.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }
    
    userMessageContent.push({
      type: "text",
      text: `Question: ${userQuery}`
    });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an AI Academic Assistant. Use provided context to answer. Be concise." },
        { role: "user", content: userMessageContent }
      ],
      model: GROQ_MODEL,
    });
    
    return completion.choices[0]?.message?.content || "No response from AI.";
  } catch (error) {
    console.error("Groq AI Chat Error:", error);
    throw new Error("Failed to get response from Groq AI Chat");
  }
};

/**
 * Get generic response from Groq
 */
const getGroqResponse = async (prompt, personaType = 'beginner') => {
  try {
    const systemPrompt = PERSONAS[personaType] || PERSONAS.beginner;
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: [{ type: "text", text: prompt }] }
      ],
      model: GROQ_MODEL,
    });
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq Error:", error);
    throw new Error("Failed to get response from Groq");
  }
};

module.exports = {
  getGeminiResponse,
  getGroqResponse,
  summarizeResource,
  chatWithResource
};
