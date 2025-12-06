<template>
  <div class="max-w-7xl mx-auto p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Panel Orzecznika</h1>
        <p class="text-gray-600">Przegląd i zarządzanie wnioskami administracyjnymi</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-secondary flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filtruj
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="card card-hover p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Oczekujące</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.pending }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card card-hover p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">W Trakcie</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.in_review }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card card-hover p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Zatwierdzone</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.approved }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="card card-hover p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500 mb-1">Odrzucone</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.rejected }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Priority Cases -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Sprawy Pilne
        </h2>
        <span class="text-sm text-gray-500">{{ priorityCases.length }} spraw</span>
      </div>

      <div v-if="priorityCases.length === 0" class="text-center py-8 text-gray-500">
        Brak pilnych spraw
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="caseItem in priorityCases"
          :key="caseItem.id"
          class="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100 hover:shadow-md transition-all duration-200 cursor-pointer"
          @click="$router.push(`/cases/${caseItem.id}`)"
        >
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <h3 class="font-semibold text-gray-900">{{ caseItem.title }}</h3>
              <span class="badge bg-red-100 text-red-700">Pilne</span>
            </div>
            <p class="text-sm text-gray-600 line-clamp-1">{{ caseItem.description }}</p>
            <div class="flex gap-4 mt-2 text-xs text-gray-500">
              <span>📅 {{ formatDate(caseItem.created_at) }}</span>
              <span v-if="caseItem.procedures">📋 {{ caseItem.procedures.name }}</span>
            </div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- All Cases Table -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-gray-900">Wszystkie Wnioski</h2>
        <div class="flex items-center gap-3">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Szukaj..."
              class="input-modern pl-10 pr-4 py-2 w-64"
            />
            <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Ładowanie...</p>
      </div>

      <div v-else-if="filteredCases.length === 0" class="text-center py-12 text-gray-500">
        Brak wniosków
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-200">
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Tytuł</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Procedura</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Ryzyko</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Data</th>
              <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="caseItem in filteredCases"
              :key="caseItem.id"
              class="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
              @click="$router.push(`/cases/${caseItem.id}`)"
            >
              <td class="py-4 px-4">
                <div class="font-medium text-gray-900">{{ caseItem.title }}</div>
                <div class="text-sm text-gray-500 line-clamp-1">{{ caseItem.description }}</div>
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ caseItem.procedures?.name || '-' }}
              </td>
              <td class="py-4 px-4">
                <StatusBadge :status="caseItem.status" />
              </td>
              <td class="py-4 px-4">
                <div v-if="caseItem.ai_analyses?.[0]?.risk_score !== undefined" class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all"
                      :class="getRiskColor(caseItem.ai_analyses[0].risk_score)"
                      :style="{ width: `${caseItem.ai_analyses[0].risk_score * 100}%` }"
                    ></div>
                  </div>
                  <span class="text-xs text-gray-600">
                    {{ Math.round(caseItem.ai_analyses[0].risk_score * 100) }}%
                  </span>
                </div>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ formatDate(caseItem.created_at) }}
              </td>
              <td class="py-4 px-4">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { api } from '../config/api';
import StatusBadge from '../components/StatusBadge.vue';

const cases = ref<any[]>([]);
const loading = ref(true);
const searchQuery = ref('');

const stats = computed(() => ({
  pending: cases.value.filter(c => c.status === 'pending').length,
  in_review: cases.value.filter(c => c.status === 'in_review').length,
  approved: cases.value.filter(c => c.status === 'approved').length,
  rejected: cases.value.filter(c => c.status === 'rejected').length,
}));

const priorityCases = computed(() => {
  return cases.value
    .filter(c => c.priority === 'high' || c.priority === 'urgent' || c.status === 'pending')
    .slice(0, 5);
});

const filteredCases = computed(() => {
  if (!searchQuery.value) return cases.value;
  const query = searchQuery.value.toLowerCase();
  return cases.value.filter(c =>
    c.title.toLowerCase().includes(query) ||
    c.description?.toLowerCase().includes(query) ||
    c.procedures?.name?.toLowerCase().includes(query)
  );
});

function getRiskColor(score: number): string {
  if (score > 0.7) return 'bg-red-500';
  if (score > 0.4) return 'bg-yellow-500';
  return 'bg-green-500';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

onMounted(async () => {
  try {
    const response = await api.get('/cases');
    cases.value = response.data;
  } catch (error) {
    console.error('Error loading cases:', error);
  } finally {
    loading.value = false;
  }
});
</script>
