import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/api/axios";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore("user", () => {
  const token = ref<string | null>(localStorage.getItem("token"));
  const user = ref<string | null>(localStorage.getItem("user"));
  const loading = ref(false);
  const error = ref<string | null>(null);
  const savedUsername = ref<string>(
    localStorage.getItem("saved_username") || ""
  );

  const userRoles = computed((): string[] => {
    if (!token.value) return [];
    try {
      const decoded: any = jwtDecode(token.value);
      const roles =
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || decoded.role;

      if (!roles) return [];
      return Array.isArray(roles) ? roles : [roles];
    } catch (err) {
      console.error("Błąd dekodowania tokena:", err);
      return [];
    }
  });

  const isAdmin = computed(() => userRoles.value.includes("Admin"));
  const isDriver = computed(() => userRoles.value.includes("Driver"));

  const isBoss = computed(() => isAdmin.value && isDriver.value);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: { username: string; password: string }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post("/auth/login", credentials);
      const { token: newToken, user: name } = response.data;

      token.value = newToken;
      user.value = name;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", name);

      return true;
    } catch (err: any) {
      error.value = err.response?.data || "Błąd logowania";
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: { username: string; password: string }) {
    loading.value = true;
    error.value = null;
    try {
      await api.post("/auth/register", data);
      return true;
    } catch (err: any) {
      error.value = err.response?.data || "Błąd rejestracji";
      return false;
    } finally {
      loading.value = false;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  function rememberUsername(name: string) {
    savedUsername.value = name;
    localStorage.setItem("saved_username", name);
  }

  return {
    token,
    user,
    loading,
    error,
    isAuthenticated,
    userRoles,
    isAdmin,
    isDriver,
    isBoss,
    login,
    register,
    logout,
    savedUsername,
    rememberUsername,
  };
});
