<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useIssueStore } from "@/store/issueStore";
import { useVehicleStore } from "@/store/vehicleStore";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);

const issueStore = useIssueStore();
const vehicleStore = useVehicleStore();
const { showToast } = useToast();

const title = ref("");
const description = ref("");
const priority = ref("Normalny");
const vehicleId = ref<number | null>(null);

const priorities = ["Wysoki", "Normalny", "Niski"];

onMounted(() => {
  vehicleStore.fetchVehicles();
});

const submit = async () => {
  try {
    if (!title.value || !description.value || !vehicleId.value) return;

    await issueStore.reportIssue({
      title: title.value,
      description: description.value,
      priority: priority.value,
      vehicleId: vehicleId.value,
      driverId: null,
    });

    await issueStore.fetchAllIssues();

    emit("close");

    title.value = "";
    description.value = "";
    priority.value = "Normalny";
    vehicleId.value = null;

    showToast("Zgłoszono usterkę", "success");
  } catch {
    showToast("Błąd podczas dodawania usterki", "error");
  }
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/40 backdrop-blur-sm z-99 flex items-center justify-center p-4"
    @click="emit('close')"
  >
    <div
      class="bg-white w-full max-w-lg rounded-3xl p-6 border border-slate-200 shadow-xl animate-fadeIn"
      @click.stop
    >
      <h3 class="text-xl font-black text-slate-800 mb-6 uppercase">
        Dodaj usterkę
      </h3>

      <div class="space-y-4">
        <div>
          <label class="text-[10px] uppercase font-black text-slate-500"
            >Tytuł</label
          >
          <input
            v-model="title"
            type="text"
            placeholder="np. Problem z hamulcami"
            class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
          />
        </div>

        <div>
          <label class="text-[10px] uppercase font-black text-slate-500"
            >Opis</label
          >
          <textarea
            v-model="description"
            rows="3"
            placeholder="Opisz problem..."
            class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
          ></textarea>
        </div>

        <div>
          <label class="text-[10px] uppercase font-black text-slate-500"
            >Pojazd</label
          >
          <select
            v-model.number="vehicleId"
            class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 cursor-pointer outline-none"
          >
            <option disabled value="">Wybierz pojazd</option>

            <option
              v-for="v in vehicleStore.vehicles"
              :key="v.id"
              :value="v.id"
            >
              {{ v.licensePlate }} – {{ v.brand }} {{ v.model }}
            </option>
          </select>
        </div>

        <div>
          <label class="text-[10px] uppercase font-black text-slate-500"
            >Priorytet</label
          >
          <select
            v-model="priority"
            class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 cursor-pointer outline-none"
          >
            <option v-for="p in priorities" :key="p" :value="p">
              {{ p }}
            </option>
          </select>
        </div>
      </div>

      <div class="flex justify-end mt-6 space-x-3">
        <button
          @click="emit('close')"
          class="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-300 transition"
        >
          Anuluj
        </button>

        <button
          @click="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-wider hover:bg-blue-700 transition"
        >
          Dodaj
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.15s ease-out;
}
</style>
