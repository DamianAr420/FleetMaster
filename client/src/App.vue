<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { jwtDecode } from "jwt-decode";
import Toast from "@/components/toast.vue";

const router = useRouter();

const checkAuth = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    if (window.location.pathname !== "/login") {
      router.push("/login");
    }
    return;
  }

  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.warn("Token wygasł. Wylogowywanie...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }
  } catch (error) {
    localStorage.removeItem("token");
    router.push("/login");
  }
};

onMounted(() => {
  checkAuth();
});
</script>

<template>
  <Toast />
  <div class="min-h-screen bg-gray-100 font-sans antialiased">
    <router-view />
  </div>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
