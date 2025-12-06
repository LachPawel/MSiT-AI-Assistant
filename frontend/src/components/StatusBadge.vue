<template>
  <span
    :class="[
      'badge inline-flex items-center gap-1.5',
      statusClasses[status] || statusClasses.pending,
    ]"
  >
    <span class="inline-block w-1.5 h-1.5 rounded-full" :class="dotClasses[status]"></span>
    {{ statusLabels[status] || status }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  status: string;
}>();

const statusLabels: Record<string, string> = {
  pending: 'Oczekujący',
  in_review: 'W trakcie',
  approved: 'Zatwierdzony',
  rejected: 'Odrzucony',
  closed: 'Zamknięty',
};

const statusClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  in_review: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  closed: 'bg-gray-100 text-gray-700',
};

const dotClasses: Record<string, string> = {
  pending: 'bg-yellow-500',
  in_review: 'bg-blue-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  closed: 'bg-gray-500',
};
</script>

