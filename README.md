# PDF RAG (Retrieval-Augmented Generation) System

An end-to-end, privacy-focused **PDF Retrieval-Augmented Generation (RAG)** application. Upload PDF documents, automatically index them into a vector database via background queues, and chat with your documents using local LLMs.

---

## 🏗️ Architecture & Features

- **Document Ingestion & Parsing**: Upload PDF files via Express API, processed asynchronously using **BullMQ** task queues.
- **Text Splitting & Vector Embeddings**: Documents are split into semantic chunks with LangChain and converted into vector embeddings using local Ollama (`nomic-embed-text`).
- **Vector Database Storage**: Efficient similarity search powered by **Qdrant Vector Database**.
- **Context-Aware RAG Engine**: Retrieves relevant document context to answer user queries using Ollama (`qwen3.5:9b`).
- **Interactive UI**: Modern Next.js frontend with seamless PDF upload and realtime chat interface authenticated via **Clerk**.

---

## 🛠️ Tech Stack

### Frontend (`/client`)
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **Authentication**: Clerk (`@clerk/nextjs`)
- **Icons & UI Components**: Lucide React, `react-markdown` with GitHub Flavored Markdown (`remark-gfm`)

### Backend (`/server`)
- **Runtime & Server**: Node.js, Express.js 5 (TypeScript)
- **Orchestration**: LangChain (`@langchain/community`, `@langchain/qdrant`, `@langchain/ollama`)
- **Queue System**: BullMQ backed by Valkey (Redis-compatible)
- **File Uploads**: Multer

### Infrastructure & AI Services
- **Vector DB**: Qdrant (Docker)
- **Queue Database**: Valkey / Redis (Docker)
- **Local AI Provider**: Ollama
  - **Embeddings Model**: `nomic-embed-text`
  - **LLM**: `qwen3.5:9b`

---

## 📁 Project Structure

```text
pdf-rag/
├── client/                 # Next.js frontend app
│   ├── app/                # Next.js App Router pages & components
│   │   ├── components/     # Chat and file upload components
│   │   ├── globals.css     # Global Tailwind styling
│   │   ├── layout.tsx      # Root layout wrapped with Clerk Provider
│   │   └── page.tsx        # Main application page
│   ├── middleware.ts       # Clerk auth middleware
│   └── package.json
├── server/                 # Express backend & background worker
│   ├── src/
│   │   ├── index.ts        # Express REST API endpoints (/chat, /upload/pdf)
│   │   ├── worker.ts       # BullMQ PDF processing worker
│   │   └── lib/
│   │       ├── embeddings.ts   # Ollama embeddings configuration
│   │       └── qdrantclient.ts # Qdrant vector store initialization & helpers
│   ├── uploads/            # Temporary PDF storage
│   └── package.json
├── docker-compose.yml      # Infrastructure setup (Valkey & Qdrant)
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18+ recommended) and **pnpm** (or `npm`)
- **Docker** & **Docker Compose**
- **Ollama** running locally (`http://127.0.0.1:11434`)

---

### 1. Start Infrastructure Services

Spin up the required vector database (Qdrant) and queue cache (Valkey):

```bash
docker compose up -d
```

This will launch:
- **Valkey / Redis** on port `6379`
- **Qdrant Vector Database** on port `6333`

---

### 2. Prepare Local AI Models (Ollama)

Make sure Ollama is installed and active on your system, then pull the necessary models:

```bash
# Embeddings Model
ollama pull nomic-embed-text

# Language Model
ollama pull qwen3.5:9b
```

---

### 3. Setup & Start Backend (`/server`)

Navigate to the `server` directory and install dependencies:

```bash
cd server
pnpm install # or npm install
```

Start the Express API server:

```bash
pnpm dev
# Runs server on http://localhost:8000
```

In a separate terminal window, start the BullMQ background worker to handle PDF processing jobs:

```bash
cd server
pnpm dev:worker
```

---

### 4. Setup & Start Frontend (`/client`)

Navigate to the `client` directory and install dependencies:

```bash
cd client
pnpm install # or npm install
```

Configure your environment variables for Clerk authentication in a `.env.local` file inside `/client`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Run the development server:

```bash
pnpm dev
# Runs client on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

---

## 📡 API Endpoints (`server`)

| Endpoint | Method | Description |
|---|---|---|
| `/upload/pdf` | `POST` | Uploads a PDF file and queues it for chunking and embedding. |
| `/chat` | `POST` | Accepts `{ "query": "..." }`, queries Qdrant vector store, and returns generated answer from Ollama. |

---

## 📝 Workflow Overview

1. **User uploads a PDF**: The frontend sends the PDF to `POST /upload/pdf`.
2. **Background Queue**: The server saves the file to `./uploads` and enqueues a job into BullMQ.
3. **Processing Worker**: `worker.ts` parses the PDF, splits it into 500-character chunks, computes vector embeddings with `nomic-embed-text`, and saves vectors into Qdrant collection `pdf_docs`.
4. **Chat Query**: When a user submits a query at `POST /chat`, the top relevant text chunks are retrieved from Qdrant and passed alongside the system prompt to `qwen3.5:9b` to produce a concise answer.
