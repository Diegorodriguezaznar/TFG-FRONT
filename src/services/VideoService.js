// 
// VideoService.js - Servicio para manejar la comunicación con el backend y S3
//

import axios from 'axios';

class VideoService {
  /**
   * Sube un archivo a Amazon S3
   * @param {File} file - El archivo a subir
   * @param {string} type - El tipo de archivo ('video' o 'thumbnail')
   * @param {Function} progressCallback - Función callback para actualizar el progreso
   * @returns {Promise<string>} - URL del archivo subido
   */
  async uploadFileToS3(file, type, progressCallback = () => {}) {
    try {
      // 1. Primero obtener una URL prefirmada del backend
      const response = await axios.post('/api/s3/get-presigned-url', {
        fileName: file.name,
        contentType: file.type,
        fileType: type // 'video' o 'thumbnail'
      });
      
      const { presignedUrl, fileKey } = response.data;
      
      // 2. Subir el archivo a S3 usando la URL prefirmada
      await axios.put(presignedUrl, file, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressCallback(percentCompleted);
        }
      });
      
      // 3. Devolver la URL pública del archivo
      return `https://${process.env.VUE_APP_S3_BUCKET}.s3.amazonaws.com/${fileKey}`;
    } catch (error) {
      console.error(`Error al subir ${type} a S3:`, error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo video en la base de datos
   * @param {Object} videoData - Datos del video
   * @returns {Promise<Object>} - Datos del video creado
   */
  async createVideo(videoData) {
    try {
      const response = await axios.post('/api/videos', videoData);
      return response.data;
    } catch (error) {
      console.error('Error al crear el video:', error);
      throw error;
    }
  }
  
  /**
   * Sube un video completo (archivo, miniatura y metadata)
   * @param {File} videoFile - Archivo de video
   * @param {Object} videoDetails - Detalles del video (título, descripción, etc.)
   * @param {File} thumbnailFile - Archivo de miniatura
   * @param {Array} timestamps - Array de marcadores de tiempo
   * @param {Function} progressCallback - Función callback para actualizar el progreso
   * @returns {Promise<Object>} - Datos del video creado
   */
  async uploadCompleteVideo(videoFile, videoDetails, thumbnailFile, timestamps, progressCallback = () => {}) {
    try {
      // Iniciar el progreso
      progressCallback(0);
      
      // 1. Subir el archivo de video a S3
      progressCallback(5); // Indicar que estamos empezando
      const videoUrl = await this.uploadFileToS3(
        videoFile, 
        'video',
        (progress) => {
          // El video es el archivo más grande, por lo que le asignamos el 70% del progreso total
          progressCallback(5 + Math.floor(progress * 0.7));
        }
      );
      
      // 2. Subir la miniatura a S3 (si existe)
      let thumbnailUrl = null;
      if (thumbnailFile) {
        progressCallback(75); // El video está subido, ahora vamos con la miniatura
        thumbnailUrl = await this.uploadFileToS3(
          thumbnailFile,
          'thumbnail',
          (progress) => {
            // La miniatura es más pequeña, le asignamos el 15% del progreso total
            progressCallback(75 + Math.floor(progress * 0.15));
          }
        );
      }
      
      // 3. Crear el registro del video en la base de datos
      progressCallback(90);
      const videoData = {
        title: videoDetails.title,
        description: videoDetails.description,
        videoUrl,
        thumbnailUrl,
        timestamps
      };
      
      const createdVideo = await this.createVideo(videoData);
      
      // Finalizar el progreso
      progressCallback(100);
      
      return createdVideo;
    } catch (error) {
      console.error('Error al subir el video completo:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene la lista de videos
   * @param {Object} params - Parámetros de paginación y filtrado
   * @returns {Promise<Array>} - Lista de videos
   */
  async getVideos(params = {}) {
    try {
      const response = await axios.get('/api/videos', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener los videos:', error);
      throw error;
    }
  }
  
  /**
   * Obtiene un video por su ID
   * @param {string} videoId - ID del video
   * @returns {Promise<Object>} - Datos del video
   */
  async getVideoById(videoId) {
    try {
      const response = await axios.get(`/api/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el video ${videoId}:`, error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export default new VideoService();