import { defineStore } from 'pinia'
import axios from 'axios'
import { useUsuarioStore } from './Usuario'
import type { VideoUI } from '@/models/VideoUI'
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

export const useFavoritoStore = defineStore('favorito', {
  state: () => ({
    favoritos: [] as VideoUI[]
  }),

  actions: {
    async cargarFavoritos() {
      const usuarioStore = useUsuarioStore()
      if (!usuarioStore.usuario?.idUsuario) return

      try {
        const res = await axios.get(`/api/favorito/usuario/${usuarioStore.usuario.idUsuario}`)
        this.favoritos = res.data
        console.log('Favoritos cargados:', this.favoritos) // Debug
      } catch (err) {
        console.error('Error al cargar favoritos', err)
      }
    },

    esFavorito(idVideo: number | string): boolean {
      // Convertir ambos a string para comparación consistente
      const idStr = idVideo.toString()
      const resultado = this.favoritos.some(v => v.idVideo.toString() === idStr)
      console.log(`¿Es favorito ${idStr}?`, resultado) // Debug
      return resultado
    },

    async toggleFavorito(idVideo: number | string) {
      const usuarioStore = useUsuarioStore()
      if (!usuarioStore.usuario?.idUsuario) {
        console.error('No hay usuario logueado')
        return
      }

      // Convertir a number para el API
      const idVideoNum = typeof idVideo === 'string' ? parseInt(idVideo) : idVideo

      try {
        console.log('Enviando toggle favorito:', { 
          idUsuario: usuarioStore.usuario.idUsuario, 
          idVideo: idVideoNum 
        }) // Debug

        const res = await axios.post('/api/favorito/toggle', {
          idUsuario: usuarioStore.usuario.idUsuario,
          idVideo: idVideoNum
        })

        console.log('Respuesta del toggle:', res.data) // Debug

        const añadido = res.data === true || res.data.added === true // Manejar diferentes formatos de respuesta
        
        if (añadido) {
          // Agregar a favoritos
          try {
            const nuevoFavorito = await axios.get(`/api/video/${idVideoNum}`)
            this.favoritos.push(nuevoFavorito.data)
            console.log('Video agregado a favoritos')
          } catch (videoErr) {
            console.error('Error al obtener datos del video:', videoErr)
            // Recargar todos los favoritos como fallback
            await this.cargarFavoritos()
          }
        } else {
          // Remover de favoritos
          this.favoritos = this.favoritos.filter(v => v.idVideo.toString() !== idVideoNum.toString())
          console.log('Video removido de favoritos')
        }
      } catch (err) {
        console.error('Error al hacer toggle de favorito', err)
        // Recargar favoritos en caso de error para mantener consistencia
        await this.cargarFavoritos()
      }
    }
  }
})