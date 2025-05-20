// stores/Reporte.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado'
import type { ReporteDTO } from '@/stores/dtos/ReporteDTO'

export const useReporteStore = defineStore('reporte', () => {
  // Estado
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const reportes = ref<ReporteDTO[]>([])

  // Crear un nuevo reporte
  async function crearReporte(nuevoReporte: ReporteDTO) {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    try {
      console.log(`%c🚩 Reportando video ID: ${nuevoReporte.idVideo} - Motivo: ${nuevoReporte.motivo}`, 'color: #ff9800;')
      
      const usuarioStore = useUsuarioLogeadoStore()
      
      const response = await fetch('http://localhost:5190/api/ReporteVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': usuarioStore.usuarioActual?.token ? `Bearer ${usuarioStore.usuarioActual.token}` : ''
        },
        body: JSON.stringify(nuevoReporte)
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al enviar el reporte: ${response.status}. ${errorText}`)
      }
      
      console.log('%c✅ Reporte enviado correctamente', 'color: #42b883;')
      successMessage.value = "Reporte enviado correctamente. Gracias por ayudarnos a mejorar la plataforma."
      return true
    } catch (err: any) {
      console.error('%c❌ Error al enviar reporte:', 'color: #ff5252;', err)
      
      let message = 'Error al enviar el reporte'
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        message = 'No se pudo conectar con el servidor. Verifica la conexión.'
      } else {
        message = err.message || message
      }
      
      errorMessage.value = message
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Obtener reportes de un video específico
  async function fetchReportesPorVideo(idVideo: number) {
    loading.value = true
    errorMessage.value = ''
    
    try {
      console.log(`%c📊 Obteniendo reportes para video ID: ${idVideo}`, 'color: #2196f3;')
      
      const response = await fetch(`http://localhost:5190/api/ReporteVideo/video/${idVideo}`)
      
      if (!response.ok) {
        throw new Error(`No se pudieron obtener los reportes: ${response.status}`)
      }
      
      const data = await response.json()
      reportes.value = data
      
      console.log(`%c✅ Se obtuvieron ${reportes.value.length} reportes`, 'color: #42b883;')
      return reportes.value
    } catch (err: any) {
      console.error('%c❌ Error al obtener reportes:', 'color: #ff5252;', err)
      
      let message = 'Error al cargar los reportes'
      
      if (err instanceof TypeError && err.message.includes('Failed to fetch')) {
        message = 'No se pudo conectar con el servidor. Verifica la conexión.'
      } else {
        message = err.message || message
      }
      
      errorMessage.value = message
      return []
    } finally {
      loading.value = false
    }
  }
  
  // Verificar si un usuario ya reportó un video
  async function verificarReporteExistente(idUsuario: number, idVideo: number) {
    if (!idUsuario || !idVideo) return false
    
    try {
      console.log(`%c🔍 Verificando si el usuario ${idUsuario} ya reportó el video ${idVideo}`, 'color: #9c27b0;')
      
      const response = await fetch(`http://localhost:5190/api/ReporteVideo/check?idUsuario=${idUsuario}&idVideo=${idVideo}`)
      
      if (!response.ok) {
        return false
      }
      
      const data = await response.json()
      return data.exists || false
    } catch (err) {
      console.error('%c❌ Error al verificar reporte existente:', 'color: #ff5252;', err)
      return false
    }
  }
  
  // Resetear mensajes
  function resetMessages() {
    errorMessage.value = ''
    successMessage.value = ''
  }
  
  return {
    loading,
    reportes,
    errorMessage,
    successMessage,
    crearReporte,
    fetchReportesPorVideo,
    verificarReporteExistente,
    resetMessages
  }
})