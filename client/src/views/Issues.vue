<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useIssueStore } from "@/store/issueStore";
import MainLayout from "@/layouts/MainLayout.vue";
import AddIssueModal from "@/components/AddIssueModal.vue";
import { useToast } from "@/composables/useToast";

const issueStore = useIssueStore();
const { showToast } = useToast();

const filterVehicle = ref("");
const filterDriver = ref("");
const filterDate = ref("");
const isModalOpen = ref(false);

onMounted(() => {
  issueStore.fetchAllIssues();
});

const priorityWeight: Record<string, number> = {
  Wysoki: 3,
  Normalny: 2,
  Niski: 1,
};

const openModal = () => {
  isModalOpen.value = true;
};

const statuses = ["Zgłoszone", "W naprawie", "Naprawione"] as const;

const processedIssues = computed(() => {
  let list = [...issueStore.issues];

  if (filterVehicle.value) {
    list = list.filter((i) =>
      i.vehicle?.licensePlate
        .toLowerCase()
        .includes(filterVehicle.value.toLowerCase()),
    );
  }

  if (filterDriver.value) {
    list = list.filter((i) =>
      i.driver?.lastName
        .toLowerCase()
        .includes(filterDriver.value.toLowerCase()),
    );
  }

  if (filterDate.value) {
    list = list.filter((i) => i.createdAt.startsWith(filterDate.value));
  }

  return list.sort(
    (a, b) =>
      (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0),
  );
});

const groupedIssues = computed(() => {
  return {
    Zgłoszone: processedIssues.value.filter((i) => i.status === "Zgłoszone"),
    "W naprawie": processedIssues.value.filter(
      (i) => i.status === "W naprawie",
    ),
    Naprawione: processedIssues.value.filter((i) => i.status === "Naprawione"),
  };
});

const resetFilters = () => {
  filterVehicle.value = "";
  filterDriver.value = "";
  filterDate.value = "";

  showToast("Filtry zostały wyczyszczone", "info");
};

