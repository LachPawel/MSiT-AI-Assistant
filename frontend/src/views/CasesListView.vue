<template>
  <div class="max-w-7xl mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">Wnioski Administracyjne</h1>
      <router-link
        to="/"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        + Nowy Wniosek
      </router-link>
    </div>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2 text-gray-600">Ładowanie...</p>
    </div>

    <div v-else-if="cases.length === 0" class="text-center py-12">
      <p class="text-gray-600 text-lg">Brak wniosków</p>
      <router-link to="/" class="text-blue-600 hover:underline mt-2 inline-block">
        Utwórz pierwszy wniosek
      </router-link>
    </div>

    <div v-else class="grid gap-4">
      <div
        v-for="caseItem in cases"
        :key="caseItem.id"
        class="bg-white rounded-lg shadow hover:shadow-md transition p-6 cursor-pointer"
        @click="$router.push(`/cases/${caseItem.id}`)"
      >
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="text-xl font-semibold">{{ caseItem.title }}</h2>
              <StatusBadge :status="caseItem.status" />
            </div>
            <p class="text-gray-600 mb-3 line-clamp-2">{{ caseItem.description }}</p>
            <div class="flex gap-4 text-sm text-gray-500">
              <span v-if="caseItem.procedures">
                📋 {{ caseItem.procedures.name }}
              </span>
              <span>📅 {{ formatDate(caseItem.created_at) }}</span>
              <span v-if="caseItem.category">
                🏷️ {{ getCategoryLabel(caseItem.category) }}
              </span>
            </div>
          </div>
          <div class="ml-4">
            <svg
              class="w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
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

