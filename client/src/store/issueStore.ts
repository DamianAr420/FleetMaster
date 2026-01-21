import { defineStore } from "pinia";
import { ref } from "vue";
import api from "@/api/axios";

export interface Issue {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  vehicle?: {
    licensePlate: string;
  };
  driver?: {
    id: number;
    lastName: string;
  };
}

export const useIssueStore = defineStore("issue", () => {
  const issues = ref<Issue[]>([]);
  const loading = ref(false);

  async function fetchAllIssues() {
    loading.value = true;
    try {
      const res = await api.get<Issue[]>("/issues");
      issues.value = res.data;
    } catch (err) {
      console.error("Błąd pobierania usterek", err);
    } finally {
      loading.value = false;
    }
  }

  async function reportIssue(issueData: any) {
    await api.post("/issues", issueData);
  }

  async function updateStatus(id: number, status: string) {
    try {
      await api.patch(`/issues/${id}/status`, { status });
      const issue = issues.value.find((i) => i.id === id);
      if (issue) issue.status = status;
    } catch (err) {
      console.error("Błąd aktualizacji statusu", err);
    }
  }

  return { issues, loading, fetchAllIssues, reportIssue, updateStatus };
});
