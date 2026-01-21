<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useDriverStore } from "@/store/driverStore";
import { useIssueStore } from "@/store/issueStore";
import MainLayout from "@/layouts/MainLayout.vue";
import { useRouter } from "vue-router";

const driverStore = useDriverStore();
const issueStore = useIssueStore();
const router = useRouter();

onMounted(async () => {
  await driverStore.fetchMyProfile();
  await issueStore.fetchAllIssues();
});

const getVehicleIcon = (type: string) => {
  const t = type?.toLowerCase();
  if (t === "truck") return "🚛";
  if (t === "car") return "🚗";
  if (t === "van") return "🚐";
  return "🚚";
};

const myIssues = computed(() => {
  const driverId = driverStore.driverProfile?.id;
  return issueStore.issues
    .filter((issue) => issue.driver?.id === driverId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
});

const stats = computed(() => {
  return {
    total: myIssues.value.length,
    pending: myIssues.value.filter((i) => i.status !== "Naprawione").length,
    resolved: myIssues.value.filter((i) => i.status === "Naprawione").length,
  };
});

const getStatusClass = (status: string) => {
  switch (status) {
    case "Zgłoszone":
      return "bg-amber-100 text-amber-700";
    case "W naprawie":
      return "bg-blue-100 text-blue-700";
    case "Naprawione":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
</script>

<template>
  <MainLayout>
    <div class="p-4 sm:p-10 bg-slate-50 min-h-screen pb-24">
      <header class="mb-8 px-2">
        <h2
          class="text-2xl sm:text-3xl font-black text-slate-900 uppercase italic leading-none"
        >
          Witaj, {{ driverStore.driverProfile?.firstName }}!
        </h2>
        <p
          class="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2"
        >
          Twoje centrum dowodzenia
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div
          class="lg:col-span-2 bg-slate-900 rounded-[2.5rem] p-6 sm:p-10 text-white relative overflow-hidden shadow-xl shadow-slate-900/20 group"
        >
          <div class="relative z-10">
            <span
              class="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400"
              >Aktualnie przypisany pojazd</span
            >

            <template v-if="driverStore.driverProfile?.assignedVehicle">
              <div class="flex items-center gap-4 mt-3">
                <span
                  class="text-4xl sm:text-5xl group-hover:scale-110 transition-transform duration-500"
                >
                  {{
                    getVehicleIcon(
                      driverStore.driverProfile.assignedVehicle.type
                    )
                  }}
                </span>
                <h3
                  class="text-2xl sm:text-4xl font-black uppercase italic leading-tight"
                >
                  {{ driverStore.driverProfile.assignedVehicle.brand }}
                  <span class="text-blue-500">{{
                    driverStore.driverProfile.assignedVehicle.model
                  }}</span>
                </h3>
              </div>

              <div class="flex flex-wrap items-center gap-3 mt-8">
                <div
                  class="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10"
                >
                  <p
                    class="text-[8px] uppercase font-black text-slate-500 tracking-tighter"
                  >
                    Tablice Rejestracyjne
                  </p>
                  <p class="font-black text-lg sm:text-xl tracking-widest">
                    {{ driverStore.driverProfile.assignedVehicle.licensePlate }}
                  </p>
                </div>
                <div
                  class="bg-white/5 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10"
                >
                  <p
                    class="text-[8px] uppercase font-black text-slate-500 tracking-tighter"
                  >
                    Status Pojazdu
                  </p>
                  <p
                    class="font-black text-lg sm:text-xl text-emerald-400 uppercase italic"
                  >
                    Sprawny
                  </p>
                </div>
              </div>
            </template>

            <p v-else class="text-slate-400 font-bold mt-4 italic">
              Brak przypisanego pojazdu w systemie
            </p>
          </div>

          <div
            class="absolute -right-8 -bottom-12 text-[15rem] text-white/5 rotate-12 pointer-events-none transition-transform group-hover:rotate-6 duration-700"
          >
            {{
              driverStore.driverProfile?.assignedVehicle
                ? getVehicleIcon(driverStore.driverProfile.assignedVehicle.type)
                : "❓"
            }}
          </div>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <div
            class="bg-white rounded-4xl p-6 border border-slate-200 flex flex-col justify-center items-center text-center shadow-sm"
          >
            <span class="text-4xl font-black text-slate-900">{{
              stats.pending
            }}</span>
            <span
              class="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] mt-2"
              >Aktywne usterki</span
            >
          </div>
          <button
            @click="router.push('/report-issue')"
            class="bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-4xl p-6 font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/30 active:scale-95 flex flex-col items-center justify-center gap-2"
          >
            <span class="text-2xl">📝</span>
            <span>Zgłoś usterkę</span>
          </button>
        </div>
      </div>

      <section class="px-2">
        <div class="flex items-center justify-between mb-8">
          <h3
            class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400"
          >
            Twoja historia serwisowa
          </h3>
          <div class="h-px flex-1 bg-slate-200 mx-6"></div>
        </div>

        <div v-if="myIssues.length > 0" class="grid gap-4">
          <div
            v-for="issue in myIssues"
            :key="issue.id"
            class="bg-white p-6 rounded-4xl border border-slate-200 flex items-center justify-between group hover:shadow-md transition-all"
          >
            <div class="flex items-center gap-5">
              <div
                :class="getStatusClass(issue.status)"
                class="w-1.5 h-12 rounded-full shadow-sm"
              ></div>
              <div>
                <h4
                  class="font-black text-slate-800 uppercase text-sm tracking-tight group-hover:text-blue-600 transition-colors"
                >
                  {{ issue.title }}
                </h4>
                <div class="flex flex-wrap items-center gap-3 mt-2">
                  <span
                    class="text-[10px] text-slate-400 font-bold uppercase tracking-tighter"
                    >📅
                    {{ new Date(issue.createdAt).toLocaleDateString() }}</span
                  >
                  <span
                    :class="getStatusClass(issue.status)"
                    class="text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-current/10"
                  >
                    {{ issue.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-else
          class="text-center py-20 bg-slate-100/50 rounded-[3rem] border-2 border-dashed border-slate-200"
        >
          <p
            class="text-slate-400 font-black uppercase text-[10px] tracking-widest"
          >
            Czysta karta — brak zgłoszonych problemów
          </p>
        </div>
      </section>
    </div>
  </MainLayout>
</template>
