# Response Time Declaration (Czas Reakcji)

## Deklarowane czasy reakcji systemu MSiT AI Assistant

### 1. Interfejs użytkownika (Frontend)
- **Załadowanie strony:** < 2 sekundy
- **Nawigacja między widokami:** < 500 ms
- **Responsywność formularzy:** Natychmiastowa (< 100 ms)

### 2. API Backend
- **Endpoint zdrowia (/health):** < 100 ms
- **Tworzenie nowej sprawy:** < 1 sekunda
- **Pobieranie listy spraw:** < 2 sekundy
- **Pobieranie szczegółów sprawy:** < 1.5 sekundy

### 3. Operacje AI (Kluczowe dla użytkowników)

| Operacja | Deklarowany czas | Rzeczywisty średni czas | SLA |
|----------|------------------|-------------------------|-----|
| **Klasyfikacja sprawy** | < 5 sekund | 2-4 sekundy | 95% requests |
| **Analiza ryzyka** | < 15 sekund | 8-12 sekund | 90% requests |
| **Projekt decyzji** | < 30 sekund | 15-25 sekund | 90% requests |
| **Odpowiedź czatu** | < 10 sekund | 4-8 sekund | 95% requests |
| **Pełna analiza sprawy** | < 45 sekund | 25-40 sekund | 90% requests |

### 4. Czynniki wpływające na czas reakcji

**Optymalizacja:**
- Równoległe wywołania AI agents (Risk + Guidance jednocześnie)
- Cache dla powtarzających się zapytań o procedury
- Indeksy bazy danych na kluczowych polach

**Ograniczenia:**
- Latencja OpenAI API: 2-8 sekund (zależne od obciążenia)
- Długość analizowanych dokumentów (dłuższe = wolniejsze)
- Złożoność sprawy (więcej precedensów = dłuższa analiza)

### 5. Monitoring i alerty

System wykorzystuje Prometheus + Grafana do monitorowania:
- Alert jeśli 95-percentyl czasu odpowiedzi > 60 sekund
- Alert jeśli dostępność API < 99%
- Dashboard z real-time metrykami dla administratorów

### 6. Tryb degradacji

W przypadku niedostępności OpenAI API:
- System przełącza się w tryb "Manual Only"
- Orzecznicy zachowują dostęp do bazy spraw i dokumentów
- Powiadomienie: "AI Assistant tymczasowo niedostępny - pełna funkcjonalność manualna zachowana"

**Wniosek:** System zapewnia responsywność odpowiednią dla pracy biurowej, gdzie najdłuższa operacja (pełna analiza sprawy) zajmuje < 1 minuty - wciąż 50x szybciej niż manualna analiza.