<!-- src/components/Explorar/VideoCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/Common/UserAvatar.vue';
import type { VideoDTO } from '@/stores/dtos/VideoDTO';

const props = defineProps<{
  video: VideoDTO;
  vista: 'grid' | 'list';
}>();

const emit = defineEmits<{
  click: [];
}>();

const usuarioLogeadoStore = useUsuarioLogeadoStore();

// Formatear fecha
const formatearFecha = (fechaStr: string) => {
  if (!fechaStr) return 'Fecha desconocida';
  
  try {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return fechaStr;
  }
};

// Formatear duración
const formatearDuracion = (duracion: string) => {
  if (!duracion || duracion === '00:00') return '0:00';
  if (duracion.includes(':')) return duracion;
  
  const segundos = parseInt(duracion) || 0;
  const mins = Math.floor(segundos / 60);
  const secs = segundos % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Obtener rol del usuario basado en el idUsuario
const obtenerRolSimulado = (idUsuario: number) => {
  // Simulación simple: los IDs pares son profesores, impares estudiantes
  if (idUsuario % 3 === 0) return 3; // Admin
  if (idUsuario % 2 === 0) return 2; // Profesor
  return 1; // Estudiante
};

// Computed
const fechaFormateada = computed(() => formatearFecha(props.video.fechaSubida));
const duracionFormateada = computed(() => formatearDuracion(props.video.duracion));
const rolUsuario = computed(() => obtenerRolSimulado(props.video.idUsuario));

// Clases dinámicas
const cardClasses = computed(() => ({
  'VideoCard': true,
  'VideoCard--grid': props.vista === 'grid',
  'VideoCard--list': props.vista === 'list'
}));

const handleClick = () => {
  emit('click');
};
</script>

<template>
  <v-card 
    :class="cardClasses"
    elevation="2"
    @click="handleClick"
  >
    <!-- Vista de grilla -->
    <template v-if="vista === 'grid'">
      <!-- Thumbnail con overlay -->
      <div class="VideoCard__Thumbnail">
        <v-img 
          :src="video.miniatura || `https://picsum.photos/seed/video${video.idVideo}/400/225`" 
          :aspect-ratio="16/9"
          cover
          class="VideoCard__Image"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="red" size="24"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        
        <!-- Duración del video -->
        <div v-if="duracionFormateada !== '0:00'" class="VideoCard__Duration">
          {{ duracionFormateada }}
        </div>
        
        <!-- Play button overlay -->
        <div class="VideoCard__PlayOverlay">
          <v-icon color="white" size="x-large">mdi-play</v-icon>
        </div>
        
        <!-- Chip de asignatura -->
        <v-chip
          v-if="video.asignatura && video.asignatura !== 'General'"
          variant="elevated"
          size="x-small"
          class="VideoCard__SubjectChip"
          color="red"
        >
          {{ video.asignatura }}
        </v-chip>
      </div>
      
      <!-- Información del video -->
      <v-card-item class="VideoCard__Info">
        <div class="d-flex">
          <!-- Avatar del autor -->
          <UserAvatar
            :nombre="video.autor"
            :id-rol="rolUsuario"
            :size="36"
            class="mr-3 mt-1 flex-shrink-0"
          />
          
          <div class="flex-grow-1 min-width-0">
            <v-card-title class="VideoCard__Title">
              {{ video.titulo }}
            </v-card-title>
            
            <v-card-subtitle class="VideoCard__Meta pa-0">
              <div class="VideoCard__Author">{{ video.autor }}</div>
              <div class="VideoCard__Stats">
                <span>{{ fechaFormateada }}</span>
              </div>
            </v-card-subtitle>
          </div>
        </div>
      </v-card-item>
    </template>
    
    <!-- Vista de lista -->
    <template v-else>
      <div class="VideoCard__ListContent">
        <!-- Thumbnail más pequeño -->
        <div class="VideoCard__ListThumbnail">
          <v-img 
            :src="video.miniatura || `https://picsum.photos/seed/video${video.idVideo}/320/180`" 
            :aspect-ratio="16/9"
            cover
            class="VideoCard__ListImage"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="red" size="20"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          
          <!-- Duración en vista lista -->
          <div v-if="duracionFormateada !== '0:00'" class="VideoCard__ListDuration">
            {{ duracionFormateada }}
          </div>
          
          <!-- Play overlay para lista -->
          <div class="VideoCard__ListPlayOverlay">
            <v-icon color="white" size="large">mdi-play</v-icon>
          </div>
        </div>
        
        <!-- Información detallada en vista lista -->
        <div class="VideoCard__ListInfo">
          <div class="d-flex">
            <!-- Avatar en lista -->
            <UserAvatar
              :nombre="video.autor"
              :id-rol="rolUsuario"
              :size="40"
              class="mr-3 flex-shrink-0"
            />
            
            <div class="flex-grow-1">
              <!-- Título más grande en lista -->
              <h3 class="VideoCard__ListTitle">
                {{ video.titulo }}
              </h3>
              
              <!-- Descripción en vista lista -->
              <p class="VideoCard__ListDescription">
                {{ video.descripcion || 'Sin descripción disponible' }}
              </p>
              
              <!-- Metadatos en lista -->
              <div class="VideoCard__ListMeta">
                <div class="d-flex align-center flex-wrap">
                  <span class="VideoCard__ListAuthor">{{ video.autor }}</span>
                  
                  <v-chip
                    v-if="video.asignatura && video.asignatura !== 'General'"
                    variant="outlined"
                    size="x-small"
                    color="red"
                    class="ml-2"
                  >
                    {{ video.asignatura }}
                  </v-chip>
                </div>
                
                <div class="VideoCard__ListStats mt-1">
                  <span>{{ video.vistas || '0' }} vistas</span>
                  <span class="VideoCard__Separator">•</span>
                  <span>{{ fechaFormateada }}</span>
                  <span class="VideoCard__Separator">•</span>
                  <span>{{ video.contadorLikes || 0 }} likes</span>
                </div>
              </div>
            </div>
            
            <!-- Acciones en vista lista -->
            <div class="VideoCard__ListActions">
              <v-btn
                icon
                variant="text"
                color="red"
                size="small"
              >
                <v-icon>mdi-dots-vertical</v-icon>
                <v-tooltip activator="parent" location="bottom">
                  Más opciones
                </v-tooltip>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </template>
  </v-card>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/Video/VideoCard";
</style>