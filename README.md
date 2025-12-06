# Asystent AI dla administracji — precyzja i tempo decyzji administracyjnych w służbie państwa

**Departament Turystyki MSiT** - Zaawansowane narzędzie wspierające orzeczników w zarządzaniu sprawami administracyjnymi dotyczącymi turystyki: programowanie rozwoju turystyki, regulacje rynku, kwalifikacje zawodowe, kategorie hoteli, kontrola podmiotów turystycznych.

System automatycznie streszcza akta spraw, przypomina o terminach, generuje projekty decyzji i wspiera zgodność z wymogami prawnymi.

## 🚀 Funkcjonalności zgodne z wymaganiami

### Wsparcie w analizie i rozstrzyganiu spraw
- **Automatyczne gromadzenie i analiza:** Streszczenie dokumentacji procesowej w czasie rzeczywistym
- **Wstępna ocena ryzyka:** Prawdopodobieństwo rozstrzygnięcia na podstawie historycznych danych
- **Rekomendacje decyzji:** Propozycje wraz z uzasadnieniami prawymi

### Ułatwienia procesowe i workflow
- **Automatyzacja rutyn:** Przygotowanie dokumentów, projekty decyzji, zarządzanie terminami
- **Integracja z rejestrami:** Szybki dostęp do baz danych publicznych
- **Monitoring statusu:** Przypominanie o zbliżających się terminach KPA

### Zgodność i bezpieczeństwo
- **Kontrola zgodności:** Weryfikacja z obowiązującym prawem
- **Ochrona danych:** Pełna zgodność z RODO i zasadami poufności

## 📚 Documentation

- [**Architecture Overview**](ARCHITECTURE.md) - System design and components.
- [**Security & Compliance**](SECURITY.md) - RODO, Guardrails, and Data Protection.
- [**Integration Plan**](INTEGRATION_PLAN.md) - Strategy for EZD, CBOSA, and Public Registries.
- [**Deployment Guide**](DEPLOYMENT.md) - Infrastructure and CI/CD.
- [**Quality Assurance**](QUALITY_ASSURANCE.md) - Testing methodology and metrics.
- [**Use Cases**](USE_CASES.md) - Detailed user scenarios.

## 🛠 Tech Stack

- **Frontend:** Vue 3, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL (Supabase)
- **AI:** OpenAI GPT-4 Turbo, Exa.ai (Research)
- **Security:** Zod Validation, Helmet, RLS

## 🏁 Quick Start

### Prerequisites
- Node.js 18+
- Supabase Project
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/msit-assistant.git
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Initialize Database**
   Run the SQL script located in `database/schema.sql` in your Supabase SQL Editor.

## 🛡 Security & Guardrails

The system implements strict guardrails to ensure safety:
- **PII Redaction:** All personal data is sanitized before AI processing.
- **Legal Grounding:** AI is forced to cite specific legal articles.
- **Human-in-the-Loop:** AI never makes final decisions; it only recommends.

## 📄 License

MIT License - Open Source for Public Administration.
