<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useVehicleStore } from "@/store/vehicleStore";
import MainLayout from "@/layouts/MainLayout.vue";
import AddVehicleModal from "@/components/AddVehicleModal.vue";
import EditVehicleModal from "@/components/EditVehicleModal.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import { useToast } from "@/composables/useToast";

const vehicleStore = useVehicleStore();
const { showToast } = useToast();

const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedVehicle = ref<any | null>(null);

const isDeleteConfirmOpen = ref(false);
const vehicleToDelete = ref<number | null>(null);

onMounted(() => {
  vehicleStore.fetchVehicles();
});

const openEditModal = (vehicle: any) => {
  selectedVehicle.value = vehicle;
  isEditModalOpen.value = true;
};

const openDeleteConfirm = (id: number) => {
  vehicleToDelete.value = id;
  isDeleteConfirmOpen.value = true;
};

const confirmDelete = async () => {
  if (!vehicleToDelete.value) return;
  try {
    await vehicleStore.deleteVehicle(vehicleToDelete.value);
    showToast("Pojazd został usunięty", "success");
  } catch (err: any) {
    showToast(err.message, "error");
  } finally {
    isDeleteConfirmOpen.value = false;
    vehicleToDelete.value = null;
  }
};

const getStatusBadge = (isOperational: boolean) =>
  isOperational
    ? "bg-emerald-100 text-emerald-700 border-emerald-200"
    : "bg-amber-100 text-amber-700 border-amber-200";

const getVehicleIcon = (type: string) => {
  const t = type?.toLowerCase();
  if (t === "truck") return "🚛";
  if (t === "car") return "🚗";
  if (t === "van") return "🚐";
  return "🚚";
};
</script>

<template>
  <MainLayout>
    <div class="max-w-350 mx-auto w-full">
      <header
        class="bg-white border-b border-gray-200 px-6 lg:px-10 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sticky top-0 z-10"
      >
        <div>
          <h2
            class="text-3xl font-black text-slate-800 tracking-tight uppercase"
          >
            Flota Pojazdów
          </h2>
          <p class="text-sm text-slate-500 font-medium mt-1">
            Zarządzanie stanem technicznym i rejestracją jednostek
          </p>
        </div>

        <button
          @click="isAddModalOpen = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-600/20 transition-all active:scale-95 flex items-center justify-center space-x-3 shrink-0"
        >
          <span class="text-xl">+</span>
          <span class="uppercase tracking-widest text-sm">Dodaj pojazd</span>
        </button>
      </header>

      <div class="p-6 lg:p-10">
        <div
          v-if="vehicleStore.loading && vehicleStore.vehicles.length === 0"
          class="flex flex-col items-center justify-center py-32"
        >
          <div
            class="animate-spin rounded-full h-14 w-14 border-4 border-blue-600 border-t-transparent mb-6"
          ></div>
          <p
            class="text-slate-400 font-black uppercase tracking-widest text-[10px]"
          >
            Inwentaryzacja floty...
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
                    Jednostka
                  </th>
                  <th
                    class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center"
                  >
                    Rejestracja
                  </th>
                  <th
                    class="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center"
                  >
                    Stan Techniczny
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
                  v-for="vehicle in vehicleStore.vehicles"
                  :key="vehicle.id"
                  class="hover:bg-blue-50/40 transition-colors group"
                >
                  <td class="px-8 py-6">
                    <div class="flex items-center space-x-4">
                      <div
                        class="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/10"
                      >
                        <span class="text-xl">{{
                          getVehicleIcon(vehicle.type)
                        }}</span>
                      </div>
                      <div>
                        <div
                          class="font-black text-slate-800 uppercase tracking-tight leading-tight"
                        >
                          {{ vehicle.brand }}
                        </div>
                        <div
                          class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1"
                        >
                          {{ vehicle.model }}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td class="px-8 py-6 text-center">
                    <span
                      class="px-4 py-2 bg-slate-100 rounded-lg font-mono font-black text-blue-600 border border-slate-200 uppercase tracking-widest text-xs"
                    >
                      {{ vehicle.licensePlate }}
                    </span>
                  </td>

                  <td class="px-8 py-6 text-center">
                    <span
                      :class="getStatusBadge(vehicle.isOperational)"
                      class="inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    >
                      <span
                        class="w-1.5 h-1.5 rounded-full bg-current mr-2"
                      ></span>
                      {{ vehicle.isOperational ? "Sprawny" : "Serwis" }}
                    </span>
                  </td>

                  <td class="px-8 py-6 text-right">
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="openEditModal(vehicle)"
                        class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-600 hover:bg-white transition-all shadow-sm active:scale-90"
                      >
                        ✏️
                      </button>
                      <button
                        @click="openDeleteConfirm(vehicle.id)"
                        class="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-600 hover:bg-red-50 transition-all active:scale-90"
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
              >Liczba pojazdów: {{ vehicleStore.vehicles.length }}</span
            >
          </footer>
        </div>
      </div>
    </div>

    <AddVehicleModal
      :is-open="isAddModalOpen"
      @close="isAddModalOpen = false"
    />

    <EditVehicleModal
      :is-open="isEditModalOpen"
      :vehicle="selectedVehicle"
      @close="isEditModalOpen = false"
    />

    <ConfirmModal
      :is-open="isDeleteConfirmOpen"
      title="Usuń pojazd"
      message="Czy na pewno chcesz usunąć ten pojazd z floty? <br> Tej operacji nie można cofnąć."
      confirm-text="Usuń"
      cancel-text="Anuluj"
      @close="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />
  </MainLayout>
</template>
