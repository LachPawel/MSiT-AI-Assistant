<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-800">MSiT - Asystent AI</h1>
          </div>
          <div class="flex items-center gap-4">
            <router-link
              to="/cases"
              class="text-gray-600 hover:text-gray-900 font-medium transition"
              active-class="text-blue-600"
            >
              Wnioski
            </router-link>
            <router-link
              to="/"
              class="text-gray-600 hover:text-gray-900 font-medium transition"
              active-class="text-blue-600"
            >
              Nowy Wniosek
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

