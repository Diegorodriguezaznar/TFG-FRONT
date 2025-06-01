<template>
  <section class="FuncionalidadesPrincipales">
    <v-container>
      <div class="FuncionalidadesPrincipales__Header">
        <h2 class="FuncionalidadesPrincipales__Title">¿Qué puedes hacer en AcademIQ?</h2>
        <p class="FuncionalidadesPrincipales__Subtitle">
          Descubre todas las herramientas que tenemos para potenciar tu aprendizaje
        </p>
      </div>

      <v-row class="FuncionalidadesPrincipales__Cards" no-gutters>
        <!-- Cursos -->
        <v-col cols="12" md="4" lg="4" xl="4">
          <div class="FuncionalidadesPrincipales__CardWrapper">
            <FeatureCard
              icono="mdi-book-education"
              color="blue"
              titulo="Explorar Cursos"
              descripcion="Accede a una amplia biblioteca de cursos organizados por temas y niveles de dificultad. Cada curso está cuidadosamente estructurado con lecciones progresivas que te guiarán desde los conceptos básicos hasta los más avanzados."
              :caracteristicas="[
                'Cursos organizados por categorías',
                'Contenidos personalizados',
                'Mucho contenido',
                'Expande tus conocimientos'
              ]"
              texto-boton="Comenzar a Aprender"
              icono-boton="mdi-rocket-launch"
              ruta="/cursos"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- Videos -->
        <v-col cols="12" md="4" lg="4" xl="4">
          <div class="FuncionalidadesPrincipales__CardWrapper">
            <FeatureCard
              icono="mdi-play-circle"
              color="red"
              titulo="Biblioteca de Videos"
              descripcion="Sumérgete en nuestra extensa colección de videos educativos creados por profesores expertos. Desde tutoriales paso a paso hasta conferencias magistrales, encontrarás contenido visual que hace el aprendizaje más dinámico y comprensible."
              :caracteristicas="[
                'Gran catalogo de contenido',
                'Marcadores de tiempo para navegación',
                'Comentarios e interacción',
                'Filtros avanzados de búsqueda'
              ]"
              texto-boton="Explorar Videos"
              icono-boton="mdi-play"
              ruta="/explorar"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- Quizzes -->
        <v-col cols="12" md="4" lg="4" xl="4">
          <div class="FuncionalidadesPrincipales__CardWrapper">
            <FeatureCard
              icono="mdi-brain"
              color="purple"
              titulo="Quizzes Interactivos"
              descripcion="Pon a prueba y consolida tus conocimientos con nuestros quizzes interactivos. Diseñados para reforzar el aprendizaje, cada quiz te ayuda a identificar áreas de mejora y celebrar tus logros académicos."
              :caracteristicas="[
                'Preguntas de múltiple opción',
                'Aumenta tus conocimientos',
                'Consigue la maxima puntuación',
                'Revisión de respuestas incorrectas'
              ]"
              texto-boton="Hacer Quiz"
              icono-boton="mdi-lightning-bolt"
              ruta="/cursos"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import FeatureCard from '@/components/HomePage/FeatureCard.vue';

// Emits
defineEmits<{
  navegar: [ruta: string];
}>();
</script>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/FuncionalidadesPrincipales";
</style>