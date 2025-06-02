<script setup lang="ts">
import { ref, computed } from 'vue';
import { useCursoStore } from '@/stores/Curso';
import HeaderCrearCursos from '@/components/Layout/HeaderCreacionCurso.vue';
import SideBar from '@/components/Layout/Sidebar.vue';
import CursoDatos from '@/components/Cursos/CrearCursos/CursoDatos.vue';
import CursoResumen from '@/components/Cursos/CrearCursos/CursoResumen.vue';

const cursoStore = useCursoStore();

const cursoDatosRef = ref();
const drawer = ref(false);

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

// Método para manejar el toggle del sidebar
const toggleSidebar = () => {
  drawer.value = !drawer.value;
};

// Método para manejar la búsqueda (opcional, si necesitas funcionalidad de búsqueda)
const handleSearch = (query) => {
  // Implementar lógica de búsqueda si es necesaria
  console.log('Búsqueda:', query);
};
</script>

<template>
  <v-app>
    <HeaderCrearCursos @toggle-sidebar="toggleSidebar" @update-search="handleSearch" />
    <SideBar v-model="drawer" />

    <v-main class="CrearCursoPage">
      <v-container class="CrearCurso">
        <v-card class="CrearCurso__Card">
          <v-card-title class="CrearCurso__Header">
            <v-icon size="32" class="CrearCurso__Icon">mdi-school</v-icon>
            <span class="CrearCurso__Title">Crear nuevo curso</span>
          </v-card-title>

          <v-card-text class="CrearCurso__Content">
            <v-row v-if="!showSuccess">
              <v-col cols="12" md="7">
                <CursoDatos ref="cursoDatosRef" v-model="cursoForm" />
              </v-col>

              <v-col cols="12" md="5">
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
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/CrearCursos";

.CrearCursoPage {
  background: #f5f5f5;
  padding-top: 0 !important;
}
</style>