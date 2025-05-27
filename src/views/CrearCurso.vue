<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCursoStore } from '@/stores/Curso';
import CursoDatos from '@/components/CrearCursos/CursoDatos.vue';
import CursoResumen from '@/components/CrearCursos/CursoResumen.vue';

const cursoStore = useCursoStore();

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

const isFormValid = computed(() => {
  return cursoForm.value.nombre && cursoForm.value.descripcion;
});

const crearCurso = async () => {
  if (!isFormValid.value) return;
  
  loading.value = true;
  
  try {
    const imagenFile = cursoDatosRef.value?.selectedFile;
    
    const curso = await cursoStore.createCurso(
      {
        nombre: cursoForm.value.nombre,
        descripcion: cursoForm.value.descripcion,
        imagen: ''
      },
      imagenFile
    );

    if (curso) {
      cursoCreado.value = curso;
      showSuccess.value = true;
    }
  } catch (error) {
    // Error manejado por el store
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-container class="CrearCurso">
    <v-card class="CrearCurso__Card">
      <v-card-title class="CrearCurso__Header">
        <v-icon size="32" class="CrearCurso__Icon">mdi-school</v-icon>
        <span class="CrearCurso__Title">Crear nuevo curso</span>
      </v-card-title>

      <v-card-text class="CrearCurso__Content">
        <v-row v-if="!showSuccess">
          <v-col cols="12" md="7">
            <h3 class="CrearCurso__SectionTitle">Detalles del curso</h3>
            <CursoDatos ref="cursoDatosRef" v-model="cursoForm" />
          </v-col>

          <v-col cols="12" md="5">
            <h3 class="CrearCurso__SectionTitle">Vista previa</h3>
            <CursoResumen :curso="cursoForm" />
          </v-col>
        </v-row>

        <v-row v-if="showSuccess">
          <v-col cols="12" class="CrearCurso__Success">
            <v-icon size="64" color="success" class="CrearCurso__SuccessIcon">mdi-check-circle</v-icon>
            <h2 class="CrearCurso__SuccessTitle">¡Curso creado correctamente!</h2>
            <p class="CrearCurso__SuccessText">Tu curso se ha creado correctamente. ¿Qué deseas hacer ahora?</p>
            
            <div class="CrearCurso__SuccessActions">
              <v-btn
                color="primary"
                class="CrearCurso__Button CrearCurso__Button--Primary"
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
                class="CrearCurso__Button CrearCurso__Button--Secondary"
              >
                Volver a cursos
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="CrearCurso__Actions" v-if="!showSuccess">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="!isFormValid"
          size="large"
          class="CrearCurso__SubmitButton"
          @click="crearCurso"
          prepend-icon="mdi-content-save"
        >
          Crear curso
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/CrearCursos";
</style>