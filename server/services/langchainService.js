const { ChatGroq } = require("@langchain/groq");
const { ChatPromptTemplate, MessagesPlaceholder } = require("@langchain/core/prompts");
const { HumanMessage, AIMessage, SystemMessage } = require("@langchain/core/messages");
const ChatHistory = require('../models/ChatHistory');
const { getCodebaseContext } = require('./codeService');
require('dotenv').config();

// Persona definitions
const PERSONAS = {
  beginner: "You are a helpful and patient Beginner Mentor for students in Tier 2/3 colleges. Use simple terms, explain concepts from scratch, and focus on fundamental clarity.",
  professional: "You are a Professional Career Mentor. Focus on industry standards, job readiness, resumes, and interview strategies for tech roles. Be concise and practical.",
  project: "You are a Technical Project Architect. Help students build real-world applications. Suggest tech stacks, code structures, and debugging strategies."
};

/**
 * Get response using LangChain and Groq with history and codebase context
 */
const getLangChainChatResponse = async (userId, userMessage, personaType = 'beginner', includeCodeContext = false) => {
  try {
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
    });

    // 1. Fetch Chat History from MongoDB
    let history = await ChatHistory.findOne({ userId });
    if (!history) {
      history = new ChatHistory({ userId, messages: [] });
    }

    // 2. Prepare Codebase Context if requested or if query seems related to code
    let codeContext = "";
    const codeKeywords = ['code', 'implement', 'route', 'controller', 'model', 'file', 'structure', 'how does', 'explain', 'folder', 'logic'];
    const shouldAddCodeContext = includeCodeContext || codeKeywords.some(k => userMessage.toLowerCase().includes(k));
    
    if (shouldAddCodeContext) {
      codeContext = getCodebaseContext();
      console.log(`[LangChain] Code context added (${codeContext.length} chars)`);
      console.log(`[LangChain] Context preview: ${codeContext.substring(0, 500)}...`);
    }

    // 3. Build Prompt Template
    const systemPrompt = `
      ${PERSONAS[personaType] || PERSONAS.beginner}
      
      You have access to the codebase context below to help answer questions about the specific project 'CampusBridge'.
      
      CODEBASE CONTEXT:
      {code_context}
      
      Guidelines:
      - If the user asks about the code, use the context provided.
      - If you don't know the answer based on context, say you don't know but try to guide them based on general best practices.
      - Stay in character as a mentor.
    `;
    
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", systemPrompt],
      new MessagesPlaceholder("history"),
      ["human", "{input}"],
    ]);

    // 4. Convert MongoDB history to LangChain messages
    const pastMessages = history.messages.map(m => {
      if (m.role === 'user') return new HumanMessage(m.content);
      if (m.role === 'assistant') return new AIMessage(m.content);
      return new SystemMessage(m.content);
    }).slice(-10); // Keep last 10 messages for context window

    // 5. Generate Response
    const chain = prompt.pipe(model);
    const response = await chain.invoke({
      input: userMessage,
      history: pastMessages,
      code_context: codeContext || "No context provided."
    });

    const aiResponse = response.content;

    // 6. Update History in MongoDB
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
