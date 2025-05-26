import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";
import axios from "axios";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

// --------------------------- Configurar Axios ---------------------------
axios.defaults.baseURL = "http://localhost:5190/api";

axios.interceptors.response.use(
  response => response,
  error => {
    console.error("Error en petición Axios:", error);
    return Promise.reject(error);
  }
);

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// --------------------------- Bootstrap App ---------------------------
(async () => {
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate); 
  const app = createApp(App);
  app.use(pinia);

  // Cargar usuario desde localStorage ANTES del router
  const usuarioLogeadoStore = useUsuarioLogeadoStore();
  await usuarioLogeadoStore.cargarUsuarioDesdeStorage(); // Asegúrate de que este método sea async

  const vuetify = createVuetify({
    components,
    directives,
    icons: { defaultSet: "mdi" },
  });

  app.use(router);
  app.use(vuetify);

  app.config.globalProperties.$axios = axios;

  app.mount("#app");
})();
