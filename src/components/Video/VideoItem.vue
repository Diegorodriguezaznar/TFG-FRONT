<script setup>
// --------------------------- Props ---------------------------
const props = defineProps({
  video: {
    type: Object,
    required: true
  }
});

// --------------------------- Emits ---------------------------
const emit = defineEmits(['ver-video', 'eliminado']);

// --------------------------- Stores ---------------------------
import { useVideoStore } from '@/stores/Video';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/Common/UserAvatar.vue';

const videoStore = useVideoStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// --------------------------- Métodos ---------------------------
const verVideo = () => {
  emit('ver-video', props.video.id);
};

const eliminarVideo = async () => {
  const exito = await videoStore.eliminarVideoPropio(props.video.id);
  if (exito) {
    emit('eliminado', props.video.id);
  }
};

// Función para obtener rol simulado basado en el nombre del autor
const obtenerRolAutor = () => {
  const autor = props.video?.autor?.toLowerCase() || '';
  if (autor.includes('profe') || autor.includes('profesor')) {
    return 2; // Profesor
  } else if (autor.includes('admin') || autor.includes('director')) {
    return 3; // Administrador
  }
  return 1; // Estudiante por defecto
};

// --------------------------- Colores para asignaturas ---------------------------
const getColorForAsignatura = (asignatura) => {
  const colores = {
    'Mates': 'blue',
    'Lengua': 'deep-purple',
    'Historia': 'brown',
    'Física': 'indigo',
    'Química': 'green',
    'Biología': 'teal',
    'Inglés': 'red',
    'Arte': 'pink',
    'Informática': 'orange',
    'Música': 'cyan'
  };
  
  return colores[asignatura] || 'grey';
};
</script>

<template>
  <v-card class="VideoItem" elevation="1" rounded="lg" @click="verVideo">
    <v-img :src="video.thumbnail" height="180" cover>
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="grey-lighten-4"></v-progress-circular>
        </v-row>
      </template>
    </v-img>
    
    <v-card-item>
      <v-row no-gutters>
        <v-col cols="auto" class="mr-3">
          <!-- Avatar personalizado del autor -->
          <UserAvatar
            :nombre="video.autor || 'Usuario'"
            :id-rol="obtenerRolAutor()"
            :size="36"
          />
        </v-col>
        
        <v-col>
          <v-card-title class="text-subtitle-1 font-weight-bold px-0 py-0">
            {{ video.titulo }}
          </v-card-title>
          
          <v-card-subtitle class="px-0 py-1">
            <div class="text-body-2">{{ video.autor }}</div>
            <div class="d-flex text-caption text-grey">
              <v-icon size="small" class="mx-1">mdi-circle-small</v-icon>
              <span>{{ video.fecha }}</span>
            </div>
          </v-card-subtitle>
        </v-col>
      </v-row>
    </v-card-item>

    <!-- Botón de eliminar visible solo si es del usuario -->
    <v-btn
      v-if="video.idUsuario === usuarioLogeadoStore.usuarioActual?.idUsuario"
      class="ma-2"
      color="error"
      variant="text"
      @click.stop="eliminarVideo"
    >
      Eliminar
    </v-btn>

    <!-- Etiqueta de asignatura -->
    <v-chip
      variant="elevated"
      size="small"
      class="VideoItem__Etiqueta"
      :color="getColorForAsignatura(video.asignatura)"
    >
      {{ video.asignatura }}
    </v-chip>
  </v-card>
</template>

<style scoped>
.VideoItem {
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  margin-bottom: 16px;
}

.VideoItem:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.VideoItem__Etiqueta {
  position: absolute;
  top: 8px;
  right: 8px;
}
</style>