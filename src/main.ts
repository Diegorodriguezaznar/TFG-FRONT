import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { createVuetify } from "vuetify";
import "vuetify/styles";
import router from "./router";
import "@mdi/font/css/materialdesignicons.css";

import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado"; 

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

// Cargar usuario desde localStorage
const usuarioLogeadoStore = useUsuarioLogeadoStore();
usuarioLogeadoStore.cargarUsuarioDesdeStorage(); 

app.mount("#app");
