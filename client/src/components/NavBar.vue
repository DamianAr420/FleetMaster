<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import { computed } from "vue";

const props = defineProps<{
  isCollapsed: boolean;
}>();

const emit = defineEmits(["toggle", "link-clicked"]);
const router = useRouter();
const userStore = useUserStore();

const menuGroups = [
  {
    title: "Zarządzanie",
    role: "Admin",
    items: [
      { name: "Dashboard", path: "/dashboard", icon: "📊" },
      { name: "Pojazdy", path: "/vehicles", icon: "🚛" },
      { name: "Kierowcy", path: "/drivers", icon: "👤" },
      { name: "Usterki", path: "/issues", icon: "🛠️" },
    ],
  },
  {
    title: "Panel Kierowcy",
    role: "Driver",
    items: [
      { name: "Mój Dashboard", path: "/driver-dashboard", icon: "🏠" },
      { name: "Zgłoś usterkę", path: "/report-issue", icon: "📝" },
      { name: "Dziennik", path: "/note", icon: "🗓️" },
    ],
  },
];

const filteredGroups = computed(() => {
  return menuGroups
    .filter((group) => {
      if (group.role === "Admin") return userStore.isAdmin;
      if (group.role === "Driver") return userStore.isDriver;
      return false;
    })
    .map((group) => ({
      ...group,
      items: group.items,
    }));
});

const handleLogout = () => {
  userStore.logout();
  router.push("/login");
};
</script>

<template>
  <div
    class="flex flex-col h-full bg-slate-900 text-white border-r border-slate-800 w-full relative"
  >
    <button
      @click="emit('toggle')"
      class="hidden md:flex absolute -right-5 top-8 w-10 h-10 bg-blue-600 rounded-xl items-center justify-center border-2 border-white z-50 hover:scale-110 active:scale-95 transition-all shadow-[0_4px_20px_rgba(37,99,235,0.4)] cursor-pointer"
    >
      <span
        class="text-2xl font-black text-white transition-transform duration-300"
        :class="[isCollapsed ? '-rotate-90' : 'rotate-90']"
      >
        <span>V</span>
      </span>
    </button>

    <div
      class="p-6 transition-all duration-300"
      :class="[isCollapsed ? 'items-center px-2 flex justify-center' : 'p-10']"
    >
      <h1
        class="font-black italic text-blue-400 uppercase leading-none truncate"
      >
        <span v-if="!isCollapsed"
          >Fleet<span class="text-white">Master</span></span
        >
        <span v-else class="text-xl">FM</span>
      </h1>
    </div>

    <nav class="flex-1 px-3 space-y-8 overflow-y-auto custom-scrollbar">
      <div v-for="group in filteredGroups" :key="group.title">
        <p
          v-if="!isCollapsed"
          class="px-4 mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]"
        >
          {{ group.title }}
        </p>

        <div v-else class="h-px bg-slate-800 mx-2 mb-4"></div>

        <div class="space-y-2">
          <router-link
            v-for="item in group.items"
            :key="item.path"
            :to="item.path"
            @click="emit('link-clicked')"
            class="flex items-center rounded-2xl transition-all group border border-transparent overflow-hidden h-12"
            :class="[
              isCollapsed
                ? 'justify-center w-12 mx-auto'
                : 'px-4 space-x-4 w-full',
            ]"
            active-class="bg-blue-600 text-white shadow-xl shadow-blue-600/40 border-blue-500"
          >
            <span
              class="text-xl shrink-0 group-hover:scale-110 transition-transform"
            >
              {{ item.icon }}
            </span>
            <span
              v-if="!isCollapsed"
              class="font-black uppercase text-[10px] tracking-widest truncate"
            >
              {{ item.name }}
            </span>
          </router-link>
        </div>
      </div>
    </nav>

    <div
      class="p-4 bg-slate-950/40 border-t border-slate-800 transition-all duration-300"
    >
      <div
        class="flex items-center mb-6"
        :class="[isCollapsed ? 'justify-center' : 'space-x-4 px-2']"
      >
        <div
          class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center font-black text-lg shadow-lg shrink-0"
        >
          {{ userStore.user?.charAt(0).toUpperCase() }}
        </div>
        <div v-if="!isCollapsed" class="flex flex-col truncate">
          <span class="text-sm font-black truncate uppercase tracking-tight">
            {{ userStore.user }}
          </span>
          <span
            class="text-[9px] text-blue-400 font-black uppercase tracking-widest"
          >
            {{
              userStore.isAdmin && userStore.isDriver
                ? "Admin + Kierowca"
                : userStore.userRoles.join(", ")
            }}
          </span>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full h-10 flex items-center justify-center rounded-xl bg-red-600/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 shadow-lg shadow-red-500/5"
      >
        <span
          v-if="!isCollapsed"
          class="text-[10px] font-black uppercase tracking-widest"
          >Wyloguj</span
        >
        <span v-else>✕</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.router-link-active span {
  transform: scale(1.1);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
</style>
