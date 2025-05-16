<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import Header from '@/components/Layout/Header.vue';
import Footer from '@/components/Layout/Footer.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import UserTab from '@/components/Perfil/UserTab.vue';
import PerfilHistorial from '@/components/Perfil/PerfilHistorial.vue';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import AvatarRiendo from '@/components/AvatarEmote.vue';

// --------------------------- Store de usuario ---------------------------
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const items = ref([{ title: 'Inicio', disabled: false, href: '/' }, { title: 'Perfil', disabled: true }]);
const loading = ref(false);
const editMode = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');

// --------------------------- Obtener el usuario actual ---------------------------
const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);

// --------------------------- Nombre de usuario ---------------------------
const nombre = computed({
  get: () => usuarioActual.value?.nombre || "Usuario",
  set: (value) => {
    // Placeholder para futura funcionalidad de edición
  }
});

// --------------------------- Email del usuario ---------------------------
const email = computed(() => usuarioActual.value?.gmail || "usuario@ejemplo.com");

// --------------------------- Frases inspiradoras para el perfil ---------------------------
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

// --------------------------- Estado seleccionado ---------------------------
const estadoSeleccionado = ref(estados[0]);

// --------------------------- Modo edición ---------------------------
const toggleEditMode = () => {
  if (editMode.value) {
    // Guardar cambios
    guardarCambios();
  }
  editMode.value = !editMode.value;
};

// --------------------------- Guardar cambios ---------------------------
const guardarCambios = () => {
  loading.value = true;
  
  // Simulación de guardado (aquí se integraria con la API real)
  setTimeout(() => {
    loading.value = false;
    snackbarText.value = "Perfil actualizado correctamente";
    showSnackbar.value = true;
  }, 800);
};

// --------------------------- Verificar usuario en localStorage ---------------------------
const checkUsuarioLocal = () => {
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado && !usuarioActual.value) {
    try {
      usuarioLogeadoStore.usuarioActual = JSON.parse(usuarioGuardado);
      usuarioLogeadoStore.estaAutenticado = true;
    } catch (error) {
      console.error("Error al recuperar usuario del localStorage:", error);
    }
  }
};

// --------------------------- Ejecutar al montar el componente ---------------------------
onMounted(() => {
  checkUsuarioLocal();
});

// --------------------------- Ver/ocultar password ---------------------------
const showPassword = ref(false);
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header @toggle-sidebar="drawer = !drawer" />
    
    <!-- --------------------------- Breadcrumb --------------------------- -->
    <v-breadcrumbs class="PerfilPage__Breadcrumb" :items="items">
      <template v-slot:prepend>
        <v-icon icon="mdi-home" size="small"></v-icon>
      </template>
    </v-breadcrumbs>

    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-main class="PerfilPage">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />

      <v-container class="PerfilPage__Contenedor">
        <v-row class="mb-6">
          <v-col cols="12">
            <div class="d-flex align-center justify-space-between">
              <h1 class="text-h4 font-weight-bold">Perfil de usuario</h1>
              <v-btn 
                :color="editMode ? 'success' : 'primary'" 
                :prepend-icon="editMode ? 'mdi-content-save' : 'mdi-pencil'" 
                @click="toggleEditMode"
                :loading="loading"
                rounded="pill"
              >
                {{ editMode ? 'Guardar cambios' : 'Editar perfil' }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
        
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4" class="text-center">
                <div class="PerfilPage__AvatarContainer pa-4">
                  <AvatarRiendo class="PerfilPage__Avatar" />
                  
                  <!-- Botón para cambiar avatar (simulado) -->
                  <v-btn 
                    variant="tonal" 
                    size="small" 
                    block 
                    prepend-icon="mdi-camera" 
                    class="mt-4"
                    :disabled="!editMode"
                    rounded="pill"
                  >
                    Cambiar avatar
                  </v-btn>
                </div>
              </v-col>
              
              <!-- Columna de información -->
              <v-col cols="12" md="8">
                <v-form>
                  <v-row>
                    <!-- Nombre de usuario -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="nombre"
                        label="Nombre"
                        variant="outlined"
                        density="comfortable"
                        :readonly="!editMode"
                        prepend-icon="mdi-account"
                        bg-color="grey-lighten-4"
                      ></v-text-field>
                    </v-col>
                    
                    <!-- Email -->
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="email"
                        label="Email"
                        variant="outlined"
                        density="comfortable"
                        readonly
                        prepend-icon="mdi-email"
                        bg-color="grey-lighten-4"
                      ></v-text-field>
                    </v-col>
                    
                    <!-- Frase de perfil -->
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
                      ></v-autocomplete>
                    </v-col>
                    
                    <!-- Contraseña (simulada) -->
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
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        
        <!-- Componente de Historial Reciente -->
        <v-card class="mb-6" elevation="2" rounded="lg">
          <v-card-text>
            <PerfilHistorial />
          </v-card-text>
        </v-card>
        
        <!-- Componente UserTab -->
        <v-card elevation="2" rounded="lg">
          <v-card-text class="pa-0">
            <UserTab />
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
    
    <!-- Footer -->
    <Footer />
    
    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="success"
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

<style scoped>
.PerfilPage {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.PerfilPage__Breadcrumb {
  background-color: white;
  padding: 8px 16px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.PerfilPage__Contenedor {
  max-width: 1200px;
  padding: 24px;
}

.PerfilPage__AvatarContainer {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.PerfilPage__Avatar {
  width: 180px;
  height: 180px;
  margin-bottom: 16px;
}

@media (max-width: 960px) {
  .PerfilPage__Contenedor {
    padding: 16px;
  }
  
  .PerfilPage__Avatar {
    width: 150px;
    height: 150px;
  }
}

@media (max-width: 600px) {
  .PerfilPage__Contenedor {
    padding: 12px;
  }
  
  .PerfilPage__Avatar {
    width: 120px;
    height: 120px;
  }
}
</style>