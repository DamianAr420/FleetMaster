<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useIssueStore } from "@/store/issueStore";
import { useDriverStore } from "@/store/driverStore";
import { useToast } from "@/composables/useToast";
import MainLayout from "@/layouts/MainLayout.vue";

const issueStore = useIssueStore();
const driverStore = useDriverStore();
const { showToast } = useToast();

const isSubmitting = ref(false);
const isLoadingData = ref(true);

const assignedVehicle = ref<any>(null);

const form = reactive({
  title: "",
  description: "",
  priority: "Normalny",
  vehicleId: null as number | null,
  driverId: null as number | null,
});

onMounted(async () => {
  try {
    await driverStore.fetchMyProfile();

    if (driverStore.driverProfile) {
      const profile = driverStore.driverProfile;
      assignedVehicle.value = profile.assignedVehicle;

      form.driverId = profile.id;
      form.vehicleId = profile.assignedVehicle?.id || null;
    }
  } catch (error: any) {
    showToast("Błąd ładowania profilu kierowcy", "error");
  } finally {
    isLoadingData.value = false;
  }
});

const submitIssue = async () => {
  if (!form.vehicleId) {
    showToast(
      "Nie masz przypisanego pojazdu. Nie możesz zgłosić usterki.",
      "info"
    );
    return;
  }

  isSubmitting.value = true;
  try {
    await issueStore.reportIssue(form);
    showToast("Usterka została zgłoszona!", "success");

    form.title = "";
    form.description = "";
    form.priority = "Normalny";
  } catch (error: any) {
    showToast("Wystąpił błąd podczas zgłaszania.", "error");
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <MainLayout>
    <div class="max-w-2xl mx-auto p-4 sm:p-8">
      <div v-if="isLoadingData" class="flex flex-col items-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"
        ></div>
        <p
          class="text-slate-400 font-black uppercase tracking-widest text-[10px]"
        >
          Weryfikacja pojazdu...
        </p>
      </div>

      <div
        v-else
        class="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100"
      >
        <div class="bg-slate-900 p-6 sm:p-8 text-white">
          <h2 class="text-xl sm:text-2xl font-black uppercase italic">
            Zgłoś usterkę
          </h2>

          <div v-if="assignedVehicle" class="mt-4 flex flex-wrap gap-2">
            <span
              class="bg-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider"
            >
              {{ assignedVehicle.brand }} {{ assignedVehicle.model }}
            </span>
            <span
              class="bg-slate-800 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider"
            >
              {{ assignedVehicle.licensePlate }}
            </span>
          </div>
        </div>

        <form
          v-if="assignedVehicle"
          @submit.prevent="submitIssue"
          class="p-6 sm:p-8 space-y-6"
        >
          <div class="space-y-2">
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >Co się stało?</label
            >
            <input
              v-model="form.title"
              type="text"
              class="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm outline-none"
              required
            />
          </div>

          <div class="space-y-2">
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >Priorytet</label
            >
            <select
              v-model="form.priority"
              class="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none font-bold text-sm outline-none cursor-pointer"
            >
              <option>Niski</option>
              <option>Normalny</option>
              <option>Wysoki</option>
            </select>
          </div>

          <div class="space-y-2">
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-widest"
              >Opis</label
            >
            <textarea
              v-model="form.description"
              rows="4"
              class="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all active:scale-[0.98] disabled:bg-slate-300 text-sm"
          >
            {{ isSubmitting ? "Wysyłanie..." : "Wyślij zgłoszenie" }}
          </button>
        </form>
      </div>
    </div>
  </MainLayout>
</template>
