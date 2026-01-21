<script setup lang="ts">
import { reactive } from "vue";
import { useDriverStore } from "@/store/driverStore";
import { useToast } from "@/composables/useToast";

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(["close"]);
const driverStore = useDriverStore();
const { showToast } = useToast();

const form = reactive({
  firstName: "",
  lastName: "",
  licenseNumber: "",
  status: "Dostępny",
  email: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    await driverStore.addDriver({
      firstName: form.firstName,
      lastName: form.lastName,
      licenseNumber: form.licenseNumber,
      email: form.email,
      password: form.password,
    });

    Object.assign(form, {
      firstName: "",
      lastName: "",
      licenseNumber: "",
      status: "Dostępny",
      email: "",
      password: "",
    });

    emit("close");
    showToast("Kierowca został dodany", "success");
  } catch (error) {
    showToast("Nie udało się dodać kierowcy", "error");
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
        <div class="bg-slate-900 p-8 text-white">
          <h3 class="text-2xl font-black uppercase tracking-tight">
            Nowy Kierowca
          </h3>
          <p
            class="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1"
          >
            Tworzenie profilu i konta użytkownika
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="p-8 space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                >Imię</label
              >
              <input
                v-model="form.firstName"
                type="text"
                required
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold text-slate-700"
              />
            </div>
            <div>
              <label
                class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
                >Nazwisko</label
              >
              <input
                v-model="form.lastName"
                type="text"
                required
                class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-bold text-slate-700"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2"
              >Nr Licencji</label
            >
            <input
              v-model="form.licenseNumber"
              type="text"
              required
              placeholder="C/CE 12345"
              class="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-blue-500/10 outline-none bg-slate-50 font-mono font-bold uppercase tracking-widest text-blue-600"
            />
          </div>

          <hr class="border-slate-100" />

          <div
            class="bg-blue-50/50 p-5 rounded-3xl space-y-4 border border-blue-100/50"
          >
            <p
              class="text-[10px] font-black text-blue-400 uppercase tracking-widest"
            >
              Dane logowania kierowcy
            </p>
            <div>
              <input
                v-model="form.email"
                type="text"
                required
                placeholder="Login"
                class="w-full px-5 py-3.5 rounded-2xl border border-white focus:ring-4 focus:ring-blue-500/10 outline-none bg-white font-bold text-slate-700"
              />
            </div>
            <div>
              <input
                v-model="form.password"
                type="password"
                required
                placeholder="Hasło"
                class="w-full px-5 py-3.5 rounded-2xl border border-white focus:ring-4 focus:ring-blue-500/10 outline-none bg-white font-bold text-slate-700"
              />
            </div>
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
              class="flex-1 py-4 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl shadow-xl shadow-slate-900/30 hover:bg-black active:scale-95 transition-all"
            >
              {{
                driverStore.loading ? "Tworzenie..." : "Zapisz i utwórz konto"
              }}
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
