<script setup>
// --------------------------- Imports ---------------------------
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

// --------------------------- Router ---------------------------
const router = useRouter();

// --------------------------- Variables ---------------------------
const historialReciente = ref([
  {
    id: 1,
    titulo: 'Terraria - Update 1.4.5 Official Trailer',
    canal: 'sockrteez',
    vistas: '378K visualizaciones',
    thumbnail: 'https://picsum.photos/id/237/300/200',
    duracion: '1:51'
  },
  {
    id: 2,
    titulo: 'S3 Static Web',
    canal: 'Profe Santos Cloud',
    vistas: '701 visualizaciones',
    thumbnail: 'https://picsum.photos/id/24/300/200',
    duracion: '8:07'
  },
  {
    id: 3,
    titulo: 'Cavani erra contra alianza lima #futbol',
    canal: 'los primero de mayo',
    vistas: '38K visualizaciones',
    thumbnail: 'https://picsum.photos/id/25/300/200',
    duracion: '0:45'
  },
  {
    id: 4,
    titulo: 'DAVOO XENEIZE OPINA DE BOCA 2 ALIANZA LIMA 1',
    canal: 'Davoo Xeneize',
    vistas: '1.4M de visualizaciones',
    thumbnail: 'https://picsum.photos/id/26/300/200',
    duracion: '50:55'
  }
]);

// --------------------------- Métodos ---------------------------
const irAHistorial = () => {
  router.push('/historial');
};

const verVideo = (id) => {
  // En una aplicación real, esto redigiría a la página del video
  console.log(`Ver video ${id}`);
};
</script>

<template>
  <div class="PerfilHistorial">
    <div class="d-flex align-center justify-space-between mb-4">
      <h3 class="text-h6 font-weight-bold">Historial reciente</h3>
      <v-btn 
        variant="text" 
        color="primary" 
        @click="irAHistorial"
        size="small"
      >
        Ver todo
      </v-btn>
    </div>
    
    <v-slide-group
      show-arrows
      class="PerfilHistorial__Slider"
    >
      <v-slide-group-item v-for="video in historialReciente" :key="video.id">
        <v-card 
          width="260" 
          class="PerfilHistorial__Card mx-2" 
          elevation="1" 
          @click="verVideo(video.id)"
        >
          <div class="PerfilHistorial__Thumbnail">
            <v-img 
              :src="video.thumbnail" 
              width="260" 
              height="146" 
              cover
            ></v-img>
            <!-- Duración del video -->
            <div class="PerfilHistorial__Duracion">
              {{ video.duracion }}
            </div>
          </div>
          
          <v-card-item>
            <v-card-title class="text-subtitle-2 font-weight-medium pa-0 PerfilHistorial__Titulo">
              {{ video.titulo }}
            </v-card-title>
            
            <v-card-subtitle class="text-caption pa-0 pt-1 pb-0 text-grey">
              {{ video.canal }}
            </v-card-subtitle>
            
            <v-card-subtitle class="text-caption pa-0 text-grey">
              {{ video.vistas }}
            </v-card-subtitle>
          </v-card-item>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<style scoped>
.PerfilHistorial__Card {
  cursor: pointer;
  transition: transform 0.2s;
}

.PerfilHistorial__Card:hover {
  transform: translateY(-4px);
}

.PerfilHistorial__Thumbnail {
  position: relative;
}

.PerfilHistorial__Duracion {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 12px;
  padding: 1px 4px;
  border-radius: 2px;
}

.PerfilHistorial__Titulo {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 40px;
}

.PerfilHistorial__Slider {
  margin-left: -8px;
  margin-right: -8px;
}
</style>