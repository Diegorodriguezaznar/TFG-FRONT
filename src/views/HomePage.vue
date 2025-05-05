<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import Headerhome from "@/components/HeaderHome.vue";
import Footer from "@/components/Footer.vue";
import HomeInfoSection from "@/components/HomeInfosection.vue";
import Carousel from "@/components/Carrusel.vue";
import AcademIQ from "@/components/AcademIQ.vue";
import Login from "@/components/Login.vue";

// --------------------------- Imágenes ---------------------------
import imgGradoMedio from "@/assets/images/Carrusel1.jpg";
import imgGradoSuperior from "@/assets/images/Carrusel2.jpg";
import imgGradoMedicina from "@/assets/images/Carrusel3.jpg";
import logoImg from "@/assets/images/logo.png";

// --------------------------- Variables ---------------------------
const router = useRouter();
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const mostrarLogin = ref(false);

// --------------------------- Datos del Carrusel ---------------------------
const slides = ref([
  {
    image: imgGradoMedio,
    title: "Encuentra tu Material de Estudio",
    text: "Descubre material de estudio ofrecido por otros estudiantes",
    showButton: false,
  },
  {
    image: imgGradoSuperior,
    title: "¡Empieza ya!",
    showButton: true,
  },
  {
    image: imgGradoMedicina,
    title: "Sube Archivos",
    text: "Comparte tus proyectos o descubrimientos con la comunidad",
    showButton: false,
  },
]);

// --------------------------- Logo ---------------------------
const logoSrc = logoImg;

// --------------------------- Función para manejar la entrada a cursos ---------------------------
const entrarACursos = () => {
  if (usuarioLogeadoStore.estaAutenticado) {
    router.push("/cursos");
  } else {
    mostrarLogin.value = true;
  }
};
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Headerhome />
    
    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-container class="HomePage__Contenedor">
      <!-- --------------------------- Logo --------------------------- -->
      <div class="HomePage__LogoContenedor">
        <AcademIQ />
      </div>

      <!-- --------------------------- Contenido principal --------------------------- -->
      <v-container class="HomePage__Contenido">
        <section class="HomePage__Seccion">
          
          <!-- --------------------------- Carrusel --------------------------- -->
          <Carousel :slides="slides" @entrarCursos="entrarACursos" />

          <div class="HomePage__Divider">
            <!-- --------------------------- Stepper --------------------------- -->
            <v-stepper :items="['Paso 1', 'Paso 2', 'Paso 3', 'Paso 4']" class="HomePage__Stepper">
              <!-- Paso 1 -->
              <template v-slot:item.1>
                <v-card title="¡Elige tu CURSO!" flat class="HomePage__StepperCard">
                  <div class="HomePage__CardContent">
                    <v-icon icon="mdi-emoticon" size="x-large" color="orange-darken-3" class="HomePage__StepperIcon"></v-icon>
                  </div>
                </v-card>
              </template>

              <!-- Paso 2 -->
              <template v-slot:item.2>
                <v-card title="¡Accede a sus ASIGNATURAS!" flat class="HomePage__StepperCard">
                  <div class="HomePage__CardContent">
                    <v-icon icon="mdi-book-multiple" size="x-large" color="orange-darken-3" class="HomePage__StepperIcon"></v-icon>
                  </div>
                </v-card>
              </template>

              <!-- Paso 3 -->
              <template v-slot:item.3>
                <v-card title="¡Descubre todas sus UNIDADES!" flat class="HomePage__StepperCard">
                  <div class="HomePage__CardContent">
                    <v-icon icon="mdi-food-apple" size="x-large" color="orange-darken-3" class="HomePage__StepperIcon"></v-icon>
                  </div>
                </v-card>
              </template>

              <!-- Paso 4 -->
              <template v-slot:item.4>
                <v-card title="Realiza TEST y explora ARCHIVOS" flat class="HomePage__StepperCard">
                  <div class="HomePage__CardContent">
                    <v-icon icon="mdi-clipboard-check" size="x-large" color="orange-darken-3" class="HomePage__StepperIcon"></v-icon>
                  </div>
                </v-card>
              </template>
            </v-stepper>
          </div>
        </section>
      </v-container>
    </v-container>

    <!-- --------------------------- Home Info Section --------------------------- -->
    <HomeInfoSection />

    <!-- --------------------------- Footer --------------------------- -->
    <Footer />

    <!-- --------------------------- Modal de Login --------------------------- -->
    <Login v-if="mostrarLogin" :mostrar="mostrarLogin" @cerrar="mostrarLogin = false" @login-exitoso="router.push('/cursos')" />
  </v-app>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/pages/Home.scss";
</style>
