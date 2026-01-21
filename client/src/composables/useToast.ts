import { ref } from "vue";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  leaving?: boolean;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  function showToast(
    message: string,
    type: ToastType = "success",
    timeout: number = 5000
  ): void {
    const id = Date.now();
    toasts.value.push({ id, message, type, leaving: false });

    setTimeout(() => {
      const toast = toasts.value.find((t) => t.id === id);
      if (toast) toast.leaving = true;

      setTimeout(() => {
        toasts.value = toasts.value.filter((t) => t.id !== id);
      }, 500);
    }, timeout);
  }

  return {
    toasts,
    showToast,
  };
}
