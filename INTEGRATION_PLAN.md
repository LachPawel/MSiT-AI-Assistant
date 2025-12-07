# Integration Plan

## 1. Overview

This document outlines the strategy for integrating the MSiT AI Assistant with existing Polish government systems and public registries. The integration ensures data consistency, reduces manual entry, and leverages authoritative data sources.

## 2. Key Integrations

### 2.1. EZD (Elektroniczne Zarządzanie Dokumentacją)
**Purpose:** Bi-directional document synchronization.
- **Protocol:** SOAP/REST API (EZD RP / EZD PUW).
- **Flow:**
  - *Import:* Automatically fetch new incoming cases from EZD inbox.
  - *Export:* Push generated decisions and official correspondence back to EZD for digital signature and dispatch.
- **Data Mapping:**
  - EZD `meta_data.xml` -> MSiT `cases` table.
  - EZD attachments -> MSiT `case_documents` (Supabase Storage).

### 2.2. CBOSA (Centralna Baza Orzeczeń Sądów Administracyjnych)
**Purpose:** Legal research and precedent analysis.
- **Method:** API / Scraper (if API unavailable).
- **Usage:**
  - The AI Retriever Agent queries CBOSA for judgments related to specific legal articles cited in the case.
  - Relevant judgments are used to ground the "Legal Basis Analysis".

### 2.3. Public Registries (KRS / CEIDG / REGON)
**Purpose:** Applicant verification.
- **Source:** GUS API (Główny Urząd Statystyczny) / KRS API.
- **Validation Checks:**
  - Verify NIP/REGON validity.
  - Check active business status.
  - Verify representation rights (who can sign the application).

### 2.4. e-Doręczenia (e-Delivery)
**Purpose:** Secure delivery of administrative decisions.
- **Integration:** Via EZD or direct API integration with Poczta Polska.
- **Feature:** Automatic generation of UPO (Urzędowe Poświadczenie Odbioru) tracking.

## 3. Technical Implementation

### 3.1. Integration Layer (Middleware)
A dedicated `IntegrationService` in the backend will handle external communication.

```typescript
// Example Interface
interface ExternalRegistryAdapter {
  getCompanyDetails(nip: string): Promise<CompanyDetails>;
  validateRepresentation(nip: string, personName: string): Promise<boolean>;
}
```

### 3.2. Security
- **mTLS:** Mutual TLS for all government API connections.
- **VPN:** Site-to-site VPN for connecting to internal ministry networks (Intranet).
- **Credentials:** Stored in HashiCorp Vault or Supabase Secrets, never in code.

## 4. Phasing

- **Phase 1 (MVP):** Manual upload/download.
- **Phase 2:** Read-only integration with KRS/CEIDG for validation.
- **Phase 3:** Full EZD integration (Import/Export).
- **Phase 4:** CBOSA and advanced legal analytics.
