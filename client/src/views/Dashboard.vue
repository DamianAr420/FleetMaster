<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useDriverStore } from "@/store/driverStore";
import { useVehicleStore } from "@/store/vehicleStore";
import type { Vehicle } from "@/store/vehicleStore"; // Importujemy interfejs
import MainLayout from "@/layouts/MainLayout.vue";

const driverStore = useDriverStore();
const vehicleStore = useVehicleStore();

onMounted(async () => {
  await Promise.all([driverStore.fetchDrivers(), vehicleStore.fetchVehicles()]);
});

const stats = computed(() => [
  {
    label: "Aktywni Kierowcy",
    value: driverStore.drivers.filter(
      (d) => d.status === "Dostępny" || d.status === "W trasie"
    ).length,
    icon: "👤",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Flota w trasie",
    value: driverStore.drivers.filter((d) => d.status === "W trasie").length,
    icon: "🚚",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    label: "Pojazdy Sprawne",
    value: (vehicleStore.vehicles as Vehicle[]).filter((v) => v.isOperational)
      .length,
    icon: "✅",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "Wymaga Uwagi",
    value: (vehicleStore.vehicles as Vehicle[]).filter((v) => !v.isOperational)
      .length,
    icon: "⚠️",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
]);

const recentDrivers = computed(() => {
  return [...driverStore.drivers].reverse().slice(0, 5);
});

const getStatusStyle = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "dostępny":
      return "bg-green-100 text-green-700 border-green-200";
    case "w trasie":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-slate-100 text-slate-500 border-slate-200";
  }
};
</script>

<template>
  <MainLayout>
    <div class="max-w-350 mx-auto w-full">
      <header
        class="bg-white border-b border-gray-200 px-6 lg:px-10 py-8 sticky top-0 z-10"
      >
        <h2 class="text-3xl font-black text-slate-800 tracking-tight uppercase">
          Dashboard
        </h2>
        <p class="text-sm text-slate-500 font-medium mt-1">
          Przegląd operacyjny floty FleetMaster
        </p>
      </header>

      <div class="p-6 lg:p-10 space-y-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm"
          >
            <div class="flex items-center justify-between mb-4">
              <div :class="[stat.bg, 'p-3 rounded-2xl text-2xl']">
                {{ stat.icon }}
              </div>
              <span
                class="text-[10px] font-black text-slate-400 uppercase tracking-widest"
                >Live</span
              >
            </div>
            <div class="text-4xl font-black text-slate-800 mb-1">
              {{ stat.value }}
            </div>
            <div
              class="text-[11px] font-black text-slate-400 uppercase tracking-widest"
            >
              {{ stat.label }}
            </div>
          </div>
        </div>

        <div
          class="bg-white rounded-4xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div
            class="px-8 py-6 border-b border-slate-100 flex items-center justify-between"
          >
            <h3
              class="text-sm font-black text-slate-800 uppercase tracking-widest"
            >
              Ostatni Kierowcy
            </h3>
            <router-link
              to="/drivers"
              class="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
              >Pełna lista →</router-link
            >
          </div>

          <div class="overflow-x-auto w-full">
            <table class="w-full text-left border-collapse">
              <thead class="bg-slate-50/50">
                <tr>
                  <th
                    class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"
                  >
                    Kierowca
                  </th>
                  <th
                    class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center"
                  >
                    Status
                  </th>
                  <th
                    class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right"
                  >
                    Licencja
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr
                  v-for="driver in recentDrivers"
                  :key="driver.id"
                  class="hover:bg-blue-50/40 transition-colors"
                >
                  <td class="px-8 py-5 flex items-center space-x-3">
                    <div
                      class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black uppercase text-slate-600"
                    >
                      {{ driver.firstName[0] }}{{ driver.lastName[0] }}
                    </div>
                    <span class="font-bold text-slate-800 text-xs uppercase"
                      >{{ driver.firstName }} {{ driver.lastName }}</span
                    >
                  </td>
                  <td class="px-8 py-5 text-center">
                    <span
                      :class="getStatusStyle(driver.status)"
                      class="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase border"
                    >
                      {{ driver.status }}
                    </span>
                  </td>
                  <td
                    class="px-8 py-5 text-right font-mono text-[10px] font-bold text-slate-400"
                  >
                    {{ driver.licenseNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<style scoped>
.rounded-4xl {
  border-radius: 2rem;
}
</style>
