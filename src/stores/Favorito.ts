import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado"
import type { VideoUI } from '@/models/VideoUI'

export const useFavoritoStore = defineStore('favorito', {
  state: () => ({
    favoritos: [] as VideoUI[],
    loading: false
  }),

  actions: {
    async cargarFavoritos() {
      const usuarioLogeadoStore = useUsuarioLogeadoStore()
      
      // Verificar que el usuario esté autenticado
      if (!usuarioLogeadoStore.usuario?.idUsuario) {
        console.log('No hay usuario autenticado para cargar favoritos')
        this.favoritos = []
        return
      }

      this.loading = true
      try {
        console.log('Cargando favoritos para usuario:', usuarioLogeadoStore.usuario.idUsuario)
        
        const res = await axios.get(`http://localhost:5190/api/favorito/usuario/${usuarioLogeadoStore.usuario.idUsuario}`, {
          headers: {
            'Authorization': `Bearer ${usuarioLogeadoStore.token}`
          }
        })
        
        this.favoritos = res.data
        console.log('Favoritos cargados exitosamente:', this.favoritos.length)
      } catch (err: any) {
        console.error('Error al cargar favoritos:', err.response?.data || err.message)
        this.favoritos = []
      } finally {
        this.loading = false
      }
    },

    esFavorito(idVideo: number | string): boolean {
      if (!idVideo) return false
      
      // Convertir ambos a number para comparación consistente
      const idVideoNum = typeof idVideo === 'string' ? parseInt(idVideo) : idVideo
      const resultado = this.favoritos.some(v => v.idVideo === idVideoNum)
      
      console.log(`¿Es favorito video ${idVideoNum}?`, resultado, 'Total favoritos:', this.favoritos.length)
      return resultado
    },

    async toggleFavorito(idVideo: number | string) {
      const usuarioLogeadoStore = useUsuarioLogeadoStore()
      
      // Verificar autenticación
      if (!usuarioLogeadoStore.usuario?.idUsuario) {
        console.error('Usuario no autenticado para toggle favorito')
        return false
      }

      if (!usuarioLogeadoStore.token) {
        console.error('Token no disponible para toggle favorito')
        return false
      }

      // Convertir a number
      const idVideoNum = typeof idVideo === 'string' ? parseInt(idVideo) : idVideo
      
      if (isNaN(idVideoNum)) {
        console.error('ID de video inválido:', idVideo)
        return false
      }

      try {
        console.log('🔄 Iniciando toggle favorito:', { 
          idUsuario: usuarioLogeadoStore.usuario.idUsuario, 
          idVideo: idVideoNum,
          token: usuarioLogeadoStore.token ? 'Presente' : 'Ausente'
        })

        const res = await axios.post(
          `http://localhost:5190/api/favorito/toggle/${idVideoNum}`, 
          {}, // Body vacío
          {
            headers: {
              'Authorization': `Bearer ${usuarioLogeadoStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        console.log('✅ Respuesta del toggle:', res.data)

        // Determinar si se añadió o removió
        const añadido = res.data === true || res.data.added === true || res.data.mensaje?.includes('añadido')
        
        if (añadido) {
          console.log('➕ Video añadido a favoritos')
          // Solo añadir si no está ya en la lista
          if (!this.esFavorito(idVideoNum)) {
            try {
              // Obtener datos completos del video
              const videoRes = await axios.get(`http://localhost:5190/api/video/${idVideoNum}`)
              this.favoritos.push(videoRes.data)
            } catch (videoErr) {
              console.warn('No se pudieron obtener datos del video, recargando favoritos')
              await this.cargarFavoritos()
            }
          }
        } else {
          console.log('➖ Video removido de favoritos')
          // Remover de la lista local
          this.favoritos = this.favoritos.filter(v => v.idVideo !== idVideoNum)
        }

        return añadido
      } catch (err: any) {
        console.error('❌ Error al hacer toggle de favorito:', {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message
        })
        
        // En caso de error, recargar favoritos para mantener consistencia
        await this.cargarFavoritos()
        return false
      }
    },

    // Método auxiliar para limpiar favoritos al logout
    limpiarFavoritos() {
      this.favoritos = []
      console.log('Favoritos limpiados')
    }
  }
})