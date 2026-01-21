<script setup lang="ts">
import { reactive, watch, onMounted } from "vue";
import { useDriverStore, type Driver } from "@/store/driverStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
  isOpen: boolean;
  driver: Driver | null;
}>();

const emit = defineEmits(["close"]);
const driverStore = useDriverStore();
const vehicleStore = useVehicleStore();
const { showToast } = useToast();

const form = reactive({
  firstName: "",
  lastName: "",
  licenseNumber: "",
  status: "",
  assignedVehicleId: null as number | null,
});

onMounted(() => {
  vehicleStore.fetchVehicles();
});

watch(
  () => props.driver,
  (newDriver) => {
    if (newDriver && props.isOpen) {
      form.firstName = newDriver.firstName || "";
      form.lastName = newDriver.lastName || "";
      form.licenseNumber = newDriver.licenseNumber || "";
      form.status = newDriver.status || "";
      form.assignedVehicleId =
        newDriver.assignedVehicleId || newDriver.assignedVehicle?.id || null;
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  if (!props.driver?.id) return;

  try {
    const payload = {
      id: props.driver.id,
      firstName: form.firstName,
      lastName: form.lastName,
      licenseNumber: form.licenseNumber,
      status: form.status,
      assignedVehicleId:
        form.assignedVehicleId === 0 ? null : form.assignedVehicleId,
    };

    await driverStore.updateDriver(props.driver.id, payload);

    emit("close");
    showToast("Dane kierowcy zostały zapisane", "info");
    await driverStore.fetchDrivers();
  } catch (error) {
    showToast("Nie udało się zapisać danych kierowcy", "error");
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
        class="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10"
      >
        <div class="bg-blue-600 p-8 text-white">
          <h3 class="text-2xl font-black uppercase tracking-tight">
            Edytuj Kierowcę
          </h3>
          <p
            class="text-blue-200 text-xs font-bold uppercase tracking-widest mt-1 italic"
          >
            Aktualizacja danych systemowych
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
                >Imię</label
              >
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold"
              />
            </div>
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
                >Nazwisko</label
              >
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
                >Status</label
              >
              <select
                v-model="form.status"
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold"
              >
                <option value="Dostępny">Dostępny</option>
                <option value="W trasie">W trasie</option>
                <option value="Urlop">Urlop</option>
                <option value="Chorobowe">Chorobowe</option>
              </select>
            </div>
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
                >Pojazd</label
              >
              <select
                v-model="form.assignedVehicleId"
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold"
              >
                <option :value="null">Brak przypisania</option>
                <option
                  v-for="v in vehicleStore.vehicles"
                  :key="v.id"
                  :value="v.id"
                  :disabled="!v.isOperational"
                >
                  {{ v.licensePlate }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2"
              >Numer Licencji</label
            >
            <input
              v-model="form.licenseNumber"
              type="text"
              required
              class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-mono font-bold"
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
              :disabled="driverStore.loading"
              class="flex-1 py-4 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all"
            >
              {{ driverStore.loading ? "Zapis..." : "Zapisz zmiany" }}
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
