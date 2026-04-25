# CampusBridge - Comprehensive Project Overview

## **Project Summary**

CampusBridge is a full-stack web application designed specifically for **Tier 2/3 college students** to bridge the awareness gap and help them discover opportunities, build real skills, and navigate their career paths. It's a comprehensive career ecosystem combining event discovery, learning roadmaps, AI mentorship, resource management, and community features—all in one integrated platform.

---

## **1. PROJECT ARCHITECTURE**

### **Tech Stack**

#### **Frontend (Client)**

- **Framework**: React 19.2.4 + Vite (build tool)
- **Routing**: React Router DOM 7.14.1
- **Styling**: Tailwind CSS 4.2.2 with custom components
- **UI/Animation**: Framer Motion, Lucide React icons, React Icons
- **HTTP Client**: Axios
- **Markdown Rendering**: React Markdown with code highlighting (highlight.js)
- **Build System**: Vite with React plugin

#### **Backend (Server)**

- **Runtime**: Node.js (Express.js 5.2.1)
- **Database**: MongoDB with Mongoose 9.4.1
- **Authentication**: JWT (jsonwebtoken), bcryptjs for password hashing
- **File Upload**: Cloudinary (multer-storage-cloudinary)
- **AI/LLM Integration**:
  - Google Gemini API (multi-turn chat)
  - Groq API (Llama 4 Scout model for faster responses)
  - LangChain for orchestration
- **PDF Processing**: pdf-parse
- **Other**: Morgan (logging), CORS, Cookie parser

---

## **2. KEY FEATURES & MODULES**

### **A. Authentication System** (`/api/auth`)

- **User Registration & Login**: Email-based authentication with JWT tokens
- **User Roles**: Student, Mentor, Admin
- **Profile Management**: Users can update bio, college, department, year, skills, social links
- **Data Model**:
  - Name, Email, Password (hashed)
  - Role (student/mentor/admin)
  - Academic Info: College, Department, Year (1st-4th Year or Graduate)
  - Skills list, Social media links
  - Avatar & Cover image (stored on Cloudinary)
  - Saved events tracking

---

### **B. EventSphere** (`/api/events`)

**Purpose**: Event discovery and management platform

