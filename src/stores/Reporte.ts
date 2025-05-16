import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ReporteDTO } from '@/stores/dtos/ReporteDTO'

export const useReporteStore = defineStore('reporte', () => {
  const errorMessage = ref<string>("")
  const successMessage = ref<string>("")

  async function crearReporte(nuevoReporte: ReporteDTO) {
    try {
      const response = await fetch('http://localhost:5190/api/ReporteVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(nuevoReporte)
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error al enviar el reporte: ${response.statusText}. ${errorText}`)
      }

      successMessage.value = "Reporte enviado correctamente"
      return true
    } catch (error: any) {
      errorMessage.value = error.message || "Error desconocido"
      console.error(error)
      return false
    }
  }

  return {
    crearReporte,
    errorMessage,
    successMessage
  }
})
