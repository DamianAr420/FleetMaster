<script setup lang="ts">
import { reactive, watch } from "vue";

const props = defineProps<{
  isOpen: boolean;
  editingLog: any | null;
  loading: boolean;
  driverId: number;
  vehicleId: number;
}>();

const emit = defineEmits(["close", "save"]);

const form = reactive({
  routeFrom: "",
  routeTo: "",
  distanceKm: 0,
  duration: "01:00",
  date: new Date().toISOString().split("T")[0],
});

watch(
  () => props.editingLog,
  (newVal) => {
    if (newVal) {
      const formattedDate =
        newVal.date?.substring(0, 10) || new Date().toISOString().split("T")[0];
      const formattedDuration = newVal.duration?.substring(0, 5) || "01:00";
      Object.assign(form, {
        ...newVal,
        date: formattedDate,
        duration: formattedDuration,
      });
    } else {
      Object.assign(form, {
        routeFrom: "",
        routeTo: "",
        distanceKm: 0,
        duration: "01:00",
        date: new Date().toISOString().split("T")[0],
      });
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("save", {
    ...form,
    driverId: props.driverId,
    vehicleId: props.vehicleId,
  });
};
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-100 flex items-center justify-center p-4"
  >
    <div
      class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      @click="$emit('close')"
    ></div>
    <div
      class="bg-white w-full max-w-lg rounded-[2.5rem] p-8 relative z-10 shadow-2xl"
    >
      <h2 class="text-2xl font-black text-slate-900 uppercase italic mb-6">
        Trasa <span class="text-blue-600">Dnia</span>
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <input
            v-model="form.routeFrom"
            type="text"
            required
            placeholder="Skąd (Start)"
            class="bg-slate-50 rounded-2xl px-5 py-4 font-bold w-full outline-none"
          />
          <input
            v-model="form.routeTo"
            type="text"
            required
            placeholder="Dokąd (Cel)"
            class="bg-slate-50 rounded-2xl px-5 py-4 font-bold w-full outline-none"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 ml-2"
              >DYSTANS (KM)</label
            >
            <input
              v-model.number="form.distanceKm"
              type="number"
              step="0.1"
              required
              class="bg-slate-50 rounded-2xl px-5 py-4 font-bold w-full outline-none"
            />
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black text-slate-400 ml-2"
              >CZAS (HH:MM)</label
            >
            <input
              v-model="form.duration"
              type="time"
              required
              class="bg-slate-50 rounded-2xl px-5 py-4 font-bold w-full outline-none"
            />
          </div>
        </div>

        <input
          v-model="form.date"
          type="date"
          required
          class="bg-slate-50 rounded-2xl px-5 py-4 font-bold w-full outline-none"
        />

        <div class="flex gap-4 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 font-black uppercase text-xs text-slate-400"
          >
            Anuluj
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-2 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs hover:bg-black transition-all"
          >
            {{ editingLog ? "Zaktualizuj" : "Zapisz Log" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
