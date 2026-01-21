<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

const router = useRouter();
const userStore = useUserStore();

const form = reactive({
  username: "",
  password: "",
});

onMounted(() => {
  if (userStore.savedUsername) {
    form.username = userStore.savedUsername;
  }
});

const handleSubmit = async () => {
  const success = await userStore.login({
    username: form.username,
    password: form.password,
  });

  if (success) {
    userStore.rememberUsername(form.username);

    if (userStore.isAdmin) {
      router.push("/dashboard");
    } else {
      router.push("/driver-dashboard");
    }
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-900 px-4">
    <div
      class="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
    >
      <div class="bg-blue-600 p-8 text-center text-white">
        <h1 class="text-4xl font-black italic tracking-tighter">FLEETMASTER</h1>
        <p class="text-blue-100 mt-1 opacity-80">System Zarządzania Flotą</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1"
              >Użytkownik</label
            >
            <input
              v-model="form.username"
              type="text"
              required
              autocomplete="username"
              name="username"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50"
              placeholder="Twój login"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1"
              >Hasło</label
            >
            <input
              v-model="form.password"
              type="password"
              required
              autocomplete="current-password"
              name="password"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all bg-gray-50"
              placeholder="••••••••"
            />
          </div>

          <div
            v-if="userStore.error"
            class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 font-medium text-center"
          >
            {{ userStore.error }}
          </div>

          <button
            type="submit"
            :disabled="userStore.loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <span v-if="userStore.loading">Autoryzacja...</span>
            <span v-else>Zaloguj się</span>
          </button>
        </form>
      </div>

      <div
        class="p-4 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400 font-semibold uppercase tracking-widest"
      >
        v1.0 • 2026
      </div>
    </div>
  </div>
</template>
