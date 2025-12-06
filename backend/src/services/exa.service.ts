import Exa from 'exa-js';
import dotenv from 'dotenv';

dotenv.config();

const exa = new Exa(process.env.EXA_API_KEY);

export async function researchProcedures(query: string) {
  try {
    const result = await exa.searchAndContents(query, {
      type: 'neural',
      useAutoprompt: true,
      numResults: 5,
      text: true,
    });

    return result.results;
  } catch (error) {
    console.error('Exa search error:', error);
    throw error;
  }
}

// Research Polish administrative procedures
export async function researchPolishProcedures() {
  const queries = [
    'Ministerstwo Sportu i Turystyki dofinansowanie obiektów sportowych procedura',
    'MSiT dotacje infrastruktura sportowa wymagane dokumenty',
    'pozwolenie na budowę obiekt sportowy Polska procedura',
    'MSiT licencja impreza masowa sport wymagania',
    'dofinansowanie klubu sportowego MSiT kryteria kwalifikacyjne',
  ];

  const allResults = [];

  for (const query of queries) {
    console.log(`🔍 Researching: ${query}`);
    const results = await researchProcedures(query);
    allResults.push(...results);
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return allResults;
}

// Research funding opportunities based on case details
export async function researchFundingOpportunities(caseDetails: {
  title: string;
  description: string;
  category?: string;
}) {
  const queries = [
    `MSiT dofinansowanie ${caseDetails.category || 'sport'} ${caseDetails.title}`,
    `programy dofinansowania infrastruktura sportowa Polska 2024`,
    `dotacje MSiT kluby sportowe obiekty sportowe`,
    `dofinansowanie budowa hala sportowa Polska`,
    `fundusze sportowe MSiT dotacje`,
  ];

  const allResults = [];

  for (const query of queries) {
    try {
      const results = await researchProcedures(query);
      allResults.push(...results);
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error researching: ${query}`, error);
    }
  }

  // Remove duplicates based on URL
  const uniqueResults = Array.from(
    new Map(allResults.map(item => [item.url, item])).values()
  );

  return uniqueResults.slice(0, 10); // Return top 10 results
}

export { exa };

