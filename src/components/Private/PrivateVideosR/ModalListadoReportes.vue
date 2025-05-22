<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { defineProps, defineEmits } from 'vue'
import type { ReporteVideoRespuestaDTO } from '@/stores/dtos/ReporteVideoRespuestaDTO'

const props = defineProps<{
  mostrar: boolean
  idVideo: number
}>()

const emit = defineEmits(['update:mostrar'])

const reportes = ref<ReporteVideoRespuestaDTO[]>([])
const cargando = ref(false)
const error = ref('')

async function cargarReportes() {
  if (!props.idVideo) return;
  
  try {
    cargando.value = true
    const res = await fetch(`http://localhost:5190/api/ReporteVideo/video/${props.idVideo}`)
    
    if (!res.ok) throw new Error('Error al obtener los reportes')
    
    reportes.value = await res.json()
    error.value = ''
  } catch (err: any) {
    error.value = err.message || 'Error inesperado'
    reportes.value = []
  } finally {
    cargando.value = false
  }
}

// Observamos cambios en el ID del video
watch(() => props.idVideo, (nuevoId) => {
  if (nuevoId && props.mostrar) {
    cargarReportes()
  }
})

// Observamos cambios en la visibilidad del modal
watch(() => props.mostrar, (visible) => {
  if (visible && props.idVideo) {
    cargarReportes()
  }
})

// También cargamos al montar si es necesario
onMounted(() => {
  if (props.mostrar && props.idVideo) {
    cargarReportes()
  }
})
</script>

<template>
  <v-dialog :model-value="mostrar" max-width="600px" @update:model-value="emit('update:mostrar', $event)">
    <v-card>
      <v-card-title>Reportes del video</v-card-title>

      <v-card-text>
        <div v-if="cargando" class="d-flex justify-center py-4">
          <v-progress-circular indeterminate color="primary" />
        </div>

        <div v-else-if="error">
          <v-alert type="error" density="compact">{{ error }}</v-alert>
        </div>

        <v-list v-else>
          <v-list-item v-for="reporte in reportes" :key="reporte.idReporte">
            <!-- ¡Aquí está el cambio principal! Ya no usamos v-list-item-content -->
            <template v-slot:prepend>
              <v-icon icon="mdi-flag" color="warning" class="mr-2"></v-icon>
            </template>
            
            <v-list-item-title class="font-weight-medium">{{ reporte.motivo }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ reporte.nombreUsuario }} • {{ new Date(reporte.fecha).toLocaleString() }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <div v-if="!reportes.length && !error" class="text-center text-grey mt-2">
          Este video no tiene reportes registrados.
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="emit('update:mostrar', false)">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>