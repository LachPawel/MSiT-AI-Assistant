<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Moje Wnioski</h1>
        <p class="text-gray-600">Zarządzaj swoimi wnioskami administracyjnymi</p>
      </div>
      <router-link to="/" class="btn-primary flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Nowy Wniosek
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600">Ładowanie wniosków...</p>
    </div>

    <div v-else-if="cases.length === 0" class="text-center py-16">
      <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p class="text-gray-600 text-lg mb-4">Nie masz jeszcze żadnych wniosków</p>
      <router-link to="/" class="btn-primary inline-flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Utwórz pierwszy wniosek
      </router-link>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="caseItem in cases"
        :key="caseItem.id"
        class="card card-hover p-6 cursor-pointer group"
        @click="$router.push(`/cases/${caseItem.id}`)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-3">
              <h2 class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {{ caseItem.title }}
              </h2>
              <StatusBadge :status="caseItem.status" />
            </div>
            <p class="text-gray-600 mb-4 line-clamp-2">{{ caseItem.description }}</p>
            <div class="flex flex-wrap gap-4 text-sm">
              <span v-if="caseItem.procedures" class="flex items-center gap-1.5 text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ caseItem.procedures.name }}
              </span>
              <span class="flex items-center gap-1.5 text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ formatDate(caseItem.created_at) }}
              </span>
              <span v-if="caseItem.category" class="badge bg-gray-100 text-gray-700">
                {{ getCategoryLabel(caseItem.category) }}
              </span>
            </div>
          </div>
          <div class="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useCasesStore } from '../stores/cases';
import StatusBadge from '../components/StatusBadge.vue';

const casesStore = useCasesStore();
const cases = ref<any[]>([]);
const loading = ref(true);

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    funding: 'Dofinansowanie',
    permits: 'Pozwolenia',
    licenses: 'Licencje',
    other: 'Inne',
  };
  return labels[category] || category;
}

onMounted(async () => {
  await casesStore.fetchCases();
  cases.value = casesStore.cases;
  loading.value = false;
});
</script>

