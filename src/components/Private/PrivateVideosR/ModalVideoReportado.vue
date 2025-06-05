<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { VideoDTO } from '@/stores/dtos/VideoDTO'
import ModalListadoReportes from './ModalListadoReportes.vue'

const props = defineProps<{
  mostrar: boolean
  video: VideoDTO | null
}>()

const emit = defineEmits(['update:mostrar', 'aprobar', 'eliminar'])
const router = useRouter()

function verVideo() {
  if (props.video) {
    router.push(`/reproductor-video?id=${props.video.idVideo}`)
  }
}

const mostrarListadoReportes = ref(false)
</script>

<template>
  <v-dialog :model-value="mostrar" max-width="700px" @update:model-value="emit('update:mostrar', $event)">
    <v-card v-if="video">
      <v-img
        :src="video.miniatura || '/img/placeholder.png'"
        height="200"
        cover
        class="align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      >
        <v-card-title class="text-white">
          {{ video.titulo }}
        </v-card-title>
      </v-img>

      <v-card-text>
        <div class="d-flex align-center mb-2 flex-wrap">
          <v-chip color="error" class="me-2" :text="`${video.numReportes} reportes`" />
          <v-btn variant="text" size="small" color="primary" @click="mostrarListadoReportes = true">
            Ver listado de reportes
          </v-btn>
        </div>

        <p class="text-subtitle-1 mb-1">Autor: {{ video.autor }}</p>

        <p class="text-body-1 mb-4">{{ video.descripcion || 'Sin descripción disponible' }}</p>

        <v-divider class="mb-4" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="success" @click="emit('aprobar', video.idVideo)">
          <v-icon class="me-2">mdi-check</v-icon>
          Aprobar Video
        </v-btn>
        <v-btn color="info" variant="tonal" @click="verVideo">
          <v-icon class="me-2">mdi-play-circle</v-icon>
          Ver Video
        </v-btn>
        <v-btn text @click="emit('update:mostrar', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Modal de listado de reportes -->
  <ModalListadoReportes
    v-if="video"
    :mostrar="mostrarListadoReportes"
    :id-video="video.idVideo"
    @update:mostrar="mostrarListadoReportes = $event"
  />
</template>
