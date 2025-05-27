import { defineStore } from "pinia";
import { ref } from "vue";
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

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
  const peticiones = ref<PeticionProfesorResponse[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const errorMessage = ref<string>('');

  // POST - Crear petición de profesor
  const createPeticion = async (data: PeticionProfesorData): Promise<boolean> => {
    const usuarioLogeadoStore = useUsuarioLogeadoStore();
    
    if (!usuarioLogeadoStore.estaAutenticado || !usuarioLogeadoStore.usuarioActual) {
      error.value = 'Usuario no autenticado';
      throw new Error('Usuario no autenticado');
    }

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
      peticiones.value.push(result);
      
      return true;
    } catch (err) {
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


  // GET - Obtener todas las peticiones (para administradores)
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

  // DELETE - Rechazar petición
  async function rechazarPeticion(idPeticion: number): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:5190/api/PeticionProfesor/rechazar/${idPeticion}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al rechazar petición: ${errorText}`);
      }

      peticiones.value = peticiones.value.filter(p => p.id !== idPeticion);
      return true;
    } catch (error: any) {
      errorMessage.value = error.message || "Error al rechazar la petición";
      return false;
    }
  }

  // Limpiar estado
  const clearState = () => {
    peticiones.value = [];
    error.value = null;
    errorMessage.value = '';
    loading.value = false;
  };

  return {
    peticiones,
    loading,
    error,
    errorMessage,
    createPeticion,
    fetchPeticiones,
    rechazarPeticion,
    clearState
  };
});