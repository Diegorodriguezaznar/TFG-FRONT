import { defineStore } from "pinia";
import { ref } from "vue";
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

// Tipos
interface PeticionProfesorData {
  documentacionUrl: string;
  texto: string;
}

interface PeticionProfesorResponse {
  id: number;
  idUsuario: number;
  documentacionUrl: string;
  texto: string;
  estado: string;
  fechaCreacion: string;
}

export const usePeticionProfesorStore = defineStore("peticionProfesor", () => {
  // Estado
  const peticiones = ref<PeticionProfesorResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const errorMessage = ref<string>('');

  // Método para crear una petición
  const createPeticion = async (data: PeticionProfesorData): Promise<boolean> => {
    const usuarioLogeadoStore = useUsuarioLogeadoStore();
    
    // Verificar autenticación
    if (!usuarioLogeadoStore.estaAutenticado || !usuarioLogeadoStore.usuarioActual) {
      error.value = 'Usuario no autenticado';
      throw new Error('Usuario no autenticado');
    }

    // Verificar que el usuario tenga un ID válido
    if (!usuarioLogeadoStore.usuarioActual.idUsuario) {
      error.value = 'Usuario sin ID válido';
      throw new Error('Usuario sin ID válido');
    }

    loading.value = true;
    error.value = null;

    try {
      const requestData = {
        idUsuario: usuarioLogeadoStore.usuarioActual.idUsuario,
        documentacionUrl: data.documentacionUrl,
        texto: data.texto,
        estado: 'Pendiente'
      };

      console.log('Enviando petición:', requestData);

      const response = await fetch("http://localhost:5190/api/PeticionProfesor", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usuarioLogeadoStore.token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Error ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Petición creada exitosamente:', result);

      // Agregar la nueva petición al estado local
      peticiones.value.push(result);
      
      return true;
    } catch (err) {
      console.error('Error al crear petición:', err);
      
      if (err instanceof Error) {
        error.value = err.message;
      } else {
        error.value = 'Error desconocido al crear la petición';
      }
      
      throw err;
    } finally {
      loading.value = false;
    }
  };

  
  // Método para obtener TODAS las peticiones (para administradores)
  const fetchPeticiones = async (): Promise<any[]> => {
    const usuarioLogeadoStore = useUsuarioLogeadoStore();
    
    if (!usuarioLogeadoStore.estaAutenticado) {
      errorMessage.value = 'Usuario no autenticado';
      throw new Error('Usuario no autenticado');
    }

    loading.value = true;
    errorMessage.value = '';
    error.value = null;

    try {
      const response = await fetch("http://localhost:5190/api/PeticionProfesor", {
        headers: {
          'Authorization': `Bearer ${usuarioLogeadoStore.token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Transformar los datos al formato esperado por la UI
      const peticionesUI = result.map((peticion: any) => ({
        id: peticion.id,
        user: peticion.nombreUsuario || `Usuario ${peticion.idUsuario}`,
        avatar: peticion.avatarUrl || '/avatars/default.png',
        documentoUrl: peticion.documentacionUrl,
        razon: peticion.texto,
        fecha: new Date(peticion.fechaCreacion).toLocaleDateString('es-ES'),
        estado: peticion.estado,
        idUsuario: peticion.idUsuario
      }));
      
      return peticionesUI;
    } catch (err) {
      console.error('Error al obtener todas las peticiones:', err);
      
      if (err instanceof Error) {
        errorMessage.value = err.message;
        error.value = err.message;
      } else {
        errorMessage.value = 'Error desconocido al obtener las peticiones';
        error.value = 'Error desconocido al obtener las peticiones';
      }
      
      throw err;
    } finally {
      loading.value = false;
    }
  };



  async function rechazarPeticion(idPeticion: number): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:5190/api/PeticionProfesor/rechazar/${idPeticion}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al rechazar petición: ${errorText}`);
      }

      // Elimina del array local
      peticiones.value = peticiones.value.filter(p => p.id !== idPeticion);
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al rechazar la petición";
      console.error("Error al rechazar petición:", error);
      return false;
    }
  }



  // Método para limpiar el estado
  const clearState = () => {
    peticiones.value = [];
    error.value = null;
    errorMessage.value = '';
    loading.value = false;
  };

  return {
    // Estado
    peticiones,
    loading,
    error,
    errorMessage,
    
    // Métodos
    createPeticion,
    fetchPeticiones,
    rechazarPeticion,
    clearState
  };
});