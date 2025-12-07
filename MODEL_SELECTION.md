# Model Selection Justification

## Wybór GPT-4 Turbo dla Departamentu Turystyki MSiT

### Uzasadnienie wyboru modelu językowego

**1. Specyfika administracji publicznej**
- **Język prawny:** GPT-4 Turbo wykazuje najlepszą znajomość polskiego języka prawnego i administracyjnego
- **Kontekst regulacyjny:** Model radzi sobie z interpretacją skomplikowanych przepisów (KPA, Ustawa o usługach turystycznych)
- **Precyzja cytowania:** Zdolność do precyzyjnego powoływania się na konkretne artykuły i rozporządzenia

**2. Parametry techniczne dostosowane do zadań MSiT**

| Parametr | GPT-4 Turbo | Uzasadnienie |
|----------|-------------|--------------|
| **Długość kontekstu** | 128k tokenów | Umożliwia analizę długich aktów spraw (50+ stron dokumentów) |
| **JSON Mode** | Tak | Strukturalne odpowiedzi dla integracji z systemami urzędowymi |
| **Precyzja faktów** | Bardzo wysoka | Kluczowe dla poprawności prawnej decyzji |
| **Kontrola outputu** | System prompts | Możliwość definiowania guardrails dla bezpieczeństwa |

**3. Compliance i bezpieczeństwo**
- **Data Residency:** Możliwość konfiguracji Azure OpenAI w UE dla zgodności z RODO
- **No Training:** Dane MSiT nie są używane do trenowania modelu (Enterprise API)
- **Audit Logs:** Pełne logowanie zapytań dla accountability

**4. Alternatywy rozważane:**

| Model | Pros | Cons | Decyzja |
|-------|------|------|---------|
| **Claude 3** | Dobre reasoning | Słabsza znajomość polskiego prawa | ❌ Odrzucony |
| **Llama 70B** | Open source | Wymaga dużych zasobów compute | ❌ Za drogie w utrzymaniu |
| **PaLM 2** | Google ecosystem | Brak wsparcia JSON mode | ❌ Techniczne ograniczenia |

**5. Dostrojenie do domeny turystycznej**

Planowane jest fine-tuning na podstawie 300 archiwalnych decyzji MSiT w celu:
- Poprawy trafności klasyfikacji spraw turystycznych
- Zwiększenia precyzji w cytowaniu specyficznych przepisów branżowych
- Optymalizacji stylu językowego zgodnego z praktyką Departamentu

**Wniosek:** GPT-4 Turbo oferuje najlepszy balans między jakością odpowiedzi, bezpieczeństwem i możliwościami integracji dla potrzeb orzeczników MSiT.