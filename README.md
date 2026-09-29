# GraphRAG Research Navigator

> **GraphRAG Research Navigator is an enterprise research assistant that answers complex, multi-hop questions across distributed documents by uniting vector retrieval with knowledge-graph traversal. It uncovers hidden cross-source relationships, provides transparent evidence citations, and renders interactive multi-domain graph visualizations.**

---

## 🌟 Overview

Basic document chatbots struggle with queries that require synthesising facts scattered across multiple documents, reports, or research papers. **GraphRAG Research Navigator** combines **dense vector similarity retrieval** with **relational knowledge graph traversal** to construct verifiable multi-hop reasoning chains with transparent citations.

---

## ⚡ Core Capabilities

- **Hybrid GraphRAG Engine**: Discovers semantic nodes with vector similarity, traverses entity relationship edges across documents, and grounds LLM responses with source excerpts and confidence scores.
- **Custom Document Upload & Indexing**: Parse `.pdf`, `.docx`, `.txt`, `.md`, `.csv`, `.json`, or direct text notes with automatic entity extraction and relationship extraction.
- **Multi-Domain Workspaces**:
  - *Biomedical & AI Literature*: GraphRAG benchmark studies, BioASQ evaluations, and research citations.
  - *Incident & Supply Chain Audit*: Supplier risk tracking, battery safety incident reports, and component attribution.
  - *Policy & Regulatory Governance*: Compliance frameworks, cross-border privacy standards, and audit findings.
  - *Custom Blank Workspace*: Fresh canvas for your own documents and knowledge graphs.
- **Interactive Knowledge Graph Visualizer**: 2D force-directed layout with node degree filtering, entity types, relationship inspection, and direct jump to source citations.
- **Personalized Investigator Identity**: Customizable user profile (Name, Title, Email, Avatar) that persists across investigations, audit trails, and exported markdown dossiers.
- **Structured Investigation Exports**: Save multi-hop answers, generate investigation dossiers, and export markdown reports with complete citation bibliographies.

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/Bhuvanshankar45/GraphRAG-Research-Navigation.git
cd GraphRAG-Research-Navigation
```

### 2. Install dependencies
```bash
npm install
```

### 3. Launch the development server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Modern Vanilla CSS Design System with curated palettes and glassmorphic elements
- **Icons**: Lucide React
- **Graph Engine**: Custom GraphRAG hybrid retrieval and multi-hop reasoning traversal
- **Parsing**: Structured text chunking, regex entity detection, and heuristic triplet extraction

---

## 📄 License

MIT License. Created by Bhuvan Shankar.
