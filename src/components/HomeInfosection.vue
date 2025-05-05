<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref } from "vue";

// --------------------------- Variables ---------------------------
const sheet = ref(false);
const dialog = ref(false);

// --------------------------- Redes Sociales ---------------------------
const redesSociales = [
  {
    nombre: "Instagram",
    icono: "../assets/images/Instagram.png",
    link: "https://www.instagram.com/"
  },
  {
    nombre: "Facebook",
    icono: "../assets/images/facebook.png",
    link: "https://www.facebook.com/?locale=es_ES"
  },
  {
    nombre: "Youtube",
    icono: "../assets/images/Youtube.png",
    link: "https://www.youtube.com/?app=desktop&hl=es"
  }
];

</script>

<template>
  <!-- --------------------------- Sección de Información --------------------------- -->
  <section class="InfoSection">
    <div class="InfoSection__Card">
      <h3>Sube y comparte tests</h3>
      <p>Facilitamos la creación y distribución de tests para mejorar el aprendizaje.</p>
    </div>
    <div class="InfoSection__Card">
      <h3>Comparte archivos y documentos</h3>
      <p>Un espacio donde los estudiantes pueden encontrar y compartir apuntes, resúmenes y ejercicios.</p>
    </div>
    <div class="InfoSection__Card">
      <h3>Repositorios públicos para profesores</h3>
      <p>Los profesores pueden organizar y compartir material académico con sus alumnos de manera eficiente.</p>
    </div>
  </section>

  <!-- --------------------------- Sección de Botones --------------------------- -->
  <section class="InfoSection__Botones">
    
    <!-- --------------------------- Dialogo para más información --------------------------- -->
    <v-dialog v-model="dialog" max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <div class="InfoSection__Botones__Contenedor">
          <v-btn v-bind="activatorProps" color="orange-darken-3" size="x-large" class="circular-btn" icon>
            <v-icon>mdi-information</v-icon>
          </v-btn>
        </div>
      </template>
      <v-card title="Más información">
        <v-card-text>
          Texto para info
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cerrar" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- --------------------------- Bottom Sheet para redes sociales --------------------------- -->
    <v-bottom-sheet v-model="sheet">
      <template v-slot:activator="{ props }">
        <div class="InfoSection__Botones__Contenedor">
          <v-btn v-bind="props" color="orange-darken-3" size="x-large" class="circular-btn" icon>
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </template>
      <v-list>
        <v-list-subheader>Nuestras redes sociales</v-list-subheader>
        <v-list-item
          v-for="(tile, index) in redesSociales"
          :key="index"
          :href="tile.link"
          target="_blank"
        >
          <v-list-item-avatar>
            <v-img :src="tile.icono" />
          </v-list-item-avatar>
          <v-list-item-title>{{ tile.nombre }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </section>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/components/InfoSection.scss";
</style>
