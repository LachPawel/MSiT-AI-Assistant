<template>
  <div v-if="caseData" class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <router-link
          to="/cases"
          class="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Powrót do listy
        </router-link>
        <StatusBadge :status="caseData.status" />
      </div>
      <h1 class="text-4xl font-bold mb-3">{{ caseData.title }}</h1>
      <p class="text-gray-600 text-lg leading-relaxed">{{ caseData.description }}</p>
      <div v-if="caseData.applicant_details?.name" class="mt-4 flex gap-4 text-sm text-gray-500">
        <span>👤 {{ caseData.applicant_details.name }}</span>
        <span v-if="caseData.applicant_details.nip">📋 NIP: {{ caseData.applicant_details.nip }}</span>
        <span>📅 {{ formatDate(caseData.created_at) }}</span>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column: AI Analysis -->
      <div class="lg:col-span-2 space-y-6">
        <!-- AI Analysis Card -->
        <div v-if="analysis" class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center gap-2 mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h2 class="text-2xl font-bold">Analiza AI</h2>
          </div>
          
          <div class="space-y-6">
            <div v-if="procedure" class="bg-blue-50 rounded-lg p-4">
              <h3 class="font-semibold text-blue-900 mb-2">Dopasowana procedura:</h3>
              <p class="text-blue-800 font-medium">{{ procedure.name }}</p>
              <p v-if="procedure.description" class="text-sm text-blue-700 mt-2">{{ procedure.description }}</p>
            </div>

            <div v-if="procedure?.required_documents?.length" class="bg-amber-50 rounded-lg p-4">
              <h3 class="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Wymagane dokumenty:
              </h3>
              <ul class="space-y-2">
                <li v-for="(doc, index) in procedure.required_documents" :key="index" class="flex items-start gap-2">
                  <span class="text-amber-600 mt-1">✓</span>
                  <span class="text-amber-800">{{ doc }}</span>
                </li>
              </ul>
            </div>

            <div v-if="analysis.reasoning" class="bg-gray-50 rounded-lg p-4">
              <h3 class="font-semibold text-gray-900 mb-3">Szczegółowe wskazówki:</h3>
              <div class="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{{ analysis.reasoning }}</div>
            </div>

            <div v-if="analysis.confidence_score" class="text-xs text-gray-500">
              Poziom pewności: {{ Math.round(analysis.confidence_score * 100) }}%
            </div>
          </div>
        </div>

        <!-- Procedure Steps -->
        <div v-if="procedure?.steps?.length" class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-4">Kroki procedury</h2>
          <div class="space-y-4">
            <div
              v-for="(step, index) in procedure.steps"
              :key="index"
              class="flex gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <div class="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {{ step.step || index + 1 }}
              </div>
              <div class="flex-1">
                <p class="font-medium">{{ step.action }}</p>
                <p v-if="step.days" class="text-sm text-gray-500 mt-1">
                  Czas realizacji: {{ step.days }} dni
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Funding Research -->
        <FundingResearch :case-id="caseId" />
      </div>

      <!-- Right Column: Chat -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-lg p-6 h-full">
          <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Czat z Asystentem
          </h2>
          <ChatInterface :case-id="caseId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { api } from '../config/api';
import ChatInterface from '../components/ChatInterface.vue';
import StatusBadge from '../components/StatusBadge.vue';
import FundingResearch from '../components/FundingResearch.vue';

const route = useRoute();
const caseId = route.params.id as string;

const caseData = ref<any>(null);
const analysis = ref<any>(null);
const procedure = ref<any>(null);

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

onMounted(async () => {
  const response = await api.get(`/cases/${caseId}`);
  caseData.value = response.data;
  
  if (response.data.ai_analyses?.length > 0) {
    analysis.value = response.data.ai_analyses[0];
  }
  
  if (response.data.procedures) {
    procedure.value = response.data.procedures;
  }
});
</script>

