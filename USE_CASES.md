# Przypadki użycia - Departament Turystyki MSiT

## Scenariusz 1: Nadawanie kategorii hotelom
**Aktor:** Orzecznik, Departament Turystyki MSiT
**Cel:** Sprawne rozpatrzenie wniosku o nadanie kategorii hotelowej zgodnie z Rozporządzeniem w sprawie obiektów hotelarskich.

### Flow:
1. **Ingestion:** Officer uploads a PDF application from "KS Orzeł Warszawa".
2. **Analysis:** 
   - System extracts key data: Budget (2.5M PLN), Location (Warsaw), Timeline (2025-2026).
   - AI summarizes the 50-page technical documentation into a 1-page executive summary.
3. **Verification:**
   - System checks "Eligibility Criteria": Is the applicant a registered sports club? (Yes) Is the budget within limits? (Yes).
   - **Risk Alert:** AI flags that the "Building Permit" date expires in 30 days.
4. **Decision Support:**
   - AI suggests: "Approve for Phase 1 verification".
   - AI drafts a formal letter to the applicant requesting the updated building permit.
5. **Outcome:** Officer reviews the draft, signs it digitally, and sends it. Time saved: 4 hours.

## Scenariusz 2: Kwalifikacje zawodowe w turystyce - przewodnik górski
**Aktor:** Orzecznik ds. kwalifikacji zawodowych
**Cel:** Weryfikacja odnowienia uprawnień przewodnika górskiego zgodnie z Ustawą o usługach turystycznych.

### Przebieg:
1. **Analiza wniosku:** System analizuje dokumenty: poprzednie uprawnienia, certyfikaty, zaświadczenia lekarskie
2. **Weryfikacja zgodności:** AI sprawdza zmiany w przepisach od ostatniego wydania uprawnień
3. **Ocena ryzyka:** System flaguje brak aktualnego zaświadczenia lekarskiego (wymagane co 5 lat)
4. **Projekt decyzji:** AI generuje wezwanie do uzupełnienia braków z podstawą prawną (Art. 64 KPA)
5. **Monitoring terminu:** System ustawia przypomnienie o 7-dniowym terminie na uzupełnienie

## Scenariusz 3: Kontrola podmiotu turystycznego - biuro podróży
**Aktor:** Główny Inspektor, Zespół Kontroli
**Cel:** Rozpatrzenie sprawy naruszenia obowiązków przez biuro podróży po kontroli.

### Przebieg:
1. **Analiza protokołu:** AI analizuje 40-stronicowy protokół kontroli i wyodrębnia kluczowe naruszenia
2. **Badanie precedensów:** System przeszukuje bazę 300 archiwalnych decyzji MSiT w podobnych sprawach
3. **Analiza prawna:** AI identyfikuje naruszenia Art. 15 i Art. 23 Ustawy o usługach turystycznych
4. **Ocena ryzyka:** System ocenia ryzyko zaskarżenia (średnie - 60%) na podstawie historii podobnych spraw
5. **Projekt kary:** AI proponuje karę 15.000 PLN z uzasadnieniem proporcjonalności i odstraszania
6. **Kontrola zgodności:** System weryfikuje czy kara mieści się w ustawowych limitach
