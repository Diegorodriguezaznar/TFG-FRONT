// main.ts modificado con configuración de Axios
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";
import axios from 'axios'; // Importar axios

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado"; 

// Configurar la URL base para axios
axios.defaults.baseURL = 'http://localhost:5190/api';

// Interceptor para manejar errores de Axios
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('Error en petición Axios:', error);
    return Promise.reject(error);
  }
);

const pinia = createPinia();
const app = createApp(App);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
  },
});

app.use(pinia);
app.use(router);
app.use(vuetify);

// Hacer axios disponible globalmente (opcional)
app.config.globalProperties.$axios = axios;

// Cargar usuario desde localStorage
const usuarioLogeadoStore = useUsuarioLogeadoStore();
usuarioLogeadoStore.cargarUsuarioDesdeStorage(); 

app.mount("#app");