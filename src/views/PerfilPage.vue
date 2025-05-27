<script setup>
import { ref, computed, onMounted } from 'vue';
import Header from '@/components/Layout/Header.vue';
import Footer from '@/components/Layout/Footer.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import UserTab from '@/components/Perfil/UserTab.vue';
import PerfilHistorial from '@/components/Perfil/PerfilHistorial.vue';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import AvatarRiendo from '@/components/AvatarEmote.vue';

const usuarioLogeadoStore = useUsuarioLogeadoStore();

const drawer = ref(false);
const items = ref([{ title: 'Inicio', disabled: false, href: '/' }, { title: 'Perfil', disabled: true }]);
const loading = ref(false);
const editMode = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');
const showPassword = ref(false);

const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);

const nombre = computed({
  get: () => usuarioActual.value?.nombre || "Usuario",
  set: (value) => {
    // Placeholder para futura funcionalidad de edición
  }
});

const email = computed(() => usuarioActual.value?.gmail || "usuario@ejemplo.com");

const estados = [
  "Me encanta Estudiar",
  "Soy una persona aplicada",
  "Vivan las Mates!",
  "La historia mola",
  "Fan de literatura",
  "Alumno sin igual",
  "Aprendiendo cada día",
  "Futuro científico"
];

const estadoSeleccionado = ref(estados[0]);

const toggleEditMode = () => {
  if (editMode.value) {
    guardarCambios();
  }
  editMode.value = !editMode.value;
};

const guardarCambios = () => {
  loading.value = true;
  
  setTimeout(() => {
    loading.value = false;
    snackbarText.value = "Perfil actualizado correctamente";
    showSnackbar.value = true;
  }, 800);
};

const checkUsuarioLocal = () => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado && !usuarioActual.value) {
    try {
      usuarioLogeadoStore.usuarioActual = JSON.parse(usuarioGuardado);
      usuarioLogeadoStore.estaAutenticado = true;
    } catch (error) {
      // Error manejado silenciosamente
    }
  }
};

onMounted(() => {
  checkUsuarioLocal();
});
</script>

<template>
  <v-app>
    <Header @toggle-sidebar="drawer = !drawer" />
    
    <v-breadcrumbs class="PerfilPage__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="mdi-home" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <v-main class="PerfilPage">
      <Sidebar v-model="drawer" />

      <v-container class="PerfilPage__Container">
        <v-row class="PerfilPage__Header">
          <v-col cols="12">
            <div class="PerfilPage__HeaderContent">
              <h1 class="PerfilPage__Title">Perfil de usuario</h1>
              <v-btn 
                :color="editMode ? 'success' : 'primary'" 
                :prepend-icon="editMode ? 'mdi-content-save' : 'mdi-pencil'" 
                @click="toggleEditMode"
                :loading="loading"
                rounded="pill"
                class="PerfilPage__EditButton"
              >
                {{ editMode ? 'Guardar cambios' : 'Editar perfil' }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
        
        <v-card class="PerfilPage__ProfileCard" elevation="2" rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="PerfilPage__AvatarSection">
                <div class="PerfilPage__AvatarContainer">
                  <AvatarRiendo class="PerfilPage__Avatar" />
                  
                  <v-btn 
                    variant="tonal" 
                    size="small" 
                    block 
                    prepend-icon="mdi-camera" 
                    class="PerfilPage__AvatarButton"
                    :disabled="!editMode"
                    rounded="pill"
                  >
                    Cambiar avatar
                  </v-btn>
                </div>
              </v-col>
              
              <v-col cols="12" md="8">
                <v-form>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="nombre"
                        label="Nombre"
                        variant="outlined"
                        density="comfortable"
                        :readonly="!editMode"
                        prepend-icon="mdi-account"
                        bg-color="grey-lighten-4"
                        class="PerfilPage__Input"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="email"
                        label="Email"
                        variant="outlined"
                        density="comfortable"
                        readonly
                        prepend-icon="mdi-email"
                        bg-color="grey-lighten-4"
                        class="PerfilPage__Input"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="estadoSeleccionado"
                        :items="estados"
                        label="Frase de perfil"
                        variant="outlined"
                        density="comfortable"
                        :readonly="!editMode"
                        prepend-icon="mdi-format-quote-close"
                        bg-color="grey-lighten-4"
                        class="PerfilPage__Input"
                      ></v-autocomplete>
                    </v-col>
                    
                    <v-col cols="12" v-if="editMode">
                      <v-text-field
                        label="Contraseña"
                        variant="outlined"
                        density="comfortable"
                        :type="showPassword ? 'text' : 'password'"
                        value="••••••••"
                        prepend-icon="mdi-lock"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                        @click:append-inner="showPassword = !showPassword"
                        bg-color="grey-lighten-4"
                        class="PerfilPage__Input"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <v-card class="PerfilPage__HistoryCard" elevation="2" rounded="lg">
          <v-card-text>
            <PerfilHistorial />
          </v-card-text>
        </v-card>
        
        <v-card class="PerfilPage__UserTabCard" elevation="2" rounded="lg">
          <v-card-text class="PerfilPage__UserTabContent">
            <UserTab />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    
    <Footer />
    
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
      class="PerfilPage__Snackbar"
    >
      {{ snackbarText }}
      
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="showSnackbar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/PerfilPage";
</style>