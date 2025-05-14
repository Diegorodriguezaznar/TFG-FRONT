// VideoService.ts with fixed S3 authentication issues
import axios from 'axios';

// Tipos de datos
interface VideoDetails {
  title: string;
  description: string;
  thumbnail: File | null;
}

interface Timestamp {
  id: string;
  time: number;
  title: string;
}

interface VideoData {
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  timestamps?: Timestamp[];
  idAsignatura?: number;
  idUsuario?: number;
  idCurso?: number;
}

class VideoService {
  /**
   * Sube un archivo a Amazon S3
   */
  // VideoService.ts - Solo la función uploadFileToS3 modificada
async uploadFileToS3(file: File, type: string, progressCallback: (progress: number) => void = () => {}): Promise<string> {
  try {
    console.log(`Preparando para subir: ${type}/${file.name}`);
    
    // Crear FormData para el archivo
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tipo', type);
    
    // Llamar al nuevo endpoint de subida directa
    const response = await axios.post('/S3/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressCallback(percentCompleted);
        }
      }
    });
    
    console.log('Respuesta del servidor:', response.data);
    
    // El backend devuelve la URL completa del archivo
    if (response.data && response.data.url) {
      return response.data.url;
    }
    
    throw new Error('No se recibió la URL del archivo del servidor');
  } catch (error: any) {
    console.error(`Error al subir ${type} a S3:`, error);
    
    // Mejorar el registro de errores para depuración
    if (error.response) {
      console.error('Datos de respuesta de error:', error.response.data);
      console.error('Estado de respuesta de error:', error.response.status);
    }
    
    throw error;
  }
}
  


  async createVideo(videoData: VideoData): Promise<any> {
    try {
      console.log('Datos para registrar video:', videoData);
      
      // Obtener el ID del usuario actual del almacenamiento local si está disponible
      const currentUser = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user') || '{}')
        : null;
      
      const userId = currentUser?.id || 1; // Usar 1 como valor predeterminado si no hay usuario
      
      const requestData = {
        Titulo: videoData.title,
        Descripcion: videoData.description || '',
        UrlVideo: videoData.videoUrl,
        UrlMiniatura: videoData.thumbnailUrl,
        // Usar valores proporcionados o predeterminados
        IdCurso: videoData.idCurso || 1,
        IdAsignatura: videoData.idAsignatura || 1,
        IdUsuario: videoData.idUsuario || userId,
        Marcadores: videoData.timestamps ? videoData.timestamps.map(ts => ({
          MinutoInicio: ts.time,
          MinutoFin: ts.time + 0.1, // Valor temporal hasta que cambies el modelo
          Titulo: ts.title
        })) : []
      };
      
      console.log('Enviando datos al servidor:', requestData);
      
      const response = await axios.post('/video/registrar', requestData);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear el video:', error);
      throw error;
    }
  }
  
  /**
   * Sube un video completo (archivo, miniatura y metadata)
   */
  async uploadCompleteVideo(
    videoFile: File, 
    videoDetails: VideoDetails, 
    thumbnailFile: File | null, 
    timestamps: Timestamp[], 
    progressCallback: (progress: number) => void = () => {},
    idCurso?: number,
    idAsignatura?: number
  ): Promise<any> {
    try {
      // Iniciar el progreso
      progressCallback(0);
      
      // 1. Subir el archivo de video a S3
      progressCallback(5);
      const videoUrl = await this.uploadFileToS3(
        videoFile, 
        'video',
        (progress) => {
          // El video es el archivo más grande, asignar 70% del progreso
          progressCallback(5 + Math.floor(progress * 0.7));
        }
      );
      
      // 2. Subir la miniatura a S3 (si existe)
      let thumbnailUrl = null;
      if (thumbnailFile) {
        progressCallback(75);
        thumbnailUrl = await this.uploadFileToS3(
          thumbnailFile,
          'miniatura',
          (progress) => {
            // La miniatura es más pequeña, asignar 15% del progreso
            progressCallback(75 + Math.floor(progress * 0.15));
          }
        );
      }
      
      // 3. Crear el registro del video en la base de datos
      progressCallback(90);
      const videoData: VideoData = {
        title: videoDetails.title,
        description: videoDetails.description,
        videoUrl,
        thumbnailUrl,
        idCurso, // Pasar el ID del curso si está disponible
        idAsignatura, // Pasar el ID de la asignatura si está disponible
        timestamps: timestamps.map(ts => ({
          ...ts,
          time: parseFloat(ts.time.toString())
        }))
      };
      
      const createdVideo = await this.createVideo(videoData);
      
      // Finalizar el progreso
      progressCallback(100);
      
      return createdVideo;
    } catch (error: any) {
      console.error('Error al subir el video completo:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene la lista de videos
   */
  async getVideos(params: Record<string, any> = {}): Promise<any[]> {
    try {
      const response = await axios.get('/video', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener los videos:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un video por su ID
   */
  async getVideoById(videoId: string | number): Promise<any> {
    try {
      const response = await axios.get(`/video/${videoId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener el video ${videoId}:`, error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export default new VideoService();