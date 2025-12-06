<template>
  <div class="max-w-3xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-3xl font-bold">Nowy Wniosek</h2>
        <router-link
          to="/cases"
          class="text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Powrót do listy
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
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="np. Klub sportowy prosi o dofinansowanie hali"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-700">
            Szczegółowy opis
          </label>
          <textarea
            v-model="form.description"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
            rows="8"
            placeholder="Opisz szczegóły wniosku, budżet, lokalizację, termin realizacji..."
            required
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            Im więcej szczegółów, tym lepsza analiza AI
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              Nazwa organizacji
            </label>
            <input
              v-model="form.applicant_name"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Nazwa organizacji"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold mb-2 text-gray-700">
              NIP
            </label>
            <input
              v-model="form.applicant_nip"
              type="text"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="NIP"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading" class="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
          {{ loading ? 'Przetwarzanie...' : 'Utwórz i Analizuj z AI' }}
        </button>
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

