# Security & Compliance Documentation (RODO/GDPR)

## 1. Security Philosophy

The MSiT AI Assistant is built with a "Security First" and "Privacy by Design" approach, ensuring strict adherence to Polish and EU regulations (RODO/GDPR) regarding the processing of personal data in administrative procedures.

## 2. Data Protection Measures (RODO)

### 2.1. Data Minimization & Anonymization
- **Principle:** Only necessary data is processed.
- **Implementation:** Before sending any case data to external AI models (e.g., OpenAI), all Personally Identifiable Information (PII) such as names, PESEL numbers, and addresses are redacted or replaced with placeholders (e.g., `[APPLICANT_1]`).

### 2.2. Encryption
- **At Rest:** All data in the PostgreSQL database and file storage is encrypted using AES-256.
- **In Transit:** All communication between client, server, and database occurs over TLS 1.3 encrypted channels.

### 2.3. Access Control
- **Authentication:** Secure session management via Supabase Auth.
- **Authorization:** Row Level Security (RLS) policies in PostgreSQL ensure officers can only access cases assigned to their department or clearance level.

### 2.4. Right to be Forgotten
- System supports "soft delete" and "hard delete" workflows to comply with data erasure requests, while maintaining metadata required for administrative audit trails (as per archiving laws).

## 3. AI Guardrails

To ensure the reliability and safety of AI-generated content:

### 3.1. Hallucination Prevention
- **Grounding:** AI prompts are strictly grounded in the provided context (uploaded documents and legal procedures).
- **Citations:** The model is instructed to cite specific legal articles (Art. X Ustawy Y) for every recommendation.

### 3.2. Input/Output Validation
- **Input:** All user inputs are sanitized to prevent Prompt Injection attacks.
- **Output:** AI responses are validated against predefined schemas to ensure they do not contain harmful content or malformed legal advice.

### 3.3. Human-in-the-Loop
- **No Automated Decisions:** The AI **never** makes a final administrative decision. It only provides recommendations, drafts, and risk assessments. The final decision button is always controlled by a human officer.

## 4. Audit Logging

A comprehensive audit trail is maintained in the `audit_logs` table:

| Event | Data Logged | Purpose |
|-------|-------------|---------|
| User Login | User ID, IP, Timestamp | Security Monitoring |
| Case Access | User ID, Case ID, Time | Access Control Audit |
| AI Analysis | Input Hash, Output Summary | AI Accountability |
| Decision Made | User ID, Decision Type | Administrative Trail |

## 5. Technical Security Controls

- **Rate Limiting:** API endpoints are rate-limited to prevent DDoS and abuse.
- **Dependency Scanning:** Automated checks for vulnerabilities in npm packages.
- **Headers:** Secure HTTP headers (Helmet.js) configured (CSP, HSTS, X-Frame-Options).

## 6. Incident Response

In case of a data breach:
1. **Detection:** Automated alerts from audit logs.
2. **Containment:** Immediate revocation of affected API keys/sessions.
3. **Notification:** Automated report generation for the Data Protection Officer (IOD) within 72 hours.
