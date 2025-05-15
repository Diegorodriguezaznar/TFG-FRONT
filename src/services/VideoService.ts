
// VideoService.ts actualizado para utilizar el endpoint de video directamente
import axios from 'axios';

// Tipos de datos
interface VideoDetails {
  title: string;
  description: string;
  thumbnail: File | null;
  courseId?: number;
  subjectId?: number;
}

interface Timestamp {
  id: string;
  time: number;
  title: string;
}

interface VideoData {
  titulo: string;
  descripcion: string;
  archivo: File; // Archivo de video
  miniatura?: File | null; // Archivo de miniatura
  idCurso?: number;
  idAsignatura?: number;
  idUsuario?: number;
}

class VideoService {
  /**
   * Sube un video completo (archivo, miniatura y metadata)
   */
  async uploadCompleteVideo(
    videoFile: File, 
    videoDetails: VideoDetails, 
    thumbnailFile: File | null, 
    timestamps: Timestamp[] = [], 
    progressCallback: (progress: number) => void = () => {}
  ): Promise<any> {
    try {
      // Iniciar el progreso
      progressCallback(0);
      
      // Crear FormData para enviar los archivos y metadatos
      const formData = new FormData();
      
      // Añadir el archivo de video con el nombre correcto "Video"
      formData.append('Video', videoFile);
      
      // Añadir la miniatura si existe
      if (thumbnailFile) {
        formData.append('Miniatura', thumbnailFile);
      }
      
      // Añadir los metadatos (asegurándonos de que los campos requeridos tienen valores)
      formData.append('Titulo', videoDetails.title || 'Video sin título');
      formData.append('Descripcion', videoDetails.description || '');
      
      // Añadir curso y asignatura con valores predeterminados si no se proporcionan
      if (videoDetails.courseId || videoDetails.subjectId) {
        // Solo enviar estos campos si tienen valores válidos
        if (videoDetails.courseId) {
          formData.append('IdCurso', videoDetails.courseId.toString());
        }
        
        if (videoDetails.subjectId) {
          formData.append('IdAsignatura', videoDetails.subjectId.toString());
        }
      } else {
        // Si no hay valores específicos, usar 1 como valor predeterminado
        // solo si es absolutamente necesario por restricciones de la base de datos
        formData.append('IdCurso', '1');
        formData.append('IdAsignatura', '1');
      }
      
      // Obtener el ID del usuario actual del almacenamiento local si está disponible
      const currentUser = localStorage.getItem('user') 
        ? JSON.parse(localStorage.getItem('user') || '{}')
        : null;
      
      const userId = currentUser?.id || 1; // Usar 1 como valor predeterminado si no hay usuario
      formData.append('IdUsuario', userId.toString());
      
      // Imprimir en consola todos los datos que se están enviando para depuración
      console.log('Enviando datos de video:');
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: Archivo - ${value.name} (${value.size} bytes)`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      
      // Enviar la solicitud al backend
      const response = await axios.post('http://localhost:5190/api/Video/registrar', formData, {
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
      
      console.log('Respuesta del servidor tras subir el video:', response.data);
      
      // Devolver los datos del video creado
      return response.data;
      
    } catch (error: any) {
      console.error('Error al subir el video completo:', error);
      
      // Mejorar el registro de errores para depuración
      if (error.response) {
        console.error('Datos de respuesta de error:', error.response.data);
        console.error('Estado de respuesta de error:', error.response.status);
      }
      
      throw error;
    }
  }
  
  /**
   * Obtiene la lista de videos
   */
  async getVideos(): Promise<any[]> {
    try {
      const response = await axios.get('http://localhost:5190/api/Video');
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener los videos:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un video por su ID
   */
  async getVideoById(videoId: number): Promise<any> {
    try {
      const response = await axios.get(`http://localhost:5190/api/Video/${videoId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener el video ${videoId}:`, error);
      throw error;
    }
  }
  
  /**
   * Obtiene los videos de un curso específico
   */
  async getVideosByCourse(courseId: number): Promise<any[]> {
    try {
      const response = await axios.get(`http://localhost:5190/api/Video/curso/${courseId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener los videos del curso ${courseId}:`, error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export default new VideoService();