import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/axios";

export interface Log {
  id?: number;
  date: string;
  routeFrom: string;
  routeTo: string;
  distanceKm: number;
  duration: string;
  driverId: number;
  vehicleId: number;
}

function extractErrorMessage(err: any, fallback: string) {
  return (
    err?.response?.data?.description ||
    err?.response?.data?.[0]?.description ||
    err?.message ||
    fallback
  );
}

export const useLogStore = defineStore("log", () => {
  const logs = ref<Log[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchLogs() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get<Log[]>("/logs");
      logs.value = response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd pobierania dziennika tras");
      error.value = msg;
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function addLog(logData: Partial<Log>) {
    loading.value = true;
    try {
      const response = await api.post<Log>("/logs", logData);
      logs.value.unshift(response.data);
      return response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd dodawania trasy");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function updateLog(id: number, logData: Partial<Log>) {
    loading.value = true;
    try {
      await api.put(`/logs/${id}`, logData);
      const index = logs.value.findIndex((l) => l.id === id);
      if (index !== -1) {
        const updatedLog = { ...logs.value[index], ...logData } as Log;
        logs.value[index] = updatedLog;
      }
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd aktualizacji trasy");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function deleteLog(id: number) {
    loading.value = true;
    try {
      await api.delete(`/logs/${id}`);
      logs.value = logs.value.filter((l) => l.id !== id);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd usuwania trasy");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  return {
    logs,
    loading,
    error,
    fetchLogs,
    addLog,
    updateLog,
    deleteLog,
  };
});
