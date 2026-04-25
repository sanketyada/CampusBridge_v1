const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage, SystemMessage } = require("@langchain/core/messages");
const ChatHistory = require('../models/ChatHistory');
const { getCodebaseContext } = require('./codeService');
require('dotenv').config();

// Models
const TEXT_MODEL = "llama-3.3-70b-versatile";
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Persona definitions
const PERSONAS = {
  beginner: "You are a helpful and patient Beginner Mentor for students in Tier 2/3 colleges. Use simple terms, explain concepts from scratch, and focus on fundamental clarity.",
  professional: "You are a Professional Career Mentor. Focus on industry standards, job readiness, resumes, and interview strategies for tech roles. Be concise and practical.",
  project: "You are a Technical Project Architect. Help students build real-world applications. Suggest tech stacks, code structures, and debugging strategies.",
  resource: "You are an AI Academic Assistant. Use the provided document content or image context to answer questions accurately and concisely. If the user provides an image, analyze it thoroughly. If the answer isn't in the provided context, say so but try to help based on general knowledge."
};

/**
 * Get response using LangChain and Groq with history and context
 */
const getLangChainChatResponse = async ({
  userId, 
  userMessage, 
  personaType = 'beginner', 
  includeCodeContext = false,
  resourceId = null,
  resourceContext = "",
  imageUrl = null
}) => {
  try {
    // Determine model
    const modelName = imageUrl ? VISION_MODEL : TEXT_MODEL;
    
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: modelName,
      temperature: 0.7,
    });

    // 1. Fetch Chat History from MongoDB (scoped to userId and optionally resourceId)
    const historyQuery = { userId, resourceId: resourceId || null };
    let history = await ChatHistory.findOne(historyQuery);
    if (!history) {
      history = new ChatHistory({ ...historyQuery, messages: [] });
    }

    // 2. Prepare Context (Codebase or Resource)
    let codeContext = "";
    if (!resourceId) { // Only add codebase context for general chat or if explicitly asked
      const codeKeywords = ['code', 'implement', 'route', 'controller', 'model', 'file', 'structure', 'how does', 'explain', 'folder', 'logic'];
      const shouldAddCodeContext = includeCodeContext || codeKeywords.some(k => userMessage.toLowerCase().includes(k));
      if (shouldAddCodeContext) {
        codeContext = require('./codeService').getCodebaseContext();
      }
    }

    const activePersona = resourceId ? PERSONAS.resource : (PERSONAS[personaType] || PERSONAS.beginner);

    // 3. Build System Prompt
    let systemPrompt = `
      ${activePersona}
      
      ${resourceId ? 'You are currently helping the user with a specific resource/document.' : 'You are currently assisting the user with the CampusBridge project.'}
    `;

    if (codeContext) {
      systemPrompt += `\n\nCODEBASE CONTEXT:\n{code_context}\n`;
    }

    if (resourceContext) {
      systemPrompt += `\n\nRESOURCE CONTENT:\n{resource_context}\n`;
    }

    systemPrompt += `
      Guidelines:
      - Use the provided context to answer questions.
      - If you don't know the answer, be honest and guide based on best practices.
      - Stay in character.
    `;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    // 4. Prepare History
    const pastMessages = history.messages.map(m => {
      if (m.role === 'user') return new HumanMessage(m.content);
      if (m.role === 'assistant') return new AIMessage(m.content);
      return new SystemMessage(m.content);
    }).slice(-15);

    // 5. Build Final Input
    let humanInput;
    if (imageUrl) {
      // Multi-modal format for LangChain (ChatGroq/OpenAI compatible)
      humanInput = [
        { type: "text", text: userMessage },
        { type: "image_url", image_url: { url: imageUrl } }
      ];
    } else {
      humanInput = userMessage;
    }

    // 6. Invoke Chain
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: humanInput,
      history: pastMessages,
      code_context: codeContext || "N/A",
      resource_context: resourceContext || "N/A"
    });

    const aiResponse = response.content;

    // 7. Save History
    history.messages.push({ role: 'user', content: userMessage });
    history.messages.push({ role: 'assistant', content: aiResponse });
    history.lastMessageAt = Date.now();
    await history.save();

    return aiResponse;
  } catch (error) {
    console.error("LangChain Service Error:", error);
    throw new Error("Failed to get response from AI Bot");
  }
};

module.exports = { getLangChainChatResponse };
