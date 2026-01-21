<template>
  <div class="fixed bottom-5 right-5 flex flex-col gap-4 z-99">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="px-4 py-3 rounded-lg text-white font-medium shadow-2xl"
      :class="[
        toast.leaving
          ? 'animate-[fadeout_0.2s_ease-in_forwards]'
          : 'animate-[fadein_0.5s_ease-out]',
        toast.type === 'success' ? 'bg-green-500' : '',
        toast.type === 'error' ? 'bg-red-500' : '',
        toast.type === 'info' ? 'bg-blue-500' : '',
      ]"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "../composables/useToast";
const { toasts } = useToast();
</script>

<style>
@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeout {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(800px) scale(0.96);
  }
}
</style>
