<template>
  <div class="flex flex-col h-[600px] border border-gray-200 rounded-lg overflow-hidden">
    <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      <div v-if="messages.length === 0" class="text-center text-gray-500 py-8">
        <svg class="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p>Zacznij rozmowę z asystentem AI</p>
        <p class="text-sm mt-2">Zadaj pytanie o wniosek lub procedurę</p>
      </div>
      <div
        v-for="msg in messages"
        :key="msg.id"
        :class="[
          'flex gap-3',
          msg.role === 'user' ? 'justify-end' : 'justify-start',
        ]"
      >
        <div
          v-if="msg.role === 'assistant'"
          class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div
          :class="[
            'rounded-lg px-4 py-3 max-w-[85%]',
            msg.role === 'user'
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-800',
          ]"
        >
          <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ msg.content }}</p>
        </div>
        <div
          v-if="msg.role === 'user'"
          class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>
      <div v-if="loading" class="flex justify-start gap-3">
        <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg px-4 py-3">
          <div class="flex gap-1">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-gray-200 bg-white p-4">
      <form @submit.prevent="sendMessage" class="flex gap-2">
        <input
          v-model="input"
          type="text"
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Zadaj pytanie..."
          :disabled="loading"
        />
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          :disabled="!input.trim() || loading"
        >
          <span v-if="!loading">Wyślij</span>
          <span v-else class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
        </button>
      </form>
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
const messages = ref<any[]>([]);
const input = ref('');
const loading = ref(false);

async function sendMessage() {
  if (!input.value.trim()) return;

  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: input.value,
  };

  messages.value.push(userMessage);
  const question = input.value;
  input.value = '';
  loading.value = true;

  try {
    const response = await casesStore.chatWithAI(props.caseId, question);
    messages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: response.response,
    });
  } catch (error) {
    console.error('Chat error:', error);
  } finally {
    loading.value = false;
  }
}
</script>

