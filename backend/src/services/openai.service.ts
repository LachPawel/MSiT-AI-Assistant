import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPT = `Jesteś zaawansowanym asystentem AI dla orzeczników w Departamencie Turystyki Ministerstwa Sportu i Turystyki.

Specjalizujesz się w sprawach dotyczących:
- Nadawania kategorii hotelom i obiektom noclegowym
- Licencji i uprawnień zawodowych w turystyce (piloci wycieczek, przewodnicy)
- Kontroli podmiotów turystycznych (biura podróży, organizatorzy turystyki)
- Regulacji rynku turystycznego
- Postępowań administracyjnych zgodnie z KPA

Twoje zadania:
1. Analiza merytoryczna wniosków i dokumentacji procesowej
2. Weryfikacja zgodności z przepisami (Ustawa o usługach turystycznych, Rozporządzenie o obiektach hotelarskich)
3. Identyfikacja ryzyk prawnych i proceduralnych
4. Generowanie projektów decyzji administracyjnych z pełnym uzasadnieniem prawnym
5. Monitorowanie terminów ustawowych i przypominanie o ważnych datach

Zasady działania:
- Zawsze cytuj konkretne podstawy prawne (artykuł, ustawa, rozporządzenie)
- Bądź bezstronny i obiektywny zgodnie z zasadami KPA
- Używaj profesjonalnego języka urzędowego polskiego
- Zwracaj uwagę na terminy ustawowe (30 dni KPA, szczególne terminy branżowe)
- Chroń dane osobowe - nie ujawniaj danych wrażliwych w analizach
- Pamiętaj o zasadzie proporcjonalności kar i środków administracyjnych`;

export async function classifyCase(caseDescription: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Sklasyfikuj następujący wniosek/sprawę turystyczną i wyodrębnij kluczowe informacje:\n\n${caseDescription}\n\nZwróć w formacie JSON: {category: "permits|licenses|funding|other", keywords: string[], extractedDetails: {entity_name?: string, location?: string, category?: string, amount?: number, urgency?: string, tourism_type?: string}}`
      }
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}

export async function analyzeRisk(caseDetails: any, procedure: any) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Przeanalizuj ryzyka dla poniższej sprawy turystycznej w kontekście procedury MSiT.\n\nSprawa: ${JSON.stringify(caseDetails)}\nProcedura: ${JSON.stringify(procedure)}\n\nOceń ryzyko prawne, proceduralne i merytoryczne. Zwróć JSON: { risk_score: number (0.0-1.0), risk_flags: string[], reasoning: string, missing_documents: string[], recommended_action: string, legal_compliance_issues: string[] }`
      }
    ],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content || '{}');
}

export async function generateDraftDecision(caseDetails: any, procedure: any, analysis: any) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Wygeneruj projekt decyzji administracyjnej dla sprawy turystycznej.\n\nSprawa: ${JSON.stringify(caseDetails)}\nProcedura: ${JSON.stringify(procedure)}\nAnaliza ryzyka: ${JSON.stringify(analysis)}\n\nUtwórz pełną treść decyzji zgodną z wymogami KPA zawierającą: oznaczenie organu, dane stron, rozstrzygnięcie, uzasadnienie z podstawą prawną, pouczenie o odwołaniu. Zwróć JSON: { draft_content: string, legal_basis_analysis: string, recommendations_for_officer: string }`
      }
    ],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(completion.choices[0].message.content || '{}');
}

export async function generateGuidance(
  caseDetails: any,
  procedure: any,
  conversationHistory: ChatCompletionMessageParam[] = []
) {
  const messages: ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: `Wniosek: ${JSON.stringify(caseDetails)}\n\nProcedura: ${JSON.stringify(procedure)}\n\nWygeneruj szczegółowe wskazówki dla urzędnika.`,
    },
    ...conversationHistory,
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
  });

  return completion.choices[0].message.content;
}

export { openai };

