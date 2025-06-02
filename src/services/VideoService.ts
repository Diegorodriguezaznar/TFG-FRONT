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
   * Intenta obtener el ID del usuario desde localStorage
   * @returns ID del usuario o lanza un error si no se encuentra
   */
  private getUserId(): number {
    try {
      // Primero, imprimir todas las claves en localStorage para depuración
      console.log('Todas las claves en localStorage:', Object.keys(localStorage));
      
      // Intentar obtener la información del usuario de 'usuario', 'user' o similares
      let userData = null;
      let userKey = '';
      
      // Buscar la clave correcta que contiene los datos del usuario
      for (const key of Object.keys(localStorage)) {
        if (key.toLowerCase().includes('user') || key.toLowerCase().includes('usuario')) {
          try {
            console.log(`Contenido de localStorage['${key}']:`, localStorage.getItem(key));
            const data = JSON.parse(localStorage.getItem(key) || '');
            if (data && typeof data === 'object') {
              userData = data;
              userKey = key;
              break;
            }
          } catch (e) {
            console.warn(`Error al parsear localStorage['${key}']:`, e);
          }
        }
      }
      
      if (!userData) {
        throw new Error('No se encontró información de usuario en localStorage');
      }
      
      console.log(`Datos de usuario encontrados en localStorage['${userKey}']:`, userData);
      
      // Intentar encontrar el ID del usuario en diferentes formatos posibles
      let userId: number | null = null;
      
      // Comprobar diferentes formatos de ID
      if (typeof userData.id !== 'undefined') {
        userId = Number(userData.id);
      } else if (typeof userData.userId !== 'undefined') {
        userId = Number(userData.userId);
      } else if (typeof userData.idUsuario !== 'undefined') {
        userId = Number(userData.idUsuario);
      } else if (typeof userData.ID !== 'undefined') {
        userId = Number(userData.ID);
      }
      
      // Si encontramos el ID pero es NaN, intentar otras propiedades
      if (userId === null || isNaN(userId)) {
        // Buscar cualquier propiedad que parezca un ID
        for (const key in userData) {
          if (
            key.toLowerCase().includes('id') && 
            typeof userData[key] !== 'undefined' &&
            (typeof userData[key] === 'number' || /^\d+$/.test(String(userData[key])))
          ) {
            userId = Number(userData[key]);
            break;
          }
        }
      }
      
      if (userId === null || isNaN(userId)) {
        console.error('Datos de usuario encontrados pero no contienen un ID válido:', userData);
        throw new Error('ID de usuario no encontrado o no válido');
      }
      
      console.log('ID de usuario que se usará:', userId);
      return userId;
      
    } catch (error) {
      console.error('Error al obtener el ID de usuario:', error);
      throw new Error('No se pudo obtener el ID de usuario. Asegúrate de haber iniciado sesión correctamente.');
    }
  }

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
      // Obtener el ID del usuario primero, antes de cualquier otra operación
      // Esto lanzará un error si no hay usuario, lo que detendrá el proceso de subida
      const userId = this.getUserId();
      
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
      
      // Usar el ID de usuario que obtuvimos
      formData.append('IdUsuario', userId.toString());
      console.log('Usando ID de usuario del localStorage:', userId);
      
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
      const response = await axios.post('http://34.198.50.70:3000/api/Video/registrar', formData, {
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
      const response = await axios.get('http://34.198.50.70:3000/api/Video');
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
      const response = await axios.get(`http://34.198.50.70:3000/api/Video/${videoId}`);
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
      const response = await axios.get(`http://34.198.50.70:3000/api/Video/curso/${courseId}`);
      return response.data;
    } catch (error: any) {
      console.error(`Error al obtener los videos del curso ${courseId}:`, error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export default new VideoService();