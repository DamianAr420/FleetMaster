import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/axios";

export interface AssignedVehicle {
  id: number;
  brand: string;
  model: string;
  licensePlate: string;
  isOperational: boolean;
  type: string;
}

export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  status: string;
  assignedVehicleId: number | null;
  assignedVehicle: AssignedVehicle | null;
  email?: string;
  password?: string;
}

function extractErrorMessage(err: any, fallback: string) {
  return (
    err?.response?.data?.description ||
    err?.response?.data?.[0]?.description ||
    err?.message ||
    fallback
  );
}

export const useDriverStore = defineStore("driver", () => {
  const drivers = ref<Driver[]>([]);
  const driverProfile = ref<Driver | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDrivers() {
    loading.value = true;
    try {
      const response = await api.get<Driver[]>("/drivers");
      drivers.value = response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd pobierania danych personelu");
      error.value = msg;
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function fetchMyProfile() {
    loading.value = true;
    try {
      const res = await api.get<Driver>("/drivers/me");
      driverProfile.value = res.data;
      return res.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd pobierania profilu");
      error.value = msg;
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function addDriver(driverData: Partial<Driver>) {
    loading.value = true;
    try {
      const response = await api.post<Driver>("/drivers", driverData);
      drivers.value.push(response.data);
      return response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd dodawania kierowcy");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function deleteDriver(id: number) {
    loading.value = true;
    try {
      await api.delete(`/drivers/${id}`);
      drivers.value = drivers.value.filter((d) => d.id !== id);
    } catch (err: any) {
      const msg = extractErrorMessage(
        err,
        "Nie udało się usunąć kierowcy i jego konta."
      );
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  async function updateDriver(id: number, driverData: Partial<Driver>) {
    loading.value = true;
    try {
      const response = await api.put<Driver>(`/drivers/${id}`, driverData);
      const index = drivers.value.findIndex((d) => d.id === id);
      if (index !== -1) drivers.value[index] = response.data;
      return response.data;
    } catch (err: any) {
      const msg = extractErrorMessage(err, "Błąd aktualizacji kierowcy");
      throw new Error(msg);
    } finally {
      loading.value = false;
    }
  }

  return {
    drivers,
    driverProfile,
    loading,
    error,

    fetchDrivers,
    fetchMyProfile,
    addDriver,
    deleteDriver,
    updateDriver,
  };
});
