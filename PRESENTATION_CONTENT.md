# Presentation Slides Content (For PDF)

**Slide 1: Title Slide**
- **Title:** Asystent AI dla Administracji
- **Subtitle:** Precyzja i tempo decyzji administracyjnych w służbie państwa
- **Team:** [Your Team Name]
- **Hackathon:** HackNation 2025

**Slide 2: Problem Statement (Stan Aktualny)**
- **Departament Turystyki MSiT:** Decyzje dotyczące rozwoju turystyki, kategorii hoteli, kwalifikacji zawodowych, kontroli podmiotów turystycznych.
- **Wyzwania:** Sprawy o dużej objętości akt (50+ stron), skomplikowane regulacje, ograniczone zasoby kadrowe, częsta rotacja pracowników.
- **Konsekwencje:** Długotrwałe postępowania, ryzyko błędów, obciążenie orzeczników.

**Slide 3: Nasze Rozwiązanie**
- **Asystent AI dla orzecznika:** Narzędzie wspierające (nie zastępujące) człowieka w procesie decyzyjnym.
- **Human-in-the-loop:** AI analizuje, proponuje, człowiek decyduje.
- **Efekt:** Skrócenie czasu procesowania o 50% przy zachowaniu 100% zgodności prawnej.

**Slide 4: Funkcjonalności zgodne z wymaganiami**
- **Automatyczne streszczanie akt:** AI wyodrębnia kluczowe informacje z dokumentacji procesowej.
- **Wstępna ocena ryzyka:** Prawdopodobieństwo rozstrzygnięcia na podstawie 300 historycznych decyzji MSiT.
- **Projekty decyzji:** Automatyczne generowanie z uzasadnieniami prawnymi (Art. X Ustawy Y).
- **Zarządzanie terminami:** Przypomnienia o terminach KPA, monitoring statusu spraw.

**Slide 5: Architektura dostosowana do administracji**
- **Bezpieczeństwo:** Deployment w Rządowej Chmurze Obliczeniowej, pełna zgodność RODO.
- **Model AI:** GPT-4 Turbo dostosowany do specyfiki prawa administracyjnego polskiego.
- **Integracja:** Gotowość na połączenie z EZD, CBOSA, rejestrami publicznymi (KRS/CEIDG).
- **Guardrails:** Redakcja PII, weryfikacja odpowiedzi, audit logs.

**Slide 6: Security & Compliance (RODO/GDPR)**
- **Privacy by Design:** All PII is redacted *before* reaching the AI model.
- **Guardrails:** Strict input validation and output verification to prevent hallucinations.
- **Audit Trail:** Every AI interaction and user action is logged in an immutable audit log.
- **Data Sovereignty:** Designed for deployment in Rządowa Chmura Obliczeniowa.

**Slide 7: Integration Strategy**
- **EZD (Electronic Document Management):** Bi-directional sync for seamless document flow.
- **Public Registries (KRS/CEIDG):** Automated applicant verification.
- **CBOSA:** Access to administrative court judgments for legal precedent analysis.

**Slide 8: Przypadek użycia: Kategoria hotelu**
- **Scenariusz:** Hotel składa wniosek o nadanie kategorii 4-gwiazdkowej.
- **Proces:**
  1. AI analizuje dokumentację techniczną (50 stron).
  2. Weryfikuje zgodność z Rozporządzeniem w sprawie obiektów hotelarskich.
  3. Identyfikuje brak windy (wymagane dla 4 gwiazdek).
  4. Generuje projekt decyzji odmownej z pełnym uzasadnieniem prawnym.
- **Rezultat:** Sprawa rozpatrzona w 30 minut zamiast 4 godzin.

**Slide 9: Implementation Plan**
- **Phase 1 (MVP):** Core analysis and drafting (Ready Now).
- **Phase 2:** Registry Integration (Months 1-3).
- **Phase 3:** Full EZD Integration (Months 3-6).
- **Quality Assurance:** "Golden Set" testing against historical decisions.

**Slide 10: Summary & Impact**
- **Efficiency:** Faster decisions = Better citizen experience.
- **Quality:** Consistent application of law across all cases.
- **Transparency:** Full auditability of the decision-making process.
- **Call to Action:** Ready for pilot deployment in Department of Tourism.