const getPriorityClass = (p: string) => {
  if (p === "Wysoki") return "text-red-600 bg-red-50 border-red-100";
  if (p === "Normalny") return "text-blue-600 bg-blue-50 border-blue-100";
  return "text-slate-500 bg-slate-50 border-slate-100";
};
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:p-10 bg-slate-50 min-h-screen">
      <header class="mb-10">
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8"
        >
          <div>
            <h2
              class="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic leading-none"
            >
              Centrum Usterek
            </h2>
            <p
              class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2"
            >
              Zarządzanie stanem technicznym floty
            </p>
          </div>
          <button
            @click="openModal()"
            class="flex flex-row justify-center items-center px-4 py-2 bg-blue-200 rounded-4xl border border-blue-400 text-blue-600 font-medium gap-1 hover:text-blue-800 hover:bg-blue-500 transition-colors"
          >
            <span>+</span>
            <span>Dodaj usterkę</span>
          </button>
          <button
            @click="resetFilters"
            class="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 px-4 py-2 rounded-xl border border-blue-100"
          >
            Wyczyść filtry
          </button>
        </div>

        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-4xl shadow-sm border border-slate-200"
        >
          <div class="space-y-1">
            <label
              class="block text-[9px] font-black text-slate-400 uppercase ml-4"
              >Pojazd (Nr Rej.)</label
            >
            <input
              v-model="filterVehicle"
              type="text"
              placeholder="np. KR 12345"
              class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label
              class="block text-[9px] font-black text-slate-400 uppercase ml-4"
              >Kierowca (Nazwisko)</label
            >
            <input
              v-model="filterDriver"
              type="text"
              placeholder="np. Kowalski"
              class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <div class="space-y-1">
            <label
              class="block text-[9px] font-black text-slate-400 uppercase ml-4"
              >Data zgłoszenia</label
            >
            <input
              v-model="filterDate"
              type="date"
              class="w-full bg-slate-50 border-none rounded-2xl px-5 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
        </div>
      </header>

      <div class="space-y-12 pb-20">
        <section v-for="status in statuses" :key="status">
          <div class="flex items-center space-x-4 mb-6">
            <div class="h-px flex-1 bg-slate-200"></div>
            <h3
              class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex items-center shrink-0"
            >
              {{ status }}
              <span
                class="ml-2 bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[9px]"
              >
                {{ groupedIssues[status].length }}
              </span>
            </h3>
            <div class="h-px flex-1 bg-slate-200"></div>
          </div>

          <div v-if="groupedIssues[status].length > 0" class="grid gap-4">
            <div
              v-for="issue in groupedIssues[status]"
              :key="issue.id"
              class="bg-white p-5 sm:p-6 rounded-4xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between hover:shadow-xl transition-all border-l-4 gap-6"
              :class="
                issue.priority === 'Wysoki'
                  ? 'border-l-red-500'
                  : issue.priority === 'Normalny'
                    ? 'border-l-blue-500'
                    : 'border-l-transparent'
              "
            >
              <div
                class="flex items-start sm:items-center space-x-4 sm:space-x-6"
              >
                <div
                  :class="getPriorityClass(issue.priority)"
                  class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border flex flex-col items-center justify-center font-black shrink-0"
                >
                  <span class="text-[6px] uppercase tracking-tighter"
                    >Priorytet</span
                  >
                  <span class="text-[9px] sm:text-[10px]">{{
                    issue.priority
                  }}</span>
                </div>

                <div class="min-w-0 flex-1">
                  <h4
                    class="font-black text-slate-800 uppercase tracking-tight text-sm sm:text-base truncate"
                  >
                    {{ issue.title }}
                  </h4>
                  <p
                    class="text-xs text-slate-500 font-medium mb-3 line-clamp-2 lg:line-clamp-none max-w-2xl"
                  >
                    {{ issue.description }}
                  </p>

                  <div
                    class="flex flex-wrap items-center gap-2 text-[9px] font-black uppercase"
                  >
                    <span
                      class="bg-blue-600 text-white px-2 py-1 rounded-lg shrink-0"
                      >🚛 {{ issue.vehicle?.licensePlate }}</span
                    >
                    <span
                      class="bg-slate-800 text-white px-2 py-1 rounded-lg shrink-0"
                      >👤 {{ issue.driver?.lastName }}</span
                    >
                    <span class="text-slate-400 shrink-0"
                      >📅
                      {{ new Date(issue.createdAt).toLocaleDateString() }}</span
                    >
                  </div>
                </div>
              </div>

              <div
                class="w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0"
              >
                <select
                  :value="issue.status"
                  @change="
                    issueStore.updateStatus(
                      issue.id,
                      ($event.target as HTMLSelectElement).value,
                    );
                    showToast('Status zaktualizowany', 'info');
                  "
                  class="w-full lg:w-auto bg-slate-900 text-white lg:bg-slate-50 lg:text-slate-900 border-none rounded-xl font-black text-[9px] uppercase py-3 lg:py-2 px-5 focus:ring-0 cursor-pointer hover:opacity-90 transition-all"
                >
                  <option v-for="opt in statuses" :key="opt" :value="opt">
                    {{ opt }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div
            v-else
            class="text-center py-10 bg-slate-100/30 rounded-4xl border-2 border-dashed border-slate-200"
          >
            <p
              class="text-[10px] font-black uppercase text-slate-300 tracking-widest"
            >
              Brak zgłoszeń
            </p>
          </div>
        </section>
      </div>
    </div>
    <AddIssueModal :isOpen="isModalOpen" @close="isModalOpen = false" />
  </MainLayout>
</template>

<style scoped>
input[type="date"] {
  min-height: 44px;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
  cursor: pointer;
}

:deep(main) {
  overflow-x: hidden;
}
</style>
