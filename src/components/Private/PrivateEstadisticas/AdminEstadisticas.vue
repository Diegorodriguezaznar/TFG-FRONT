
<script setup lang="ts">
    import GraficoUsuarios from '@/components/Private/PrivateEstadisticas/GraficoUsuarios.vue'
    import GraficoCursos from '@/components/Private/PrivateEstadisticas/GraficoCursos.vue'
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row>
      <v-col cols="12">
        <v-card class="pa-4">
          <v-card-title class="text-h5">Panel de Estadísticas</v-card-title>
          <v-card-subtitle>Visualización de métricas clave del sistema</v-card-subtitle>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" offset-md="2">
        <GraficoUsuarios />
      </v-col>
      <v-col cols="12" md="8" offset-md="2">
        <GraficoCursos />
      </v-col>

    </v-row>
  </v-container>
</template>

