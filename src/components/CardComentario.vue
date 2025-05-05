<script setup lang="ts">
// --------------------------- Propiedades ---------------------------
defineProps<{
  comentario: {
    id: number;
    usuario: string;
    avatar: string;
    texto: string;
    fecha: string;
  };
}>();
</script>

<template>
  <!-- --------------------------- Comentario Card --------------------------- -->
  <v-card class="Comentario__Card">
    <v-row no-gutters>
      
      <!-- --------------------------- Avatar --------------------------- -->
      <v-col cols="2">
        <v-avatar size="40">
          <img :src="comentario.avatar" alt="Avatar" />
        </v-avatar>
      </v-col>

      <!-- --------------------------- Información del usuario --------------------------- -->
      <v-col cols="3">
        <div class="Comentario__InfoUsuario">
          <v-card-title class="Comentario__InfoUsuario__Nombre">{{ comentario.usuario }}</v-card-title>
          <v-card-subtitle class="Comentario__InfoUsuario__Fecha">{{ comentario.fecha }}</v-card-subtitle>
        </div>
      </v-col>

      <!-- --------------------------- Texto del comentario --------------------------- -->
      <v-col cols="7">
        <v-card-text class="Comentario__InfoUsuario__Comentario">{{ comentario.texto }}</v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/components/Cards/Ccomentario.scss";
</style>
