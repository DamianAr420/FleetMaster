<script setup lang="ts">
import { ref } from "vue";
import Navigation from "@/components/NavBar.vue";

const isMobileMenuOpen = ref(false);
const isCollapsed = ref(true);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex overflow-x-hidden">
    <aside
      class="hidden md:flex fixed inset-y-0 z-99 transition-all duration-300 ease-in-out"
      :class="[isCollapsed ? 'w-20' : 'w-72']"
    >
      <Navigation
        :is-collapsed="isCollapsed"
        @toggle="toggleSidebar"
        @link-clicked="isMobileMenuOpen = false"
      />
    </aside>

    <header
      class="md:hidden fixed top-0 w-full h-16 bg-slate-900 flex items-center justify-between px-4 z-30 shadow-lg"
    >
      <h1
        class="text-xl font-black text-blue-400 italic uppercase tracking-tighter"
      >
        FleetMaster
      </h1>
      <button
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        class="text-white p-2 bg-slate-800 rounded-xl active:scale-95 transition-transform"
      >
        <span v-if="!isMobileMenuOpen" class="text-xl">☰</span>
        <span v-else class="text-xl">✕</span>
      </button>
    </header>

    <transition name="slide">
      <aside
        v-if="isMobileMenuOpen"
        class="md:hidden fixed inset-y-0 left-0 w-70 max-w-[80%] z-50 shadow-2xl"
      >
        <Navigation
          :is-collapsed="false"
          @link-clicked="isMobileMenuOpen = false"
        />
      </aside>
    </transition>

    <main
      class="flex-1 w-full min-w-0 transition-all duration-300 ease-in-out"
      :class="[isCollapsed ? 'md:ml-20' : 'md:ml-72', 'pt-16 md:pt-0']"
    >
      <div class="w-full h-full">
        <slot />
      </div>
    </main>

    <div
      v-if="isMobileMenuOpen"
      @click="isMobileMenuOpen = false"
      class="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
    ></div>
  </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
