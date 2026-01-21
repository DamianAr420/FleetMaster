import { createApp } from "vue";
import { createHead } from "@vueuse/head";
import { createPinia } from "pinia";
import "./style.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
const head = createHead();

app.use(head);
app.use(pinia);
app.use(router);
app.mount("#app");
