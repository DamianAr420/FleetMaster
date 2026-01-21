<script setup lang="ts">
import { reactive } from "vue";
import { useVehicleStore } from "@/store/vehicleStore";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
  isOpen: boolean;
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

const handleSubmit = async () => {
  try {
    await vehicleStore.addVehicle({ ...form });
    form.brand = "";
    form.model = "";
    form.licensePlate = "";
    form.type = "truck";
    form.isOperational = true;
    emit("close");
    showToast("Pojazd został dodany", "success");
  } catch (error) {
    showToast("Błąd podczas dodawania pojazdu", "error");
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
            Nowy Pojazd
          </h3>
          <p
            class="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1"
          >
            Dodawanie jednostki do floty
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
          <div>
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
              >Typ Pojazdu</label
            >
            <select
              v-model="form.type"
              class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold text-slate-700 appearance-none"
            >
              <option value="truck">🚛 Ciężarówka (Truck)</option>
              <option value="car">🚗 Samochód osobowy (Car)</option>
              <option value="van">🚐 Dostawczy (Van)</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                >Marka</label
              >
              <input
                v-model="form.brand"
                type="text"
                required
                placeholder="np. Volvo"
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold"
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
                required
                placeholder="np. FH16"
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
              >Numer rejestracyjny</label
            >
            <input
              v-model="form.licensePlate"
              type="text"
              required
              class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 font-mono font-black uppercase text-blue-600 bg-slate-50 outline-none"
            />
          </div>

          <div
            class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100"
          >
            <span
              class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
              >Status techniczny</span
            >
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="form.isOperational"
                class="sr-only peer"
              />
              <div
                class="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
              ></div>
            </label>
          </div>

          <div class="pt-4 flex space-x-3">
            <button
              type="button"
              @click="emit('close')"
              class="flex-1 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 rounded-2xl transition-colors"
            >
              Anuluj
            </button>
            <button
              type="submit"
              :disabled="vehicleStore.loading"
              class="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-600/30 rounded-2xl active:scale-95 transition-all"
            >
              {{ vehicleStore.loading ? "Synchronizacja..." : "Zapisz pojazd" }}
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
