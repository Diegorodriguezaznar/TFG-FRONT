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
axios.defaults.baseURL = "http://localhost:5000/api";

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
  console.log('🚀 Iniciando aplicación...');
  
  const pinia = createPinia();
  pinia.use(piniaPluginPersistedstate); 
  const app = createApp(App);
  app.use(pinia);

  // 🔑 CRÍTICO: Cargar usuario desde localStorage ANTES del router
  console.log('👤 Cargando usuario desde localStorage...');
  try {
    const usuarioLogeadoStore = useUsuarioLogeadoStore();
    await usuarioLogeadoStore.cargarUsuarioDesdeStorage();
    
    if (usuarioLogeadoStore.estaAutenticado) {
      console.log('✅ Usuario cargado exitosamente:', usuarioLogeadoStore.usuarioActual?.nombre);
      console.log('🔑 Token presente:', !!usuarioLogeadoStore.token);
    } else {
      console.log('ℹ️ No hay usuario autenticado guardado');
    }
  } catch (error) {
    console.error('❌ Error al cargar usuario:', error);
  }

  const vuetify = createVuetify({
    components,
    directives,
    icons: { defaultSet: "mdi" },
  });

  app.use(router);
  app.use(vuetify);

  app.config.globalProperties.$axios = axios;

  app.mount("#app");
  console.log('✅ Aplicación montada exitosamente');
})().catch(error => {
  console.error('💥 Error fatal al iniciar la aplicación:', error);
});