import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/userStore";
import LoginView from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Drivers from "@/views/Drivers.vue";
import Vehicles from "@/views/Vehicles.vue";
import Issues from "@/views/Issues.vue";
import ReportIssue from "@/views/ReportIssue.vue";
import DriverDashboard from "@/views/DriverDashboard.vue";
import Note from "@/views/Note.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/login" },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { title: "Logowanie" },
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Panel Admina" },
    },
    {
      path: "/vehicles",
      name: "Vehicles",
      component: Vehicles,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: "Flota Pojazdów",
      },
    },
    {
      path: "/drivers",
      name: "Drivers",
      component: Drivers,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Personel" },
    },
    {
      path: "/issues",
      name: "Issues",
      component: Issues,
      meta: { requiresAuth: true, requiresAdmin: true, title: "Usterki" },
    },
    {
      path: "/report-issue",
      name: "reportIssue",
      component: ReportIssue,
      meta: { requiresAuth: true, title: "Zgłoś Problem" },
    },
    {
      path: "/driver-dashboard",
      name: "DriverDashboard",
      component: DriverDashboard,
      meta: { requiresAuth: true, title: "Mój Panel" },
    },
    {
      path: "/note",
      name: "Note",
      component: Note,
      meta: { requiresAuth: true, title: "Dziennik" },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const isAuthenticated = !!userStore.token;

  const baseTitle = "FleetMaster";
  const pageTitle = to.meta.title as string;
  document.title = pageTitle ? `${pageTitle} | ${baseTitle}` : baseTitle;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else if (to.name === "Login" && isAuthenticated) {
    userStore.isAdmin ? next("/dashboard") : next("/driver-dashboard");
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next("/driver-dashboard");
  } else {
    next();
  }
});

export default router;
