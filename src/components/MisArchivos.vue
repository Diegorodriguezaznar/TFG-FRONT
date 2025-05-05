<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed, watch } from "vue";
import { useArchivoStore } from "@/stores/Archivo";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import CardArchivo from "@/components/CardArchivo.vue";
import type { Archivo } from "@/store/Archivo";
import ModalArchivoComentario from '@/components/ModalArchivoComentarios.vue';

// --------------------------- Estado del usuario logueado ---------------------------
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const archivoStore = useArchivoStore();

// --------------------------- Manejo de errores y carga ---------------------------
const loading = ref(false);
const error = ref("");

// --------------------------- Estado para el modal ---------------------------
const visorAbierto = ref(false);
const archivoSeleccionado = ref<Archivo | null>(null);

// --------------------------- Obtener el ID del usuario actual ---------------------------
const usuarioId = computed(() => {
  const usuario = usuarioLogeadoStore.usuarioActual;
  const id = usuario?.id || usuario?.idUsuario || null;
  console.log("ID de usuario encontrado:", id);
  return id;
});

// --------------------------- Computada para los archivos ---------------------------
const misArchivos = computed(() => {
  console.log("Archivos en el store:", archivoStore.archivos);
  return archivoStore.archivos;
});

// --------------------------- Métodos ---------------------------
const verArchivo = (archivo: Archivo) => {
  console.log("Ver archivo:", archivo);
  archivoSeleccionado.value = archivo;
  visorAbierto.value = true;
};

const cerrarModal = () => {
  visorAbierto.value = false;
};

// --------------------------- Cargar los archivos del usuario ---------------------------
watch(() => usuarioId.value, async (newId) => {
  if (newId) {
    await cargarArchivosUsuario(newId);
  }
}, { immediate: true });

async function cargarArchivosUsuario(userId: number) {
  loading.value = true;
  error.value = "";
  
  try {
    console.log("Cargando archivos para el usuario ID:", userId);
    await archivoStore.fetchArchivosByUsuario(userId);

    // Verifica que no haya archivos
    if (archivoStore.archivos.length === 0) {
      console.log("No hay archivos para este usuario.");
    } else {
      console.log("Archivos cargados:", archivoStore.archivos);
    }
  } catch (e) {
    error.value = `Error al cargar los archivos: ${e.message}`;
    console.error("Error en cargarArchivosUsuario:", e);
  } finally {
    loading.value = false;
  }
}


// --------------------------- Cargar archivos al montar el componente ---------------------------
onMounted(async () => {
  // Limpia el estado de archivos inmediatamente
  archivoStore.archivos = [];
  
  if (usuarioId.value) {
    // Limpia el localStorage antes de cargar los archivos
    localStorage.removeItem("archivosUsuario");

    // Ahora carga los archivos del usuario
    await cargarArchivosUsuario(usuarioId.value);
  } else {
    console.log("No hay usuario logueado con ID válido");
  }
});

</script>

<template>
  <!-- --------------------------- Contenedor principal --------------------------- -->
  <v-container class="MisArchivos__Contenedor">
    
    <!-- --------------------------- Estado de carga --------------------------- -->
    <v-card v-if="loading" class="pa-5 d-flex justify-center align-center">
      <v-progress-circular indeterminate color="orange-darken-2"></v-progress-circular>
    </v-card>
    
    <!-- --------------------------- Mensaje de error --------------------------- -->
    <v-card v-else-if="error" class="pa-5 text-center">
      <v-icon color="error" size="large">mdi-alert-circle</v-icon>
      <p class="text-h6 mt-2">{{ error }}</p>
    </v-card>
    
    <!-- --------------------------- Sin archivos --------------------------- -->
    <v-card v-else-if="misArchivos.length === 0" class="pa-5 text-center">
      <v-icon size="large">mdi-file-search</v-icon>
      <p class="text-h6 mt-2">¡No has subido archivos todavia!</p>
    </v-card>
    
    <!-- --------------------------- Lista de archivos --------------------------- -->
    <v-row v-else align="start" justify="start">
      <CardArchivo 
        v-for="archivo in misArchivos" 
        :key="archivo.idArchivo || archivo.id" 
        :archivo="archivo" 
        @ver="verArchivo"
      />
    </v-row>
    
    <!-- --------------------------- Modal para ver el archivo --------------------------- -->
    <ModalArchivoComentario
      :archivo="archivoSeleccionado"
      :abierto="visorAbierto"
      @cerrar="cerrarModal"
    />
  </v-container>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/components/Mis/MisArchivos.scss";
</style>
