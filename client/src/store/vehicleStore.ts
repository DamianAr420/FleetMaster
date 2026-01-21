import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/axios";

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  isOperational: boolean;
  type: string;
}

function extractErrorMessage(err: any, fallback: string) {
  return err?.response?.data?.message || err?.message || fallback;
}

export const useVehicleStore = defineStore("vehicle", () => {
  const vehicles = ref<Vehicle[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchVehicles() {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get<Vehicle[]>("/vehicles");
      vehicles.value = response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd pobierania pojazdów");
      error.value = msg;
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function addVehicle(vehicleData: Omit<Vehicle, "id">) {
    loading.value = true;
    try {
      const response = await api.post<Vehicle>("/vehicles", vehicleData);
      vehicles.value.push(response.data);
      return response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd dodawania pojazdu");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function deleteVehicle(id: number) {
    loading.value = true;
    try {
      await api.delete(`/vehicles/${id}`);
      vehicles.value = vehicles.value.filter((v) => v.id !== id);
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Nie udało się usunąć pojazdu");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function updateVehicle(id: number, vehicleData: Partial<Vehicle>) {
    loading.value = true;
    try {
      const response = await api.put<Vehicle>(`/vehicles/${id}`, vehicleData);
      const index = vehicles.value.findIndex((v) => v.id === id);
      if (index !== -1) vehicles.value[index] = response.data;
      return response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd aktualizacji pojazdu");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  return {
    vehicles,
    loading,
    error,
    fetchVehicles,
    addVehicle,
    deleteVehicle,
    updateVehicle,
  };
});
