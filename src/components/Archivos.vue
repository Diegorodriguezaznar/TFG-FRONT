<script setup lang="ts">
/* ----------------------------- Imports ----------------------------- */
import { ref, computed, onMounted, watch } from "vue";
import ModalArchivoComentario from "@/components/ModalArchivoComentarios.vue";
import SubirArchivoModal from "@/components/SubirArchivoModal.vue";
import CardArchivo from "@/components/CardArchivo.vue";
import { useArchivoStore } from "@/stores/Archivo";

/* ------------------------------ Props ------------------------------ */
const props = defineProps<{
  temarioId: number | null;
  terminoBusqueda: string;
}>();

/* ---------------------------- Store Pinia ---------------------------- */
const archivoStore = useArchivoStore();

/* --------------------------- Refs / Estado --------------------------- */
const modalSubidaVisible = ref(false);
const visorAbierto = ref(false);
const archivoSeleccionado = ref<Archivo | null>(null);
const cargando = ref(false);
const error = ref("");
const tipoSeleccionado = ref("todos");

const tiposArchivo = ref([
  { title: "Todos los archivos", value: "todos" },
  { title: "PDF", value: "PDF" },
  { title: "Word", value: "Word" },
  { title: "Imagen", value: "imagen" },
  { title: "Video", value: "video" },
  { title: "Otro", value: "otro" },
]);

/* --------------------------- Computed --------------------------- */
const archivosFiltrados = computed(() => {
  if (!props.terminoBusqueda) return archivoStore.archivos;
  return archivoStore.archivos.filter((archivo) =>
    archivo.titulo.toLowerCase().includes(props.terminoBusqueda.toLowerCase())
  );
});

const tipoActual = computed(() => {
  return tipoSeleccionado.value === "todos"
    ? "Todos los archivos"
    : tiposArchivo.value.find((t) => t.value === tipoSeleccionado.value)?.title;
});

const mensajeNoArchivos = computed(() => {
  return tipoSeleccionado.value === "todos"
    ? "No hay archivos en este temario"
    : `No hay archivos de tipo ${tipoSeleccionado.value}`;
});

/* --------------------------- Métodos --------------------------- */
const cargarArchivos = async (temarioId: number | null) => {
  if (!temarioId) {
    error.value = "Error con id Temario.";
    return;
  }

  cargando.value = true;
  error.value = "";

  try {
    if (tipoSeleccionado.value === "todos") {
      await archivoStore.fetchArchivosByTemario(temarioId);
    } else {
      await archivoStore.fetchArchivosByTipoAndTemario(
        tipoSeleccionado.value,
        temarioId
      );
    }
  } catch (e) {
    error.value = "Error al cargar los archivos";
    console.error(e);
  } finally {
    cargando.value = false;
  }
};

const cambiarTipoArchivo = (tipo: string) => {
  tipoSeleccionado.value = tipo;
  cargarArchivos(props.temarioId);
};

const verArchivo = (archivo: Archivo) => {
  archivoSeleccionado.value = archivo;
  visorAbierto.value = true;
};

const cerrarModal = () => {
  visorAbierto.value = false;
};

/* ------------------------ Ciclo de Vida ------------------------ */
onMounted(() => cargarArchivos(props.temarioId));

watch(
  () => props.temarioId,
  (nuevoId) => cargarArchivos(nuevoId),
  { immediate: true }
);
</script>


<template>
  <!-- Contenedor principal -->
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="10">
        
        <!-- 1. Barra de herramientas -->
        <div class="d-flex align-center mb-3 gap-2 flex-wrap">
          <!-- Botón: Subir archivo -->
          <v-btn
            color="orange-darken-2"
            class="mr-2 mb-2"
            @click="modalSubidaVisible = true"
          >
            <v-icon class="mr-1">mdi-upload</v-icon>
            Subir Archivo
          </v-btn>

          <!-- Botón: Filtro por tipo -->
          <v-btn color="primary" class="mb-2">
            <v-icon class="mr-1">mdi-filter-variant</v-icon>
            {{ tipoActual }}
            <v-menu activator="parent">
              <v-list>
                <v-list-item
                  v-for="(tipo, index) in tiposArchivo"
                  :key="index"
                  :value="tipo.value"
                  @click="cambiarTipoArchivo(tipo.value)"
                >
                  <v-list-item-title>{{ tipo.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </div>

        <!-- 2. Estados condicionales -->

        <!-- Estado: Cargando -->
        <v-card
          v-if="cargando"
          class="pa-5 d-flex justify-center align-center"
        >
          <v-progress-circular
            indeterminate
            color="orange-darken-2"
          ></v-progress-circular>
        </v-card>

        <!-- Estado: Error -->
        <v-card v-else-if="error" class="pa-5 text-center">
          <v-icon color="error" size="large">mdi-alert-circle</v-icon>
          <p class="text-h6 mt-2">{{ error }}</p>
          <v-btn
            color="orange-darken-2"
            @click="cargarArchivos(props.temarioId!)"
          >
            Reintentar
          </v-btn>
        </v-card>

        <!-- Estado: Lista vacía -->
        <v-card v-else-if="archivosFiltrados.length === 0" class="pa-5 text-center">
          <v-icon size="large">mdi-file-search</v-icon>
          <p class="text-h6 mt-2">{{ mensajeNoArchivos }}</p>
        </v-card>

        <!-- 3. Contenido: Lista de archivos -->
        <v-card v-else class="pa-5">
          <v-row>
            <CardArchivo
              v-for="archivo in archivosFiltrados"
              :key="archivo.id"
              :archivo="archivo"
              @ver="verArchivo(archivo)"
            />
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 4. Modales -->
    <SubirArchivoModal 
      :visible="modalSubidaVisible" 
      :temarioId="props.temarioId!" 
      @update:visible="modalSubidaVisible = false"
      @archivo-subido="cargarArchivos(props.temarioId!)"
    />

    <ModalArchivoComentario
      :archivo="archivoSeleccionado"
      :abierto="visorAbierto"
      @cerrar="cerrarModal"
    />
  </v-container>
</template>


<style lang="scss" scoped>
.gap-2 {
  gap: 8px;
}

.mb-2 {
  margin-bottom: 8px;
}
</style>