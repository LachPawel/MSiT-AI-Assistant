# Architecture Documentation - MSiT AI Assistant

## 1. System Overview

The MSiT AI Assistant is a secure, cloud-native application designed to support administrative officers in the Polish Ministry of Sport & Tourism. It leverages advanced Large Language Models (LLMs) to automate document analysis, risk assessment, and decision drafting while maintaining strict compliance with GDPR (RODO) and administrative procedures (KPA).

## 2. High-Level Architecture

```mermaid
graph TD
    User[Administrative Officer] -->|HTTPS/TLS 1.3| Frontend[Vue 3 Frontend]
    Frontend -->|REST API| Backend[Node.js/Express Backend]
    
    subgraph "Secure Cloud Environment"
        Backend -->|Auth & Data| Supabase[Supabase (PostgreSQL)]
        Backend -->|Vector Search| VectorDB[Supabase pgvector]
        Backend -->|File Storage| Storage[Supabase Storage]
    end
    
    subgraph "AI Services (Sanitized)"
        Backend -->|Anonymized Data| OpenAI[OpenAI GPT-4 API]
        Backend -->|Research| Exa[Exa.ai Search]
    end
    
    Supabase -->|Audit Logs| Audit[Audit Logging System]
```

## 3. Technology Stack

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Pinia
- **Build Tool:** Vite

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Validation:** Zod (Runtime schema validation)
- **Logging:** Winston (Structured logging)

### Database & Storage
- **Database:** PostgreSQL 15 (via Supabase)
- **ORM/Query Builder:** Supabase JS Client
- **File Storage:** Supabase Storage (Encrypted at rest)

### AI & ML
- **LLM:** GPT-4 Turbo (via OpenAI API)
- **Embeddings:** text-embedding-3-small
- **Search:** Exa.ai (for external regulatory research)

## 4. Key Components

### 4.1. Case Management Module
Handles the lifecycle of administrative cases from initiation to decision.
- **Features:** CRUD operations, status tracking, deadline management.
- **Data Model:** `cases`, `procedures`, `case_deadlines`.

### 4.2. AI Analysis Engine
The core intelligence layer that processes case data.
- **Classifier Agent:** Categorizes incoming cases based on description and documents.
- **Risk Assessment Agent:** Evaluates compliance risks and fraud probability.
- **Drafter Agent:** Generates decision drafts based on templates and legal basis.

### 4.3. Document Processing Pipeline
1. **Upload:** Secure upload to encrypted storage.
2. **Extraction:** OCR/Text extraction from PDF/Images.
3. **Anonymization:** PII removal before sending to LLM.
4. **Analysis:** Summarization and entity extraction.

### 4.4. Security & Compliance Layer (Guardrails)
- **Input Validation:** Strict schema validation for all API inputs.
- **PII Redaction:** Regex and NLP-based removal of sensitive data before external API calls.
- **Audit Logging:** Immutable logs of all user actions and AI decisions.
- **Role-Based Access Control (RBAC):** Granular permissions for officers and admins.

## 5. Data Flow

1. **Case Submission:** Officer enters case details or uploads files.
2. **Preprocessing:** Backend validates input and sanitizes PII.
3. **AI Processing:** 
   - System retrieves relevant legal procedures.
   - LLM analyzes case against criteria.
   - Risk score is calculated.
4. **Decision Support:** 
   - System suggests next steps.
   - Draft decision is generated.
5. **Human Review:** Officer reviews AI suggestions and makes final decision.
6. **Finalization:** Decision is stored, and audit log is updated.

## 6. Deployment & Scalability

- **Containerization:** Docker support for consistent environments.
- **CI/CD:** GitHub Actions for automated testing and deployment.
- **Scalability:** Stateless backend design allows horizontal scaling. Database scales via Supabase managed infrastructure.

## 7. Integration Plan

The system is designed to integrate with:
- **EZD (Elektroniczne Zarządzanie Dokumentacją):** For document import/export.
- **CBOSA:** For retrieving relevant court judgments.
- **Public Registries (KRS/CEIDG):** For verifying applicant data.
