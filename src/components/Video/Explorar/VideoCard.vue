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
                <span>{{ video.vistas || '0' }} vistas</span>
                <span class="VideoCard__Separator">•</span>
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

<style scoped>
/* Estilos base */
.VideoCard {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  border: 1px solid rgba(244, 67, 54, 0.1);
  background: white;
  overflow: hidden;
}

.VideoCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(244, 67, 54, 0.15);
  border-color: rgba(244, 67, 54, 0.3);
}

/* Estilos para vista de grilla */
.VideoCard--grid {
  height: 100%;
}

.VideoCard__Thumbnail {
  position: relative;
  overflow: hidden;
}

.VideoCard__Image {
  transition: transform 0.3s ease;
}

.VideoCard:hover .VideoCard__Image {
  transform: scale(1.05);
}

.VideoCard__Duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.VideoCard__PlayOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(244, 67, 54, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.VideoCard:hover .VideoCard__PlayOverlay {
  opacity: 1;
}

.VideoCard__SubjectChip {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 2;
}

.VideoCard__Info {
  padding: 12px;
}

.VideoCard__Title {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.3;
  color: #333;
  padding: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.VideoCard__Meta {
  font-size: 0.8rem;
  color: #666;
}

.VideoCard__Author {
  font-weight: 500;
  color: #333;
  margin-bottom: 2px;
}

.VideoCard__Stats {
  font-size: 0.75rem;
  color: #888;
}

.VideoCard__Separator {
  margin: 0 4px;
}

/* Estilos para vista de lista */
.VideoCard--list {
  margin-bottom: 0;
}

.VideoCard__ListContent {
  display: flex;
  padding: 16px;
  gap: 16px;
}

.VideoCard__ListThumbnail {
  position: relative;
  width: 240px;
  min-width: 240px;
  border-radius: 8px;
  overflow: hidden;
}

.VideoCard__ListImage {
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.VideoCard:hover .VideoCard__ListImage {
  transform: scale(1.02);
}

.VideoCard__ListDuration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 500;
}

.VideoCard__ListPlayOverlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(244, 67, 54, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.VideoCard:hover .VideoCard__ListPlayOverlay {
  opacity: 1;
}

.VideoCard__ListInfo {
  flex: 1;
  min-width: 0;
}

.VideoCard__ListTitle {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.VideoCard__ListDescription {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.4;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.VideoCard__ListAuthor {
  font-weight: 500;
  color: #F44336;
  font-size: 0.9rem;
}

.VideoCard__ListStats {
  font-size: 0.8rem;
  color: #888;
}

.VideoCard__ListActions {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
}

/* Responsive */
@media (max-width: 768px) {
  .VideoCard__ListContent {
    flex-direction: column;
    gap: 12px;
  }
  
  .VideoCard__ListThumbnail {
    width: 100%;
    min-width: unset;
  }
  
  .VideoCard__ListTitle {
    font-size: 1rem;
  }
  
  .VideoCard__ListDescription {
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .VideoCard__Info {
    padding: 10px;
  }
  
  .VideoCard__Title {
    font-size: 0.9rem;
  }
  
  .VideoCard__ListContent {
    padding: 12px;
  }
}

/* Animaciones adicionales */
.VideoCard__SubjectChip {
  animation: slideInDown 0.3s ease-out 0.2s both;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>