<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'
import { useReporteStore } from '@/stores/Reporte'
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado'
import type { ReporteDTO } from '@/stores/dtos/ReporteDTO'

const props = defineProps<{
  idVideo: number
}>()

const reporteStore = useReporteStore()
const usuarioStore = useUsuarioLogeadoStore()
const dialogReportar = ref(false)
const motivoSeleccionado = ref('Contenido engañoso')
const motivos = [
  'Contenido engañoso',
  'Violación de privacidad',
  'Contenido explícito',
  'Acoso o bullying',
  'Spam',
  'Otro'
]

// Resetear mensajes cuando se cierra el diálogo
watch(dialogReportar, (nuevoValor) => {
  if (!nuevoValor) {
    // Esperar un momento antes de resetear para que las animaciones terminen
    setTimeout(() => {
      reporteStore.resetMessages()
    }, 300)
  }
})

// Cuando el reporte se envía con éxito, cerrar automáticamente después de un breve retraso
watch(() => reporteStore.successMessage, (mensaje) => {
  if (mensaje) {
    setTimeout(() => {
      dialogReportar.value = false
    }, 2000)
  }
})

const enviarReporte = async () => {
  if (!usuarioStore.estaAutenticado) {
    reporteStore.errorMessage = 'Debes iniciar sesión para reportar un video'
    return
  }
  
  const nuevoReporte: ReporteDTO = {
    idVideo: props.idVideo,
    idUsuario: usuarioStore.usuarioActual?.idUsuario || 0,
    motivo: motivoSeleccionado.value
  }
  
  await reporteStore.crearReporte(nuevoReporte)
}
</script>

<template>
  <div>
    <v-btn
      class="mt-4"
      color="red"
      variant="outlined"
      prepend-icon="mdi-flag"
      block
      @click="dialogReportar = true"
    >
      Reportar vídeo
    </v-btn>

    <v-dialog v-model="dialogReportar" max-width="500px">
      <v-card>
        <v-card-title>Reportar este vídeo</v-card-title>
        
        <v-card-text>
          <!-- Mensaje de éxito -->
          <v-alert
            v-if="reporteStore.successMessage"
            type="success"
            density="compact"
            variant="tonal"
            class="mb-4"
          >
            {{ reporteStore.successMessage }}
          </v-alert>
          
          <!-- Mensaje de error -->
          <v-alert
            v-if="reporteStore.errorMessage"
            type="error"
            density="compact"
            variant="tonal"
            class="mb-4"
          >
            {{ reporteStore.errorMessage }}
          </v-alert>
          
          <p class="text-body-1 mb-4" v-if="!reporteStore.successMessage">
            Por favor, indica el motivo por el que quieres reportar este video. 
            Nuestro equipo revisará el contenido y tomará las medidas necesarias.
          </p>
          
          <v-radio-group 
            v-model="motivoSeleccionado"
            v-if="!reporteStore.successMessage"
          >
            <v-radio
              v-for="motivo in motivos"
              :key="motivo"
              :label="motivo"
              :value="motivo"
              color="warning"
            />
          </v-radio-group>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn 
            text 
            @click="dialogReportar = false" 
            :disabled="reporteStore.loading"
          >
            {{ reporteStore.successMessage ? 'Cerrar' : 'Cancelar' }}
          </v-btn>
          
          <v-btn 
            v-if="!reporteStore.successMessage"
            color="error" 
            @click="enviarReporte"
            :loading="reporteStore.loading"
            :disabled="reporteStore.loading"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>