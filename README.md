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

## 🛠 Stos Technologiczny

- **Frontend:** Vue 3, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Baza Danych:** PostgreSQL (Supabase)
- **AI:** OpenAI GPT-4 Turbo, Exa.ai (Badania)
- **Bezpieczeństwo:** Walidacja Zod, Helmet, RLS

## 🏁 Szybki Start

### Wymagania wstępne
- Node.js 18+
- Projekt Supabase
- Klucz API OpenAI

### Instalacja

1. **Sklonuj repozytorium**
   ```bash
   git clone https://github.com/your-org/msit-assistant.git
   ```

2. **Konfiguracja Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Skonfiguruj SUPABASE_URL, SUPABASE_ANON_KEY, OPENAI_API_KEY
   npm run dev
   ```

3. **Konfiguracja Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

4. **Inicjalizacja Bazy Danych**
   Uruchom skrypt SQL znajdujący się w `database/schema.sql` w edytorze SQL Supabase.

## 🛡 Bezpieczeństwo i Zabezpieczenia

System implementuje rygorystyczne zabezpieczenia w celu zapewnienia bezpieczeństwa:
- **Anonimizacja Danych Osobowych:** Wszystkie dane osobowe są oczyszczane przed przetwarzaniem przez AI.
- **Podstawy Prawne:** AI musi cytować konkretne artykuły prawne.
- **Człowiek w Pętli:** AI nigdy nie podejmuje ostatecznych decyzji; jedynie rekomenduje.

## Zespół

- Paweł Lach
- Bartosz Idzik

## 📄 Licencja

Licencja MIT - Open Source dla Administracji Publicznej.
