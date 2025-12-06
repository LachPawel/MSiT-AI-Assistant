<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="card p-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Nowy Wniosek</h2>
          <p class="text-gray-600">Wypełnij formularz, a AI pomoże w analizie</p>
        </div>
        <router-link to="/cases" class="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Powrót
        </router-link>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-700">
            Tytuł wniosku
          </label>
          <input
            v-model="form.title"
            type="text"
            class="input-modern"
            placeholder="np. Hotel Marriott prosi o nadanie kategorii 4-gwiazdkowej"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-700">
            Szczegółowy opis
          </label>
          <textarea
            v-model="form.description"
            class="input-modern resize-none"
            rows="10"
            placeholder="Opisz szczegóły wniosku: infrastruktura, usługi, standardy, dokumentacja..."
            required
          ></textarea>
          <p class="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Im więcej szczegółów, tym lepsza analiza AI i wykrywanie programów dofinansowania
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              Nazwa podmiotu
            </label>
            <input
              v-model="form.applicant_name"
              type="text"
              class="input-modern"
              placeholder="np. Hotel Marriott Sp. z o.o."
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              NIP
            </label>
            <input
              v-model="form.applicant_nip"
              type="text"
              class="input-modern"
              placeholder="1234567890"
            />
          </div>
        </div>

        <div class="pt-4">
          <button
            type="submit"
            class="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-3">
              <span class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              Przetwarzanie przez AI...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Utwórz i Analizuj z AI
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCasesStore } from '../stores/cases';
import { useRouter } from 'vue-router';

const casesStore = useCasesStore();
const router = useRouter();
const loading = ref(false);

const form = ref({
  title: '',
  description: '',
  applicant_name: '',
  applicant_nip: '',
});

async function handleSubmit() {
  loading.value = true;
  try {
    const newCase = await casesStore.createCase({
      title: form.value.title,
      description: form.value.description,
      applicant_details: {
        name: form.value.applicant_name,
        nip: form.value.applicant_nip,
      },
      user_id: 'demo-user', // Replace with actual auth
    });

    // Analyze immediately
    await casesStore.analyzeCase(newCase.id);

    router.push(`/cases/${newCase.id}`);
  } catch (error) {
    console.error('Error:', error);
    alert('Błąd podczas tworzenia wniosku');
  } finally {
    loading.value = false;
  }
}
</script>

