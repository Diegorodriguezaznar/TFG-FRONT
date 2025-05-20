<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { VideoDTO } from '@/stores/dtos/VideoDTO'

const props = defineProps<{ video: VideoDTO }>()
const emit = defineEmits(['ver', 'eliminar'])
</script>

<template>
  <tr>
    <td width="120">
      <img
        :src="video.miniatura || '/img/placeholder.png'"
        alt="Miniatura"
        width="100"
        height="56"
        class="rounded"
        @error="$event.target.src = '/img/placeholder.png'"
      />
    </td>
    <td>{{ video.titulo }}</td>
    <td>{{ video.nombreAutor || video.usuario?.nombre || 'Sin nombre' }}</td>
    <td>{{ video.asignatura }}</td>
    <td>{{ video.idCurso }}</td>
    <td class="text-center">
      <v-chip color="error" :text="String(video.numReportes)" />
    </td>
    <td>
      <div class="d-flex">
        <v-btn
          color="info"
          variant="text"
          icon
          size="small"
          class="me-2"
          @click="emit('ver', video)"
        >
          <v-icon>mdi-eye</v-icon>
        </v-btn>

        <v-btn
          color="error"
          variant="text"
          icon
          size="small"
          @click="emit('eliminar', video)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </td>
  </tr>
</template>
