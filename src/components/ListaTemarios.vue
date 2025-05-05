<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed, watch } from "vue";
import CardTemario from "@/components/CardTemario.vue";

// --------------------------- Fetch a la API ---------------------------
async function fetchTemarios() {
  if (!props.idAsignatura || props.idAsignatura === "undefined") return;
  try {
    const response = await fetch(`http://localhost:5687/api/Temario/asignatura/${props.idAsignatura}`);
    if (!response.ok) throw new Error("Error al obtener los temarios");

    const data = await response.json();
    
    // Verificar id temario
    temarios.value = data.map(temario => ({
      ...temario,
      id: temario.id || temario.idTemario || temario.temarioId || null
    }));

    emit("temariosCargados", temarios.value);
  } catch (error) {
    console.error("Error al obtener temarios:", error);
  }
}

// --------------------------- Filtrar los temarios ---------------------------
const temariosFiltrados = computed(() => {
  if (!props.searchQuery) return temarios.value;
  return temarios.value.filter(temario =>
    temario.titulo.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

// --------------------------- Propiedades ---------------------------
const props = defineProps({
  searchQuery: {
    type: String,
    default: ""
  },
  idAsignatura: {
    type: String,
    required: true
  }
});

// --------------------------- Emitir eventos ---------------------------
const emit = defineEmits(["temariosCargados"]);

// --------------------------- Almacenar temarios ---------------------------
const temarios = ref([]);

// --------------------------- Llamar al método ---------------------------
onMounted(fetchTemarios);

// --------------------------- Llamar a la API cuando cambie el ID de la asignatura ---------------------------
watch(() => props.idAsignatura, (newVal) => {
  if (newVal && newVal !== "undefined") {
    fetchTemarios();
  }
}, { immediate: true });
</script>

<template>
  <!-- --------------------------- Contenedor principal --------------------------- -->
  <v-container class="ListaTemarios__Contenedor">
    
    <!-- --------------------------- Mensaje cuando no haya temarios --------------------------- -->
    <div v-if="temarios.length === 0" class="text-center my-4">
      <p>No hay temarios disponibles para esta asignatura</p>
    </div>
  
    <!-- --------------------------- Mostrar temarios --------------------------- -->
    <v-row align="start" justify="start">
      <v-col v-for="temario in temariosFiltrados" :key="temario.id || index" cols="12" sm="6" md="4" lg="3">
        <CardTemario :temario="temario" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  @import "@/assets/sass/components/Lists/Ltemarios.scss";
</style>
