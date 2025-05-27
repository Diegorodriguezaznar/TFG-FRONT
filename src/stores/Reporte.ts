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

  // POST - Crear nuevo reporte
  async function crearReporte(nuevoReporte: ReporteDTO) {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    try {
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
      
      successMessage.value = "Reporte enviado correctamente. Gracias por ayudarnos a mejorar la plataforma."
      return true
    } catch (err: any) {
      const message = err instanceof TypeError && err.message.includes('Failed to fetch')
        ? 'No se pudo conectar con el servidor. Verifica la conexión.'
        : err.message || 'Error al enviar el reporte'
      
      errorMessage.value = message
      return false
    } finally {
      loading.value = false
    }
  }
  
  // GET - Obtener reportes por video
  async function fetchReportesPorVideo(idVideo: number) {
    loading.value = true
    errorMessage.value = ''
    
    try {
      const response = await fetch(`http://localhost:5190/api/ReporteVideo/video/${idVideo}`)
      
      if (!response.ok) {
        throw new Error(`No se pudieron obtener los reportes: ${response.status}`)
      }
      
      const data = await response.json()
      reportes.value = data
      return reportes.value
    } catch (err: any) {
      const message = err instanceof TypeError && err.message.includes('Failed to fetch')
        ? 'No se pudo conectar con el servidor. Verifica la conexión.'
        : err.message || 'Error al cargar los reportes'
      
      errorMessage.value = message
      return []
    } finally {
      loading.value = false
    }
  }
  
  // GET - Verificar reporte existente
  async function verificarReporteExistente(idUsuario: number, idVideo: number) {
    if (!idUsuario || !idVideo) return false
    
    try {
      const response = await fetch(`http://localhost:5190/api/ReporteVideo/check?idUsuario=${idUsuario}&idVideo=${idVideo}`)
      
      if (!response.ok) return false
      
      const data = await response.json()
      return data.exists || false
    } catch {
      return false
    }
  }
  
  // UTIL - Resetear mensajes
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