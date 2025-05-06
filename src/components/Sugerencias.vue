<script setup>
// --------------------------- Props ---------------------------
const props = defineProps({
  videos: {
    type: Array,
    default: () => []
  }
});
</script>

<template>
  <div class="Sugerencias">
    <div class="text-h6 font-weight-bold mb-3">Sugerencias</div>
    
    <v-row>
      <v-col v-for="video in videos" :key="video.id" cols="12" sm="6" md="3">
        <v-card class="Sugerencias__Card" elevation="0" rounded="lg">
          <v-img :src="video.thumbnail" height="140" cover class="Sugerencias__Imagen"></v-img>
          
          <v-card-item>
            <v-card-title class="text-subtitle-1 font-weight-bold pa-0">
              {{ video.titulo }}
            </v-card-title>
            
            <v-card-subtitle class="pa-0 pt-1">
              <div class="text-body-2">{{ video.autor }}</div>
              <div class="d-flex text-caption text-grey">
                <span>{{ video.vistas }} visualizaciones</span>
                <v-icon size="small" class="mx-1">mdi-circle-small</v-icon>
                <span>{{ video.fecha }}</span>
              </div>
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.Sugerencias {
  margin-bottom: 16px;
}

.Sugerencias__Card {
  transition: transform 0.2s;
  cursor: pointer;
}

.Sugerencias__Card:hover {
  transform: translateY(-4px);
}

.Sugerencias__Imagen {
  border-radius: 12px;
}
</style>