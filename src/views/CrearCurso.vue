<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCursoStore } from '@/stores/Curso';
import CursoDatos from '@/components/CrearCursos/CursoDatos.vue';
import CursoResumen from '@/components/CrearCursos/CursoResumen.vue';

// Store
const cursoStore = useCursoStore();

// Referencia al componente de datos
const cursoDatosRef = ref();

const cursoForm = ref({
  nombre: '',
  imagen: '',
  descripcion: '',
  idUsuario: 24, // TODO: reemplazar con el ID del usuario logueado
});

const cursoCreado = ref(null);
const loading = ref(false);
const showSuccess = ref(false);

// Validación de formulario
const isFormValid = computed(() => {
  return cursoForm.value.nombre && cursoForm.value.descripcion;
});

const crearCurso = async () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  
  try {
    // Obtener el archivo del componente hijo
    const imagenFile = cursoDatosRef.value?.selectedFile;
    
    // Llamar al store con los datos y el archivo
    const curso = await cursoStore.createCurso(
      {
        nombre: cursoForm.value.nombre,
        descripcion: cursoForm.value.descripcion,
        imagen: '' // Ya no se usa
      },
      imagenFile // El archivo File
    );

    if (curso) {
      cursoCreado.value = curso;
      showSuccess.value = true;
    }
  } catch (error) {
    console.error('Error al crear curso:', error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container>
    <v-card class="mx-auto my-8" max-width="1000" elevation="3">
      <v-card-title class="text-h4 d-flex align-center py-4 primary">
        <v-icon size="32" class="me-3" color="white">mdi-school</v-icon>
        <span class="white--text">Crear nuevo curso</span>
      </v-card-title>

      <!-- Contenido principal -->
      <v-card-text class="pa-6">
        <v-row v-if="!showSuccess">
          <!-- Datos del curso -->
          <v-col cols="12" md="7">
            <h3 class="text-h5 mb-4 text-primary">Detalles del curso</h3>
            <CursoDatos ref="cursoDatosRef" v-model="cursoForm" />
          </v-col>

          <!-- Vista previa -->
          <v-col cols="12" md="5">
            <h3 class="text-h5 mb-4 text-primary">Vista previa</h3>
            <CursoResumen :curso="cursoForm" />
          </v-col>
        </v-row>

        <!-- Mensaje de éxito -->
        <v-row v-if="showSuccess">
          <v-col cols="12" class="text-center py-8">
            <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
            <h2 class="text-h4 mb-3">¡Curso creado correctamente! 🎉</h2>
            <p class="text-body-1 mb-6">Tu curso se ha creado correctamente. ¿Qué deseas hacer ahora?</p>
            
            <v-btn
              color="primary"
              class="me-4 text-none"
              size="large"
              :to="`/curso/${cursoCreado.idCurso}/asignaturas`"
              prepend-icon="mdi-book-plus"
            >
              Añadir asignaturas
            </v-btn>

            <v-btn 
              color="secondary" 
              text 
              size="large" 
              :to="`/cursos`"
              prepend-icon="mdi-view-grid"
            >
              Volver a cursos
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Acciones -->
      <v-card-actions class="pa-6 pt-0" v-if="!showSuccess">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!isFormValid"
          size="large"
          class="text-none"
          @click="crearCurso"
          prepend-icon="mdi-content-save"
        >
          Crear curso
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped>
.v-card-title.primary {
  background: linear-gradient(135deg, #1976d2, #0d47a1);
}
</style>