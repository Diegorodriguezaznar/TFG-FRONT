<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoStore } from '@/stores/Video'
import type { VideoDTO } from '@/stores/dtos/VideoDTO'

const videoStore = useVideoStore()
const errorMensaje = ref('')
const mostrarError = ref(false)
const videoSeleccionado = ref<VideoDTO | null>(null)
const dialogDetalles = ref(false)
const dialogConfirmarEliminar = ref(false)

// Cargar videos reportados al montar el componente
onMounted(() => {
  cargarVideosReportados()
})

async function cargarVideosReportados() {
  try {
    await videoStore.fetchVideosReportados()
  } catch (error: any) {
    mostrarMensajeError(error.message || 'Error al cargar los videos reportados')
  }
}

function verDetalles(video: VideoDTO) {
  videoSeleccionado.value = { ...video }
  dialogDetalles.value = true
}

function abrirDialogoEliminar(video: VideoDTO) {
  videoSeleccionado.value = { ...video }
  dialogConfirmarEliminar.value = true
}

async function confirmarAprobar() {
  if (!videoSeleccionado.value) return

  try {
    const resultado = await videoStore.aprobarVideo(videoSeleccionado.value.idVideo)
    if (resultado) {
      dialogDetalles.value = false
      mostrarMensajeExito('Video aprobado correctamente')
    } else {
      mostrarMensajeError('No se pudo aprobar el video')
    }
  } catch (error: any) {
    mostrarMensajeError(error.message || 'Error al aprobar el video')
  }
}

async function confirmarEliminar() {
  if (!videoSeleccionado.value) return

  try {
    const resultado = await videoStore.eliminarVideo(videoSeleccionado.value.idVideo)
    if (resultado) {
      dialogConfirmarEliminar.value = false
      mostrarMensajeExito('Video eliminado correctamente')
    } else {
      mostrarMensajeError('No se pudo eliminar el video')
    }
  } catch (error: any) {
    mostrarMensajeError(error.message || 'Error al eliminar el video')
  }
}

function mostrarMensajeError(mensaje: string) {
  errorMensaje.value = mensaje
  mostrarError.value = true
}

// Variable para mensajes de éxito
const mensajeExito = ref('')
const mostrarExito = ref(false)

function mostrarMensajeExito(mensaje: string) {
  mensajeExito.value = mensaje
  mostrarExito.value = true
}
</script>

<template>
  <section class="admin-videos-reportados">
    <h2 class="text-h6 text-md-h5 mb-4">Videos Reportados</h2>

    <div v-if="videoStore.loading" class="d-flex justify-center my-4">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <div v-else-if="videoStore.videosReportados.length === 0" class="text-center my-8">
      <v-icon size="64" color="success">mdi-check-circle</v-icon>
      <h3 class="text-h6 mt-4">No hay videos reportados</h3>
      <p class="text-body-1 mt-2">Todos los videos cumplen con las normas de la comunidad.</p>
    </div>

    <v-table v-else>
      <thead>
        <tr>
          <th>Miniatura</th>
          <th>Título</th>
          <th>Autor</th>
          <th>Asignatura</th>
          <th>Curso</th>
          <th class="text-center">Reportes</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="video in videoStore.videosReportados" :key="video.idVideo">
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
          <td>{{ video.autor }}</td>
          <td>{{ video.asignatura }}</td>
          <td>{{ video.idCurso }}</td>
          <td class="text-center">
            <v-chip color="error" :text="String(video.numReportes)"></v-chip>
          </td>
          <td>
            <div class="d-flex">
              <v-btn
                color="info"
                variant="text"
                icon
                size="small"
                class="me-2"
                @click="verDetalles(video)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>

              <v-btn
                color="error"
                variant="text"
                icon
                size="small"
                @click="abrirDialogoEliminar(video)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <!-- Modal de detalles del video -->
    <v-dialog v-model="dialogDetalles" max-width="700px">
      <v-card v-if="videoSeleccionado">
        <v-img 
          :src="videoSeleccionado.miniatura || '/img/placeholder.png'" 
          height="200" 
          cover
          class="align-end"
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        >
          <v-card-title class="text-white">
            {{ videoSeleccionado.titulo }}
          </v-card-title>
        </v-img>

        <v-card-text>
          <div class="d-flex align-center mb-2">
            <v-chip color="error" class="me-2" :text="`${videoSeleccionado.numReportes} reportes`"></v-chip>
            <v-chip size="small" color="primary" class="me-2">{{ videoSeleccionado.asignatura }}</v-chip>
            <v-chip size="small" variant="outlined">Curso {{ videoSeleccionado.idCurso }}</v-chip>
          </div>

          <p class="text-subtitle-1 mb-1">Autor: {{ videoSeleccionado.autor }}</p>
          <p class="text-subtitle-2 mb-4">Subido: {{ videoSeleccionado.fecha }}</p>
          
          <p class="text-body-1 mb-4">{{ videoSeleccionado.descripcion || 'Sin descripción disponible' }}</p>
          
          <v-divider class="mb-4"></v-divider>
          
          <h3 class="text-h6 mb-2">Información del video</h3>
          <v-list density="compact">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-eye"></v-icon>
              </template>
              <v-list-item-title>{{ videoSeleccionado.vistas }} visualizaciones</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-clock-outline"></v-icon>
              </template>
              <v-list-item-title>Duración: {{ videoSeleccionado.duracion }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-flag"></v-icon>
              </template>
              <v-list-item-title>Reportes: {{ videoSeleccionado.numReportes }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="confirmarAprobar">
            <v-icon class="me-2">mdi-check</v-icon>
            Aprobar Video
          </v-btn>
          <v-btn color="error" @click="abrirDialogoEliminar(videoSeleccionado)">
            <v-icon class="me-2">mdi-delete</v-icon>
            Eliminar Video
          </v-btn>
          <v-btn text @click="dialogDetalles = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Modal confirmar eliminación -->
    <v-dialog v-model="dialogConfirmarEliminar" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar el video "{{ videoSeleccionado?.titulo }}"?
          Esta acción no se puede deshacer.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialogConfirmarEliminar = false">Cancelar</v-btn>
          <v-btn color="error" @click="confirmarEliminar">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para errores -->
    <v-snackbar
      v-model="mostrarError"
      :timeout="5000"
      color="error"
    >
      {{ errorMensaje }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="mostrarError = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Snackbar para mensajes de éxito -->
    <v-snackbar
      v-model="mostrarExito"
      :timeout="3000"
      color="success"
    >
      {{ mensajeExito }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="mostrarExito = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </section>
</template>

<style scoped lang="scss">
.admin-videos-reportados {
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }
}
</style>