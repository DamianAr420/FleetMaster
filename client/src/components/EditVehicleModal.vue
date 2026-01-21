<script setup lang="ts">
import { reactive, watch } from "vue";
import { useVehicleStore } from "@/store/vehicleStore";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
  isOpen: boolean;
  vehicle: any | null;
}>();

const emit = defineEmits(["close"]);
const vehicleStore = useVehicleStore();
const { showToast } = useToast();

const form = reactive({
  brand: "",
  model: "",
  licensePlate: "",
  type: "truck",
  isOperational: true,
});

watch(
  () => props.vehicle,
  (newVehicle) => {
    if (newVehicle) {
      form.brand = newVehicle.brand;
      form.model = newVehicle.model;
      form.licensePlate = newVehicle.licensePlate;
      form.type = newVehicle.type || "truck";
      form.isOperational = newVehicle.isOperational;
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (!props.vehicle) return;
  try {
    await vehicleStore.updateVehicle(props.vehicle.id, {
      ...props.vehicle,
      ...form,
    });
    emit("close");
    showToast("Dane pojazdu zostały zapisane", "info");
    vehicleStore.fetchVehicles();
  } catch (error) {
    showToast("Nie udało się zapisać danych pojazdu", "error");
  }
};
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        @click="emit('close')"
      ></div>

      <div
        class="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        <div class="bg-blue-600 p-8 text-white">
          <h3 class="text-2xl font-black uppercase tracking-tight">
            Edytuj Pojazd
          </h3>
          <p
            class="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1 italic"
          >
            Zasób: {{ vehicle?.licensePlate }}
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-5 text-left">
          <div>
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
              >Typ Pojazdu</label
            >
            <select
              v-model="form.type"
              class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none bg-slate-50 font-bold text-slate-700"
            >
              <option value="truck">🚛 Ciężarówka</option>
              <option value="car">🚗 Samochód osobowy</option>
              <option value="van">🚐 Dostawczy</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                >Marka</label
              >
              <input
                v-model="form.brand"
                type="text"
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                >Model</label
              >
              <input
                v-model="form.model"
                type="text"
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
              >Numer Rejestracyjny</label
            >
            <input
              v-model="form.licensePlate"
              type="text"
              class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 outline-none bg-slate-50 font-mono font-bold uppercase"
            />
          </div>

          <div
            class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <span
              class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
              >Pojazd Sprawny</span
            >
            <input
              v-model="form.isOperational"
              type="checkbox"
              class="w-6 h-6 rounded-lg accent-blue-600"
            />
          </div>

          <div class="pt-4 flex space-x-3">
            <button
              type="button"
              @click="emit('close')"
              class="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 rounded-2xl transition-all"
            >
              Anuluj
            </button>
            <button
              type="submit"
              class="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-blue-600/30 active:scale-95 transition-all"
            >
              Zapisz
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
