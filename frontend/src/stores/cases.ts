import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../config/api';

export const useCasesStore = defineStore('cases', () => {
  const cases = ref([]);
  const currentCase = ref(null);
  const loading = ref(false);

  async function fetchCases() {
    loading.value = true;
    try {
      const response = await api.get('/cases');
      cases.value = response.data;
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      loading.value = false;
    }
  }

  async function createCase(caseData: any) {
    const response = await api.post('/cases', caseData);
    return response.data;
  }

  async function analyzeCase(caseId: string) {
    const response = await api.post(`/ai/analyze/${caseId}`);
    return response.data;
  }

  async function chatWithAI(caseId: string, message: string) {
    const response = await api.post(`/ai/chat/${caseId}`, { message });
    return response.data;
  }

  async function researchFunding(caseId: string) {
    const response = await api.post(`/research/funding/${caseId}`);
    return response.data;
  }

  return {
    cases,
    currentCase,
    loading,
    fetchCases,
    createCase,
    analyzeCase,
    chatWithAI,
    researchFunding,
  };
});

