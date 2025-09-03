# Employee Handbook Bot -- Frontend

An AI-powered chatbot interface that helps employees easily search and
understand their company handbook.
Built with **Next.js 15**, **TailwindCSS**, and **Shadcn/ui**, this
frontend consumes the backend API to deliver conversational,
context-aware answers.

> 🌐 **Live Demo:** https://employee-handbook-bot-frontend.vercel.app/

---

## ✨ Features

- 💬 **Chat UI** -- modern ChatGPT-style interface with Markdown
  rendering
- 🌓 **Dark/Light Mode** -- theme switching with `next-themes`
- 🔍 **Context-Aware Responses** -- answers grounded in your company
  handbook
- 📑 **Sources Highlighting** -- responses include handbook excerpts
  with relevance scores
- ⚡ **Keyboard Shortcuts** -- `Enter` to send, `Shift+Enter` for a
  new line
- 📱 **Responsive Design** -- works smoothly on desktop and mobile

---

## 🏗️ Tech Stack

- **Frontend**
  - Next.js 15 
  - React 19 
  - TailwindCSS 4.0
  - Shadcn/ui
- **Backend**
  - Python
  - LangChain for orchestration
  - **Google LLM (Gemini)** for embeddings + answer generation
  - Pinecone for semantic vector search
  - PDF parsing with pypdf

---

## 🖼️ Screenshots

<img width="1920" height="934" alt="screencapture-localhost-3000-2025-09-03-11_24_48" src="https://github.com/user-attachments/assets/62a15d8b-7d9a-4f4a-8c80-3eef8cd5e8cf" />
<img width="1920" height="945" alt="screencapture-localhost-3000-2025-09-03-11_25_07" src="https://github.com/user-attachments/assets/16c17535-128b-477c-8b38-50451e5cb917" />



---

## 🔌 Backend Process (How It Works)

1.  **Document Ingestion**
    - Extract text from handbook PDF (`pypdf`)
    - Split into overlapping chunks (`RecursiveCharacterTextSplitter`)
2.  **Embeddings**
    - Convert chunks into vectors using **Google Generative AI
      embeddings (embedding-001)**
3.  **Vector Database**
    - Store embeddings in **Pinecone** for semantic search
4.  **LLM Response**
    - User query is embedded and matched with handbook chunks
    - Context + query sent to **Google Gemini** for final response

👉 See full details in the backend repo:
[employee-handbook-bot-backend](https://github.com/dnlatt/employee-handbook-bot-backend)

---

## ⚙️ Environment Variables

Create a `.env.local` file in the frontend and backend directories:

```bash
# Google Gemini API Key
GOOGLE_API_KEY=

# Pinecone Vector DB
PINECONE_API_KEY=
```

⚠️ You'll need valid **Google AI Studio API access** and a **Pinecone
project** before running the bot.

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dnlatt/employee-handbook-bot-frontend.git
cd employee-handbook-bot-frontend
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
```

Open <http://localhost:3000> to see the app.

---

## 📂 Project Structure

    src/
      components/   # Reusable UI components (Chat UI, Inputs, Messages)
      app/          # Next.js app router pages
      types/        # Shared TypeScript types
      styles/       # Global styles (Tailwind)

---

## 🌐 Deployment

Easily deployable to:

- **Vercel** (recommended for Next.js)
- **Firebase Hosting** (using `next export`)

---

## 📜 License

MIT License. Free to use and modify.

---

⚡ Built with passion for AI-powered productivity.
