<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed } from 'vue';

// --------------------------- Props ---------------------------
const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

// --------------------------- Variables ---------------------------
const isLiked = ref(false);
const isSubscribed = ref(false);
const showFullDescription = ref(false);

// --------------------------- Computed ---------------------------
// Verificar si la descripción es lo suficientemente larga para mostrar "Leer más"
const descripcionLarga = computed(() => {
  return props.video && props.video.descripcion && props.video.descripcion.length > 150;
});

// Descripción formateada
const descripcionCorta = computed(() => {
  if (props.video && props.video.descripcion) {
    return props.video.descripcion.length > 150 
      ? props.video.descripcion.substring(0, 150) + '...' 
      : props.video.descripcion;
  }
  return 'No hay descripción disponible.';
});

// --------------------------- Métodos ---------------------------
const toggleLike = () => {
  isLiked.value = !isLiked.value;
};

const toggleSubscribe = () => {
  isSubscribed.value = !isSubscribed.value;
};

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};
</script>

<template>
  <div class="VideoInfo">
    <!-- Título del video -->
    <h1 class="VideoInfo__Title text-h5 font-weight-bold">
      {{ video.titulo || video.title || 'Sin título' }}
    </h1>
    
    <!-- Estadísticas y acciones -->
    <div class="VideoInfo__Stats d-flex align-center flex-wrap">
      <div class="VideoInfo__Views d-flex align-center">
        <span>{{ video.vistas || video.views || '0' }} visualizaciones • {{ video.fecha || video.publishedDate || 'Sin fecha' }}</span>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Botones de acción -->
      <div class="VideoInfo__Actions d-flex align-center">
        <v-btn 
          variant="text" 
          prepend-icon="mdi-thumb-up" 
          size="small" 
          :color="isLiked ? 'primary' : ''"
          @click="toggleLike"
        >
          {{ video.likes || '0' }}
        </v-btn>
        
        <v-btn variant="text" prepend-icon="mdi-thumb-down" size="small">
          Dislike
        </v-btn>
        
        <v-btn variant="text" prepend-icon="mdi-share" size="small">
          Compartir
        </v-btn>
        
        <v-btn variant="text" prepend-icon="mdi-download" size="small">
          Descargar
        </v-btn>
      </div>
    </div>
    
    <v-divider class="my-4"></v-divider>
    
    <!-- Información del canal y descripción -->
    <div class="VideoInfo__Channel d-flex">
      <v-avatar size="40" class="mr-3">
        <v-img :src="video.avatar || 'https://picsum.photos/seed/profesor/40/40'" alt="Avatar del canal"></v-img>
      </v-avatar>
      
      <div class="VideoInfo__ChannelInfo flex-grow-1">
        <div class="d-flex align-center">
          <div>
            <div class="font-weight-bold">{{ video.autor || video.channel || 'Profesor' }}</div>
            <div class="text-caption text-grey">{{ video.suscriptores || video.subscribers || '0' }} suscriptores</div>
          </div>
          
          <v-spacer></v-spacer>
          
          <v-btn 
            :color="isSubscribed ? 'grey' : 'red'" 
            :variant="isSubscribed ? 'outlined' : 'flat'"
            @click="toggleSubscribe"
          >
            {{ isSubscribed ? 'Suscrito' : 'Suscribirse' }}
          </v-btn>
        </div>
        
        <!-- Descripción del video -->
        <div class="VideoInfo__Description mt-4">
          <p v-if="!showFullDescription" class="text-body-2">
            {{ descripcionCorta }}
            <v-btn 
              v-if="descripcionLarga" 
              variant="text" 
              size="small" 
              class="px-1 text-body-2" 
              @click="toggleDescription"
            >
              Mostrar más
            </v-btn>
          </p>
          <p v-else class="text-body-2">
            {{ video.descripcion || video.description || 'No hay descripción disponible.' }}
            <v-btn 
              variant="text" 
              size="small" 
              class="px-1 text-body-2" 
              @click="toggleDescription"
            >
              Mostrar menos
            </v-btn>
          </p>
        </div>
      </div>
    </div>
    
    <v-divider class="my-4"></v-divider>
  </div>
</template>

<style scoped>
.VideoInfo {
  padding: 0 16px;
}

.VideoInfo__Title {
  margin-bottom: 8px;
  line-height: 1.2;
}

.VideoInfo__Stats {
  color: #606060;
  font-size: 14px;
}

.VideoInfo__Actions {
  flex-wrap: wrap;
  gap: 8px;
}

.VideoInfo__Description {
  white-space: pre-line;
}

@media (max-width: 600px) {
  .VideoInfo__Stats {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .VideoInfo__Actions {
    margin-top: 8px;
  }
}
</style>