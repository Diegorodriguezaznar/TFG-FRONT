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
    // GET - Cargar favoritos del usuario
    async cargarFavoritos() {
      const usuarioLogeadoStore = useUsuarioLogeadoStore()
      
      if (!usuarioLogeadoStore.usuarioActual?.idUsuario) {
        this.favoritos = []
        return
      }

      this.loading = true
      try {
        const res = await axios.get(`http://34.198.50.70:5000/api/favorito/usuario/${usuarioLogeadoStore.usuarioActual.idUsuario}`, {
          headers: {
            'Authorization': `Bearer ${usuarioLogeadoStore.token}`
          }
        })
        
        this.favoritos = res.data
      } catch (err: any) {
        this.favoritos = []
      } finally {
        this.loading = false
      }
    },

    // Verificar si un video es favorito
    esFavorito(idVideo: number | string): boolean {
      if (!idVideo) return false
      
      const idVideoNum = typeof idVideo === 'string' ? parseInt(idVideo) : Number(idVideo)
      
      if (isNaN(idVideoNum)) return false
      
      return this.favoritos.some(v => Number(v.idVideo) === idVideoNum)
    },

    // POST - Toggle favorito
    async toggleFavorito(idVideo: number | string) {
      const usuarioLogeadoStore = useUsuarioLogeadoStore()
      
      if (!usuarioLogeadoStore.usuarioActual?.idUsuario) {
        throw new Error('Usuario no autenticado')
      }

      if (!usuarioLogeadoStore.token) {
        throw new Error('Token no disponible')
      }

      const idVideoNum = typeof idVideo === 'string' ? parseInt(idVideo) : Number(idVideo)
      
      if (isNaN(idVideoNum)) {
        throw new Error('ID de video inválido')
      }

      try {
        const res = await axios.post(
          `http://34.198.50.70:5000/api/favorito/toggle/${idVideoNum}`, 
          {}, 
          {
            headers: {
              'Authorization': `Bearer ${usuarioLogeadoStore.token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const añadido = res.data.liked === true
        
        if (añadido) {
          if (!this.esFavorito(idVideoNum)) {
            try {
              const videoRes = await axios.get(`http://34.198.50.70:5000/api/video/${idVideoNum}`, {
                headers: {
                  'Authorization': `Bearer ${usuarioLogeadoStore.token}`
                }
              })
              this.favoritos.push(videoRes.data)
            } catch (videoErr) {
              await this.cargarFavoritos()
            }
          }
        } else {
          this.favoritos = this.favoritos.filter(v => Number(v.idVideo) !== idVideoNum)
        }

        return añadido
      } catch (err: any) {
        try {
          await this.cargarFavoritos()
        } catch (reloadErr) {
        }
        
        throw err
      }
    },

    // Limpiar lista de favoritos
    limpiarFavoritos() {
      this.favoritos = []
    }
  }
})