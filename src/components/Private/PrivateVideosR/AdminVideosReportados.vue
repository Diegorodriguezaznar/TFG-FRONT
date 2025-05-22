<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVideoStore } from '@/stores/Video'
import type { VideoDTO } from '@/stores/dtos/VideoDTO'
import VideoReportadoFila from '@/components/Private/PrivateVideosR/VideoReportadoFila.vue'
import ModalVideoReportado from '@/components/Private/PrivateVideosR/ModalVideoReportado.vue'
import ModalConfirmarEliminar from '@/components/Private/PrivateVideosR/ModalConfirmarEliminar.vue'
import ModalConfirmarAprobar from '@/components/Private/PrivateVideosR/ModalConfirmarAprobar.vue' // Nuevo componente

const videoStore = useVideoStore()
const errorMensaje = ref('')
const mostrarError = ref(false)
const videoSeleccionado = ref<VideoDTO | null>(null)
const dialogDetalles = ref(false)
const dialogConfirmarEliminar = ref(false)
const dialogConfirmarAprobar = ref(false) // Nuevo estado para el diálogo de aprobación
const mensajeExito = ref('')
const mostrarExito = ref(false)

onMounted(() => {
  console.log('%c📋 Componente de administración de videos reportados montado', 'color: #42b883; font-weight: bold;')
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

function abrirDialogoAprobar(id: number) {
  const video = videoStore.videosReportados.find(v => v.idVideo === id)
  if (video) {
    videoSeleccionado.value = { ...video }
    dialogConfirmarAprobar.value = true
  }
}

function abrirDialogoEliminar(video: VideoDTO) {
  videoSeleccionado.value = { ...video }
  dialogConfirmarEliminar.value = true
}

async function confirmarAprobar(id: number) {
  try {
    const resultado = await videoStore.aprobarVideo(id)
    
    if (resultado) {
      dialogConfirmarAprobar.value = false
      dialogDetalles.value = false
      mostrarMensajeExito('Video aprobado correctamente')
    } else {
      throw new Error('No se pudo aprobar el video')
    }
  } catch (error: any) {
    mostrarMensajeError(error.message || 'Error al aprobar el video')
  }
}

async function confirmarEliminar(id: number) {
  try {
    const resultado = await videoStore.eliminarVideo(id)
    
    if (resultado) {
      dialogConfirmarEliminar.value = false
      dialogDetalles.value = false
      mostrarMensajeExito('Video eliminado correctamente')
    } else {
      throw new Error('No se pudo eliminar el video')
    }
  } catch (error: any) {
    mostrarMensajeError(error.message || 'Error al eliminar el video')
  }
}

function mostrarMensajeError(mensaje: string) {
  errorMensaje.value = mensaje
  mostrarError.value = true
}

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
        <VideoReportadoFila
          v-for="video in videoStore.videosReportados"
          :key="video.idVideo"
          :video="video"
          @ver="verDetalles"
          @eliminar="abrirDialogoEliminar"
        />
      </tbody>
    </v-table>

    <!-- Modal de detalles del video -->
    <ModalVideoReportado
      :mostrar="dialogDetalles"
      :video="videoSeleccionado"
      @update:mostrar="dialogDetalles = $event"
      @aprobar="abrirDialogoAprobar"
      @eliminar="abrirDialogoEliminar"
    />

    <!-- Modal para confirmar eliminación -->
    <ModalConfirmarEliminar
      :mostrar="dialogConfirmarEliminar"
      :video="videoSeleccionado"
      @update:mostrar="dialogConfirmarEliminar = $event"
      @confirmar="confirmarEliminar"
    />

    <!-- Modal para confirmar aprobación -->
    <ModalConfirmarAprobar
      :mostrar="dialogConfirmarAprobar"
      :video="videoSeleccionado"
      @update:mostrar="dialogConfirmarAprobar = $event"
      @confirmar="confirmarAprobar"
    />

    <!-- Notificaciones -->
    <v-snackbar v-model="mostrarError" :timeout="5000" color="error">
      {{ errorMensaje }}
      <template v-slot:actions>
        <v-btn variant="text" @click="mostrarError = false">Cerrar</v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="mostrarExito" :timeout="3000" color="success">
      {{ mensajeExito }}
      <template v-slot:actions>
        <v-btn variant="text" @click="mostrarExito = false">Cerrar</v-btn>
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