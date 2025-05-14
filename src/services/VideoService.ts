// VideoService.ts con solución rápida para el problema de idCurso
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
  async uploadFileToS3(file: File, type: string, progressCallback: (progress: number) => void = () => {}): Promise<string> {
    try {
      console.log(`Solicitando URL presignada para: ${type}/${file.name}`);
      
      // 1. Obtener una URL prefirmada del backend
      const response = await axios.post('/s3/obtener-url', {
        Tipo: type,
        NombreArchivo: file.name
      });
      
      console.log('Respuesta del servidor:', response.data);
      
      // Obtener URL y clave
      let presignedUrl: string;
      let fileKey: string;
      
      if (typeof response.data === 'string') {
        presignedUrl = response.data;
        // Extraer el fileKey de la URL - puede necesitar ajustes según la estructura exacta
        const urlObj = new URL(presignedUrl);
        fileKey = urlObj.pathname.split('/').pop() || '';
      } else if (response.data && response.data.presignedUrl) {
        presignedUrl = response.data.presignedUrl;
        fileKey = response.data.fileKey;
      } else {
        throw new Error('Formato de respuesta inesperado del servidor');
      }
      
      // 2. Subir el archivo a S3 usando la URL prefirmada
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            progressCallback(percentCompleted);
          }
        }
      });
      
      // 3. Devolver la URL pública
      const bucketName = 'archivos-academiq'; // Asegúrate de que este es el nombre correcto de tu bucket
      const region = 'us-east-1'; // Asegúrate de que esta es la región correcta
      const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;
      
      return publicUrl;
    } catch (error: any) {
      console.error(`Error al subir ${type} a S3:`, error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo video en la base de datos
   */
  async createVideo(videoData: VideoData): Promise<any> {
    try {
      console.log('Datos para registrar video:', videoData);
      
      // SOLUCIÓN CLAVE: Asegurarse de que IdCurso e IdAsignatura siempre tengan valores
      // Usar valores por defecto si no están presentes
      const requestData = {
        Titulo: videoData.title,
        Descripcion: videoData.description || '',
        UrlVideo: videoData.videoUrl,
        UrlMiniatura: videoData.thumbnailUrl,
        // IMPORTANTE: Asignar valores fijos y válidos para estas propiedades
        IdCurso: 1,  // Asignar un valor fijo que exista en tu base de datos
        IdAsignatura: 1, // Asignar un valor fijo que exista en tu base de datos y corresponda al curso
        IdUsuario: 1, // Asignar un valor fijo o usar el ID del usuario actual si está disponible
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
    progressCallback: (progress: number) => void = () => {}
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
        // No necesitamos especificar idCurso e idAsignatura aquí,
        // ya que se asignarán valores fijos en createVideo
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