- **Features**:
  - Browse, search, and filter events
  - Multiple event categories: Hackathon, Workshop, Seminar, Tech Fest, Expert Talk
  - Save/bookmark events for later
  - Event details: Title, Description, Date, Location, Image, Category, Tags
  - Attendee tracking (who's attending)
  - Event verification system (isVerified flag)
  - Organizer information & external links

---

### **C. Roadmaps** (`/api/roadmaps`)

**Purpose**: Structured learning paths for different tech domains

- **Features**:
  - Visual roadmap builder using node-edge graph system (React Flow style)
  - Roadmap Categories: Full-stack, Frontend, Backend, Data Science, Mobile, DevOps
  - Each roadmap contains:
    - Nodes (milestones/topics) with positions for visualization
    - Edges (connections between topics showing dependencies)
    - Public/private access control
  - Track learning progress through structured paths

---

### **D. AI Mentorship Bot** (`/api/chat`)

**Purpose**: AI-powered career mentoring system

- **Core Features**:
  - **Three AI Personas**:
    1. **Beginner Mentor**: Explains fundamentals for Tier 2/3 students
    2. **Professional Mentor**: Career advice, resume tips, interview prep
    3. **Project Architect**: Tech stack suggestions, code structure, debugging help
  - **Dual AI Provider Support**:
    - Google Gemini (for thoughtful, detailed responses)
    - Groq Llama 4 Scout (faster, streaming responses)
  - **Chat History**: Persistent conversation storage per user per session
  - **Features**:
    - Multi-turn conversations with context awareness
    - Markdown formatted responses with code highlighting
    - Session-based chat organization
    - Resource-specific chat (can discuss specific resources)

---

### **E. Resources Library** (`/api/resources`)

**Purpose**: Centralized learning resource management

- **Features**:
  - Multiple resource types: PDF, Link, Video, Article
  - Resource categories: Development, Design, CS Fundamentals, Career, Soft Skills, Other
  - **AI-Powered Summaries**:
    - Automatic PDF/content summarization using Groq
    - Key insights extraction (5-7 main takeaways)
    - Multi-modal support (text + images)
  - Resource metadata: Title, Description, Tags, Upload date
  - Content indexing for search
  - Uploaded by tracking (user attribution)

---

### **F. Community Feed** (`/api/feed`)

**Purpose**: Social interaction and knowledge sharing

- **Features**:
  - Post creation (text, media)
  - Comments and discussions
  - Like/engagement system
  - User feed personalization
  - Community building and peer learning

---

### **G. User Profile** (`/pages/Profile`)

- Personal profile page with all user info
- Achievement/activity history
- Saved events, resources, and progress
- Social links and portfolio display

---

## **3. FRONTEND STRUCTURE & ROUTING**

### **App.jsx - Main Router Configuration**

```
Routes:
├── / (Home)
├── /login (Login page)
├── /register (Registration page)
├── /events (EventSphere - all events)
├── /roadmaps (Roadmap viewer)
├── /ai-bot (AI Chat interface)
├── /resources (Resource library)
├── /resources/:id (Individual resource details)
├── /community (Community feed)
└── /profile (User profile)
```

### **Key Frontend Components**

1. **Layout**:
   - `Layout.jsx`: Main wrapper with Navbar and Footer
   - `Navbar.jsx`: Navigation header with auth state
   - `Footer.jsx`: Footer

2. **Pages**:
   - `Home.jsx`: Hero section, platform overview, call-to-actions
   - `Auth/Login.jsx & Register.jsx`: Authentication flows
   - `EventSphere/EventSphere.jsx`: Event listing and discovery
   - `Roadmaps/RoadmapViewer.jsx`: Visual roadmap display
   - `AIBot/ChatInterface.jsx`: AI mentor chat interface
   - `Resources/Library.jsx`: Resource grid/list view
   - `Resources/ResourceDetails.jsx`: Individual resource page with AI summary
   - `Community/Feed.jsx`: Social feed
   - `Profile/Profile.jsx`: User profile page

3. **Context**:
   - `AuthContext.jsx`: Global authentication state (user, login, logout, loading)

4. **Services**:
   - `api.js`: Axios instance with base URL and interceptors

---

## **4. BACKEND STRUCTURE & ROUTES**

### **Models (Database Schemas)**

1. **User**: Profile, authentication, preferences
2. **Event**: Event details, attendees, organizer
3. **Resource**: Learning materials with AI summaries
4. **Roadmap**: Learning paths with nodes and edges
5. **ChatHistory**: Conversation logs per session
6. **Post**: Community feed posts

### **API Endpoints**

- `/api/auth` - Register, Login, Get Profile
- `/api/events` - CRUD operations for events
- `/api/roadmaps` - CRUD for learning roadmaps
- `/api/resources` - Upload, list, detail, get summary
- `/api/feed` - Post creation, comments, likes
- `/api/chat` - Send message, get response from AI

### **Middleware**

- `auth.js`: JWT verification for protected routes
- CORS for cross-origin requests
- Morgan for HTTP request logging

---

## **5. AI/LLM SERVICES**

### **aiService.js - Core AI Engine**

- **Gemini Integration**:
  - Used for detailed, thoughtful responses
  - Best for learning explanations
- **Groq Integration**:
  - Llama 4 Scout model (multi-modal ready)
  - Faster response times
  - JSON response formatting
- **Features**:
  - `getGeminiResponse()`: Get AI mentorship responses with personas
  - `summarizeResource()`: Auto-summarize PDFs/documents
  - Key insight extraction from documents

### **Other AI Services**

- `langchainService.js`: LangChain orchestration (likely for advanced RAG patterns)
- `pdfService.js`: PDF extraction and processing
- `codeService.js`: Code-related AI tasks

---

## **6. FILE UPLOAD & STORAGE**

- **Provider**: Cloudinary (cloud-based image/file storage)
- **Handling**:
  - `cloudinary.js` config in `/config`
  - multer for file reception and validation
  - Files linked to user avatars, cover images, and resources

---

## **7. KEY FEATURES SUMMARY**

| Feature               | Purpose                          | Tech                     |
| --------------------- | -------------------------------- | ------------------------ |
| **Event Discovery**   | Find tech events & opportunities | MongoDB, Express, React  |
| **Learning Roadmaps** | Structured learning paths        | React Flow (nodes/edges) |
| **AI Mentorship**     | Personalized career guidance     | Gemini + Groq APIs       |
| **Resource Library**  | Central learning materials hub   | Cloudinary, PDF parsing  |
| **Community Feed**    | Social learning & discussions    | MongoDB, React           |
| **User Profiles**     | Portfolio & progress tracking    | JWT, MongoDB             |

---

## **8. DEPLOYMENT & CONFIGURATION**

- **Environment Variables** (.env):
  - MongoDB URI
  - Port (default: 5000)
  - Google API Key (Gemini)
  - Groq API Key
  - Cloudinary credentials
  - JWT secrets

- **Scripts**:
  - Client: `npm run dev` (Vite dev server), `npm run build` (production build)
  - Server: `npm run dev` (nodemon for auto-restart), `npm start` (production)

---

## **9. CURRENT STATE**

- ✅ **Completed**: Core architecture, database models, authentication, API routes
- ✅ **Implemented**: All major features (events, resources, AI bot, community)
- ✅ **UI**: Tailwind CSS with Framer Motion animations
- ⚠️ **Status**: Appears to be in active development (server had an error on last run)

---

## **10. TARGET AUDIENCE**

- **Primary**: Students from Tier 2/3 colleges in India
- **Secondary**: Mentors, career counselors
- **Use Cases**:
  - Finding tech events and opportunities
  - Learning structured tech roadmaps
  - Getting AI-powered career mentorship
  - Discovering curated learning resources
  - Networking with peers in the community

---

## **11. UNIQUE VALUE PROPOSITION**

1. **Tailored for Tier 2/3 Students**: Addresses awareness gap for students outside top colleges
2. **All-in-One Platform**: Events + Learning + Mentorship + Resources in one place
3. **AI-Powered**: Personalized guidance with multiple persona types
4. **Structured Learning**: Visual roadmaps for different tech domains
5. **Community-Driven**: Peer learning and knowledge sharing
6. **Resource Intelligence**: Auto-summarized materials with key insights

---

**This is a comprehensive platform aimed at democratizing career guidance and learning opportunities for college students across India.**
