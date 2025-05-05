<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed, watch } from "vue";
import CardTest from "@/components/CardTest.vue";
import { useTestStore } from "@/stores/Test";

// --------------------------- Props ---------------------------
const props = defineProps({
  searchQuery: {
    type: String,
    default: ""
  },
  temarioId: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(["testsCargados"]);

// --------------------------- Store ---------------------------
const testStore = useTestStore();

// --------------------------- Variables de estado ---------------------------
const loading = ref(false);
const error = ref("");

// --------------------------- Computed ---------------------------
const testsFiltrados = computed(() => {
  if (!props.searchQuery) return testStore.tests;
  
  return testStore.tests.filter(test =>
    test.titulo?.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

// --------------------------- Métodos ---------------------------
async function cargarTests() {
  if (!props.temarioId) return;
  
  loading.value = true;
  error.value = "";
  
  try {
    await testStore.fetchTestsByTemario(props.temarioId);
    emit("testsCargados", testStore.tests);
  } catch (e) {
    error.value = "Error al cargar los tests";
  } finally {
    loading.value = false;
  }
}

// --------------------------- Observadores ---------------------------
watch(() => props.temarioId, async (nuevoId) => {
  if (nuevoId) {
    await cargarTests();
  }
}, { immediate: true });

// --------------------------- Ciclo de Vida ---------------------------
onMounted(async () => {
  await cargarTests();
});
</script>

<template>
  <!-- --------------------------- Contenedor principal --------------------------- -->
  <v-container fluid>
    
    <!-- --------------------------- Estado de carga --------------------------- -->
    <v-card v-if="loading" class="pa-5 d-flex justify-center align-center">
      <v-progress-circular indeterminate color="orange-darken-2"></v-progress-circular>
    </v-card>
    
    <!-- --------------------------- Mensaje de error --------------------------- -->
    <v-card v-else-if="error" class="pa-5 text-center">
      <v-icon color="error" size="large">mdi-alert-circle</v-icon>
      <p class="text-h6 mt-2">{{ error }}</p>
      <v-btn color="orange-darken-2" @click="cargarTests">
        Reintentar
      </v-btn>
    </v-card>
    
    <!-- --------------------------- Sin tests --------------------------- -->
    <v-card v-else-if="testsFiltrados.length === 0" class="pa-5 text-center">
      <v-icon size="large">mdi-file-search</v-icon>
      <p class="text-h6 mt-2">No se encontraron tests para este temario</p>
    </v-card>
    
    <!-- --------------------------- Lista de tests --------------------------- -->
    <v-card v-else class="pa-5">
      <v-row>
        <v-col v-for="test in testsFiltrados" :key="test.id" cols="12" md="6" lg="4">
          <CardTest :test="test" />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
