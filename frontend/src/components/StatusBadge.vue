<template>
  <span
    :class="[
      'px-3 py-1 rounded-full text-xs font-semibold',
      statusClasses[status] || statusClasses.pending,
    ]"
  >
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
  approved: 'Zaakceptowany',
  rejected: 'Odrzucony',
};

const statusClasses: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
</script>

