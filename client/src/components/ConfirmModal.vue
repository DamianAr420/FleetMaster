<script setup lang="ts">
const props = defineProps<{
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}>();

defineEmits(["close", "confirm"]);
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-99"
  >
    <div
      class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm animate-[fadein_0.25s_ease-out]"
    >
      <h2 class="text-xl font-black text-slate-800 mb-4">
        {{ props.title || "Potwierdzenie" }}
      </h2>

      <p
        class="text-slate-600 text-sm mb-8 leading-relaxed"
        v-html="props.message || 'Czy na pewno chcesz wykonać tę operację?'"
      ></p>

      <div class="flex justify-end space-x-4">
        <button
          @click="$emit('close')"
          class="px-5 py-2.5 rounded-xl font-black text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          {{ props.cancelText || "Anuluj" }}
        </button>

        <button
          @click="$emit('confirm')"
          class="px-5 py-2.5 rounded-xl font-black text-white bg-red-600 hover:bg-red-700 shadow-xl shadow-red-600/20 transition-all"
        >
          {{ props.confirmText || "Potwierdź" }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes fadein {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
