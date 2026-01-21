<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import MainLayout from "@/layouts/MainLayout.vue";
import LogModal from "@/components/LogModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useLogStore } from "@/store/logStore";
import { useDriverStore } from "@/store/driverStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { useToast } from "@/composables/useToast";
import { storeToRefs } from "pinia";

const logStore = useLogStore();
const driverStore = useDriverStore();
const vehicleStore = useVehicleStore();

const { logs, loading } = storeToRefs(logStore);
const { driverProfile } = storeToRefs(driverStore);
const { showToast } = useToast();

const isModalOpen = ref(false);
const selectedLog = ref<any | null>(null);
const isDeleteConfirmOpen = ref(false);
const logToDelete = ref<number | null>(null);

onMounted(async () => {
  await vehicleStore.fetchVehicles();
  await logStore.fetchLogs();
  await driverStore.fetchMyProfile();
});

const getVehicleIconById = (vehicleId: number) => {
  const vehicle = vehicleStore.vehicles.find((v) => v.id === vehicleId);
  if (!vehicle) return "🚚";
  const type = vehicle.type?.toLowerCase();
  if (type === "truck") return "🚛";
  if (type === "car") return "🚗";
  if (type === "van") return "🚐";
  return "🚚";
};

const openAdd = () => {
  selectedLog.value = null;
  isModalOpen.value = true;
};
const openEdit = (log: any) => {
  selectedLog.value = log;
  isModalOpen.value = true;
};
const openDeleteConfirm = (logId: number) => {
  logToDelete.value = logId;
  isDeleteConfirmOpen.value = true;
};
const confirmDelete = async () => {
  if (!logToDelete.value) return;
  try {
    await logStore.deleteLog(logToDelete.value);
    showToast("Trasa została usunięta", "success");
  } catch (err: any) {
    showToast(err.message, "error");
  } finally {
    isDeleteConfirmOpen.value = false;
    logToDelete.value = null;
  }
};

const handleSave = async (formData: any) => {
  try {
    if (selectedLog.value) {
      await logStore.updateLog(selectedLog.value.id, formData);
      showToast("Trasa została zaktualizowana", "info");
    } else {
      await logStore.addLog(formData);
      showToast("Trasa została dodana", "success");
    }
    isModalOpen.value = false;
  } catch (err: any) {
    showToast(err.message, "error");
  }
};

const totalDistance = computed(() =>
  logs.value.reduce((acc, curr) => acc + (curr.distanceKm || 0), 0)
);
</script>

<template>
  <MainLayout>
    <div class="max-w-7xl mx-auto w-full min-h-screen bg-slate-50">
      <header
        class="bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 lg:px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sticky top-0 z-20"
      >
        <div class="min-w-0">
          <h2
            class="text-3xl font-black text-slate-800 tracking-tight uppercase italic"
          >
            Dziennik <span class="text-blue-600">Tras</span>
          </h2>
          <div class="flex items-center gap-4 mt-1">
            <p
              class="text-sm text-slate-500 font-bold uppercase tracking-wider"
            >
              Suma: <span class="text-slate-900">{{ totalDistance }} km</span>
            </p>
            <span class="text-slate-300">|</span>
            <p
              v-if="loading"
              class="text-xs text-blue-500 animate-pulse font-bold uppercase tracking-widest"
            >
              Ładowanie danych...
            </p>
            <p v-else class="text-sm text-slate-500 font-medium">
              Trasy: {{ logs.length }}
            </p>
          </div>
        </div>

        <button
          @click="openAdd"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center space-x-3 shrink-0"
        >
          <span class="text-xl">+</span>
          <span class="uppercase tracking-widest text-sm">Dodaj trasę</span>
        </button>
      </header>

      <main class="p-6 lg:p-10">
        <div v-if="logs.length > 0" class="grid gap-4">
          <div
            v-for="log in logs"
            :key="log.id"
            class="bg-white border border-slate-200 p-6 rounded-4xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all group"
          >
            <div class="flex items-center gap-6">
              <div
                class="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors"
              >
                {{ getVehicleIconById(log.vehicleId) }}
              </div>
              <div>
                <span
                  class="text-slate-400 font-black text-[10px] uppercase tracking-widest"
                  >{{ new Date(log.date).toLocaleDateString() }}</span
                >
                <h3 class="text-xl font-black text-slate-800 uppercase italic">
                  {{ log.routeFrom }} → {{ log.routeTo }}
                </h3>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div
                class="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
              >
                <p class="text-[8px] font-black text-slate-400 uppercase">
                  Dystans
                </p>
                <p class="font-black text-slate-700">{{ log.distanceKm }} km</p>
              </div>
              <div
                class="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
              >
                <p class="text-[8px] font-black text-slate-400 uppercase">
                  Czas
                </p>
                <p class="font-black text-slate-700">{{ log.duration }}</p>
              </div>
              <div class="flex items-center gap-2 ml-4">
                <button
                  @click="openEdit(log)"
                  class="p-3 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
                >
                  ✏️
                </button>
                <button
                  @click="openDeleteConfirm(log.id!)"
                  class="p-3 hover:bg-red-50 rounded-xl text-slate-400 hover:text-red-600 transition-all"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else-if="!loading"
          class="text-center py-20 border-4 border-dashed border-slate-200 rounded-[3rem]"
        >
          <p class="text-slate-400 font-black uppercase tracking-widest">
            Brak zapisanych tras
          </p>
        </div>
      </main>

      <LogModal
        v-if="driverProfile"
        :is-open="isModalOpen"
        :editing-log="selectedLog"
        :loading="loading"
        :driver-id="driverProfile.id"
        :vehicle-id="driverProfile.assignedVehicleId || 0"
        @close="isModalOpen = false"
        @save="handleSave"
      />

      <ConfirmModal
        :is-open="isDeleteConfirmOpen"
        title="Usuń trasę"
        message="Czy na pewno chcesz usunąć tę trasę? <br> Tej operacji nie można cofnąć."
        confirm-text="Usuń"
        cancel-text="Anuluj"
        @close="isDeleteConfirmOpen = false"
        @confirm="confirmDelete"
      />
    </div>
  </MainLayout>
</template>

<style scoped></style>
