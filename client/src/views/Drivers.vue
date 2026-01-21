<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDriverStore } from "@/store/driverStore";
import MainLayout from "@/layouts/MainLayout.vue";
import AddDriverModal from "@/components/AddDriverModal.vue";
import EditDriverModal from "@/components/EditDriverModal.vue";
import { useToast } from "@/composables/useToast";
import ConfirmModal from "@/components/ConfirmModal.vue";

const driverStore = useDriverStore();
const { showToast } = useToast();

const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedDriver = ref<any | null>(null);
const isDeleteConfirmOpen = ref(false);
const driverToDelete = ref<number | null>(null);

const openEditModal = (driver: any) => {
  selectedDriver.value = { ...driver };
  isEditModalOpen.value = true;
};

const openDeleteConfirm = (driverId: number) => {
  driverToDelete.value = driverId;
  isDeleteConfirmOpen.value = true;
};

const confirmDelete = async () => {
  if (!driverToDelete.value) return;

  await driverStore.deleteDriver(driverToDelete.value);
  showToast("Kierowca został usunięty", "success");

  isDeleteConfirmOpen.value = false;
};

onMounted(() => {
  driverStore.fetchDrivers();
});

const getStatusStyle = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case "dostępny":
      return "bg-green-100 text-green-700 border-green-200";
    case "w trasie":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "urlop":
      return "bg-slate-100 text-slate-500 border-slate-200";
    case "chorobowe":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};
</script>

<template>
  <MainLayout>
    <div class="max-w-350 mx-auto w-full">
      <header
        class="bg-white border-b border-gray-200 px-6 lg:px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sticky top-0 z-10"
      >
        <div class="min-w-0">
          <h2
            class="text-3xl font-black text-slate-800 tracking-tight uppercase"
          >
            Kierowcy
          </h2>
          <p class="text-sm text-slate-500 font-medium mt-1">
            Zarządzanie personelem i monitorowanie statusu pracy
          </p>
        </div>

        <button
          @click="isModalOpen = true"
          class="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex flex-row items-center justify-center space-x-3 shrink-0"
        >
          <span class="text-xl">+</span>
          <span class="uppercase tracking-widest text-sm">Dodaj kierowcę</span>
        </button>
      </header>

      <div class="p-6 lg:p-10">
        <div
          v-if="driverStore.loading && driverStore.drivers.length === 0"
          class="flex flex-col items-center justify-center py-32"
        >
          <div
            class="animate-spin rounded-full h-14 w-14 border-4 border-slate-900 border-t-transparent mb-6"
          ></div>
          <p
            class="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]"
          >
            Pobieranie bazy...
          </p>
        </div>

        <div
          v-else
          class="bg-white rounded-4xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div class="overflow-x-auto w-full">
            <table class="w-full text-left border-collapse table-auto">
              <thead class="bg-slate-50/50 border-b border-slate-200">
                <tr>
                  <th
                    class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]"
                  >
                    Kierowca
                  </th>
                  <th
                    class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center"
                  >
                    Status
                  </th>
                  <th
                    class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center"
                  >
                    Pojazd
                  </th>
                  <th
                    class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right"
                  >
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr
                  v-for="driver in driverStore.drivers"
                  :key="driver.id"
                  class="hover:bg-blue-50/40 transition-colors group"
                >
                  <td class="px-8 py-6">
                    <div class="flex items-center space-x-4">
                      <div
                        class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 font-black text-xs uppercase shadow-inner"
                      >
                        {{ driver.firstName[0] }}{{ driver.lastName[0] }}
                      </div>
                      <div class="min-w-0">
                        <div
                          class="font-black text-slate-800 uppercase tracking-tight truncate leading-tight"
                        >
                          {{ driver.firstName }} {{ driver.lastName }}
                        </div>
                        <div
                          class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5"
                        >
                          Licencja: {{ driver.licenseNumber }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-8 py-6 text-center">
                    <span
                      :class="getStatusStyle(driver.status)"
                      class="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-current mr-2"
                      ></span>
                      {{ driver.status }}
                    </span>
                  </td>

                  <td class="px-8 py-6 text-center">
                    <div
                      v-if="driver.assignedVehicle"
                      class="flex flex-col items-center"
                    >
                      <span
                        class="text-slate-800 font-black text-xs uppercase leading-tight"
                        >{{ driver.assignedVehicle.brand }}</span
                      >
                      <span
                        class="text-[10px] font-bold text-blue-600 tracking-widest uppercase"
                        >{{ driver.assignedVehicle.licensePlate }}</span
                      >
                    </div>
                    <span
                      v-else
                      class="text-slate-300 italic text-[10px] font-bold uppercase tracking-widest"
                      >Brak</span
                    >
                  </td>

                  <td class="px-8 py-6 text-right">
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="openEditModal(driver)"
                        class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:bg-white transition-all shadow-sm"
                      >
                        ✏️
                      </button>
                      <button
                        @click="openDeleteConfirm(driver.id)"
                        class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <footer
            class="bg-slate-50/80 px-10 py-5 border-t border-slate-100 flex items-center justify-end"
          >
            <span class="text-xs font-black text-slate-700"
              >Liczba kierowców: {{ driverStore.drivers.length }}</span
            >
          </footer>
        </div>
      </div>
    </div>

    <AddDriverModal :is-open="isModalOpen" @close="isModalOpen = false" />

    <EditDriverModal
      :is-open="isEditModalOpen"
      :driver="selectedDriver"
      @close="isEditModalOpen = false"
    />

    <ConfirmModal
      :is-open="isDeleteConfirmOpen"
      title="Usuń kierowcę"
      message="Czy na pewno chcesz usunąć tego kierowcę? <br> Jego konto zostanie również usunięte! <br> Tej operacji nie można cofnąć."
      confirm-text="Usuń"
      cancel-text="Anuluj"
      @close="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />
  </MainLayout>
</template>

<style scoped>
.overflow-x-auto {
  scrollbar-width: thin;
  scrollbar-color: #e2e8f0 transparent;
}
</style>
