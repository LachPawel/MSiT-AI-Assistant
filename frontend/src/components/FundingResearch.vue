<template>
  <div class="bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold">Dostępne Dofinansowania</h2>
      </div>
      <button
        @click="loadResearch"
        :disabled="loading"
        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg
          v-if="!loading"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        {{ loading ? 'Wyszukiwanie...' : 'Wyszukaj Programy' }}
      </button>
    </div>

    <div v-if="loading && !opportunities.length" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      <p class="mt-2 text-gray-600">Wyszukiwanie dostępnych programów dofinansowania...</p>
    </div>

    <div v-else-if="opportunities.length === 0 && !loading" class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p>Kliknij "Wyszukaj Programy" aby znaleźć dostępne dofinansowania</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="(opportunity, index) in opportunities"
        :key="index"
        :class="[
          'border rounded-lg p-5 hover:shadow-md transition',
          opportunity.is_expired
            ? 'border-red-300 bg-red-50'
            : 'border-gray-200',
        ]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ opportunity.name }}
              </h3>
              <span
                v-if="opportunity.is_expired"
                class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium"
              >
                ⚠️ Przedawnione
              </span>
            </div>
          </div>
          <span
            v-if="opportunity.relevance_score"
            :class="[
              'px-2 py-1 text-xs rounded-full font-medium',
              opportunity.is_expired
                ? 'bg-gray-100 text-gray-600'
                : 'bg-green-100 text-green-800',
            ]"
          >
            {{ Math.round(opportunity.relevance_score * 100) }}% dopasowanie
          </span>
        </div>

        <!-- Justification -->
        <div
          v-if="opportunity.justification"
          class="mb-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500"
        >
          <p class="text-xs font-semibold text-blue-900 mb-1">Uzasadnienie dopasowania:</p>
          <p class="text-sm text-blue-800 leading-relaxed">
            {{ opportunity.justification }}
          </p>
        </div>

        <p v-if="opportunity.description" class="text-gray-700 mb-3 text-sm leading-relaxed">
          {{ opportunity.description }}
        </p>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div v-if="opportunity.amount_range" class="flex items-start gap-2">
            <svg class="w-5 h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="text-xs text-gray-500">Kwota</p>
              <p class="text-sm font-medium text-gray-900">{{ opportunity.amount_range }}</p>
            </div>
          </div>

          <div v-if="opportunity.deadline" class="flex items-start gap-2">
            <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p class="text-xs text-gray-500">Termin</p>
              <p class="text-sm font-medium text-gray-900">{{ opportunity.deadline }}</p>
            </div>
          </div>
        </div>

        <div v-if="opportunity.eligibility_criteria" class="mb-3">
          <p class="text-xs text-gray-500 mb-1">Kryteria kwalifikacji:</p>
          <p class="text-sm text-gray-700">{{ opportunity.eligibility_criteria }}</p>
        </div>

        <div v-if="opportunity.contact_info" class="mb-3">
          <p class="text-xs text-gray-500 mb-1">Kontakt:</p>
          <p class="text-sm text-gray-700">{{ opportunity.contact_info }}</p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <a
            v-if="opportunity.source_url"
            :href="opportunity.source_url"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Zobacz źródło
          </a>
          <span v-if="opportunity.url" class="text-xs text-gray-500">
            {{ opportunity.url }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCasesStore } from '../stores/cases';

const props = defineProps<{
  caseId: string;
}>();

const casesStore = useCasesStore();
const opportunities = ref<any[]>([]);
const loading = ref(false);

async function loadResearch() {
  loading.value = true;
  try {
    const response = await casesStore.researchFunding(props.caseId);
    opportunities.value = response.opportunities || [];
  } catch (error) {
    console.error('Error loading funding research:', error);
    alert('Błąd podczas wyszukiwania programów dofinansowania');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  // Optionally auto-load on mount
  // loadResearch();
});
</script>

