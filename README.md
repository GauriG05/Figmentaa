# Figmenta Intelligent Agent Hub  
### Web Chat + Discord Human Escalation System

This project is a production-style conversational AI system that demonstrates a complete **AI-driven discovery flow with real-time human takeover via Discord**, powered by n8n, Supabase, OpenAI, and a lightweight web chat UI.

## 🎯 Project Objective

Build a professional-grade conversational system where:
- Users interact with an AI agent (**Fig1**) via a public web chat
- The AI conducts structured discovery using Figmenta’s knowledge base
- Conversations seamlessly escalate to a **human team member on Discord**
- AI pauses automatically during human takeover to prevent collisions

## 🧠 System Overview

### Phase 1 – AI Discovery Engine (Web Chat)
- AI agent identifies as **Fig1**
- Leads the conversation proactively
- Collects the following (users may skip):
  1. Project Type  
  2. Brand Name  
  3. Industry  
  4. Budget  
  5. Timeline  
- Answers Figmenta-related questions using a **PDF-based knowledge base**
- Stores structured data in **Supabase**
- Maintains session-based memory

### Phase 2 – Human Escalation (Discord)
- Email collected after discovery
- Time-aware logic (CET):
  - **Mon–Fri, 9AM–6PM** → option to talk to a human now
  - Outside hours → details forwarded for follow-up
- Dedicated **Discord thread** created per session
- Human replies sync back to the web chat in real time
- AI responses are paused while `human_active = true`

## 🧩 Architecture & Tech Stack

**Frontend**
- HTML / CSS / JavaScript
- Chat popup UI
- Webhook-based communication with n8n

**Automation & Logic**
- n8n (Main workflow + Sub-workflow)
- State-driven execution

**AI**
- OpenAI Chat Model (via LangChain Agent)
- Vector-based semantic search

**Database**
- Supabase  
- Tables:
  - `conversations`
  - `documents` (vector embeddings)

**Human Bridge**
- Discord Bot
- Thread-based conversation handling

## 📂 Repository Structure

```text
figmenta-agent-hub/
│
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
├── n8n/
│   ├── Figmenta.json
│   └── Figmenta Sub workflow.json
│
├── assets/
│   └── screenshots/
│
└── README.md
```

## 🔄 Workflow Breakdown

### 1️⃣ Session Initialization
- Incoming chat webhook receives `session_id`
- New conversation row created in Supabase

### 2️⃣ AI Discovery Logic
- AI extracts structured fields from free-text input
- Updates Supabase in real time
- Asks next missing question in fixed order
- Uses vector knowledge base for company-related queries

### 3️⃣ Escalation Decision
- Checks CET time window
- Asks user to choose:
  - **Talk to someone now**
  - **Email later**

### 4️⃣ Discord Human Takeover
- Sub-workflow creates Discord thread using `session_id`
- Thread ID saved in Supabase
- User message forwarded to Discord
- Human reply captured and sent back to web chat
- AI remains paused during takeover

## 🗄️ Knowledge Base

- Figmenta company information stored as PDFs
- Documents converted into vector embeddings
- Stored in Supabase Vector Store
- Enables accurate, grounded responses

## 👤 Author

**Gauri Tanaji Gaikwad**  
AI & Data Science Engineering Student  
Focused on automation-first AI systems and workflow orchestration.
