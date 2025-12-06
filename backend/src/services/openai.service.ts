import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPT = `Jesteś asystentem AI dla Ministerstwa Sportu i Turystyki w Polsce.

Twoja rola:
- Analizuj wnioski administracyjne składane przez pracowników ministerstwa
- Dopasuj wnioski do odpowiednich procedur
- Prowadź urzędników przez wymagane kroki
- Identyfikuj brakującą dokumentację
- Sygnalizuj potencjalne problemy z zgodnością

Dostępne procedury: dofinansowanie infrastruktury sportowej, pozwolenia budowlane, licencje na imprezy, certyfikaty turystyczne.

Podczas analizy wniosku:
1. Wyodrębnij kluczowe szczegóły (typ, kwoty, lokalizacje, daty)
2. Wyszukaj pasujące procedury
3. Sprawdź kryteria kwalifikacyjne
4. Dostarcz instrukcje krok po kroku
5. Wymień wszystkie wymagane dokumenty
6. Podkreśl wszelkie ryzyka lub opóźnienia

Bądź precyzyjny, profesjonalny i cytuj konkretne przepisy, gdy to właściwe.`;

export async function classifyCase(caseDescription: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Sklasyfikuj następujący wniosek i wyodrębnij kluczowe informacje:\n\n${caseDescription}\n\nZwróć w formacie JSON: {category, keywords, extractedDetails}`,
      },
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

