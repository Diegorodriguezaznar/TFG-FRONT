import { defineStore } from "pinia";
import { ref } from "vue";
import type { ArchivoDTO } from "@/stores/dtos/ArchivoDTO";

export const useArchivoStore = defineStore("archivo", () => {
  // --------------------------- Estado ---------------------------
  const archivos = ref<ArchivoDTO[]>([]);
  const errorMessage = ref<string>("");
  const isUploading = ref<boolean>(false);
  const uploadProgress = ref<number>(0);

  // --------------------------- Métodos de Fetch ---------------------------
  // Obtener todos los archivos
  async function fetchAllArchivos() {
    try {
      const response = await fetch("http://localhost:5687/api/Archivo");
      if (!response.ok) throw new Error("Error al obtener todos los archivos");

      archivos.value = await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener todos los archivos:", error);
    }
  }

  // Obtener archivo por ID
  async function fetchArchivoById(idArchivo: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Archivo/${idArchivo}`);
      if (!response.ok) throw new Error("Error al obtener el archivo");

      return await response.json();
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener el archivo:", error);
      return null;
    }
  }

  // Obtener archivos por Tipo y Temario
  async function fetchArchivosByTipoAndTemario(tipo: string, idTemario: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Archivo/tipo/${tipo}/temario/${idTemario}`);
      if (!response.ok) throw new Error("Error al obtener los archivos del tipo y temario seleccionados");

      const data = await response.json();
      archivos.value = data.map((archivo: ArchivoDTO) => ({
        ...archivo,
        url: archivo.url || null,
      }));
      console.log("Archivos filtrados por tipo y temario cargados correctamente:", archivos.value);
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener los archivos filtrados:", error);
    }
  }

  // Obtener archivos por ID de temario
  async function fetchArchivosByTemario(idTemario: number) {
    try {
      const response = await fetch(`http://localhost:5687/api/Archivo/temario/${idTemario}`);
      if (!response.ok) throw new Error("Error al obtener los archivos del temario");

      const data = await response.json();
      archivos.value = data.map((archivo: ArchivoDTO) => ({
        ...archivo,
        url: archivo.url || null,
      }));
      console.log("Archivos cargados correctamente:", archivos.value);
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al obtener los archivos del temario:", error);
    }
  }

  // Obtener archivos por ID de usuario
  async function fetchArchivosByUsuario(idUsuario: number) {
    try {
      archivos.value = [];
      const response = await fetch(`http://localhost:5687/api/Archivo/usuario/${idUsuario}`);
      if (!response.ok) throw new Error("Error al obtener los archivos del usuario");

      const data = await response.json();
      if (data.length > 0) {
        archivos.value = data.map((archivo: ArchivoDTO) => ({
          ...archivo,
          url: archivo.url || null,
        }));
        localStorage.setItem("archivosUsuario", JSON.stringify(archivos.value));
        console.log("Archivos del usuario cargados correctamente:", archivos.value);
      } else {
        console.log("No hay archivos para este usuario");
        localStorage.removeItem("archivosUsuario");
      }
    } catch (error: any) {
      archivos.value = [];
      localStorage.removeItem("archivosUsuario");
      errorMessage.value = error.message;
      console.error("Error al obtener los archivos del usuario:", error);
    }
  }

  // --------------------------- Subida de archivos ---------------------------
  async function uploadArchivoFile(
    file: File | null,
    titulo: string,
    tipo: string,
    temarioId: number | null,
    userId: number | null
  ) {
    if (!file || !titulo || !tipo || !temarioId || !userId) {
      console.error("Faltan datos para la subida del archivo", { file, titulo, tipo, temarioId, userId });
      return null;
    }

    console.log(`Subiendo archivo: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    isUploading.value = true;
    uploadProgress.value = 0;
    errorMessage.value = "";

    try {
      const formData = new FormData();
      formData.append("archivo", file);
      formData.append("titulo", titulo);
      formData.append("tipo", tipo);
      formData.append("idUsuario", userId.toString());
      formData.append("idTemario", temarioId.toString());

      return await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "http://localhost:5687/api/Archivo/upload", true);
        xhr.timeout = 300000;
        xhr.withCredentials = false;

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            uploadProgress.value = percent;
          }
        };

        xhr.onload = async () => {
          isUploading.value = false;
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            console.log("Archivo subido correctamente:", data);
            await fetchArchivosByTemario(temarioId);
            resolve(data);
          } else {
            errorMessage.value = xhr.responseText;
            reject(new Error(xhr.responseText));
          }
        };

        xhr.onerror = () => {
          isUploading.value = false;
          errorMessage.value = "Error de red. Revisa tu conexión.";
          reject(new Error("Error de red"));
        };

        xhr.ontimeout = () => {
          isUploading.value = false;
          errorMessage.value = "La subida tardó demasiado. Intenta de nuevo.";
          reject(new Error("Timeout"));
        };

        xhr.send(formData);
      });
    } catch (error: any) {
      isUploading.value = false;
      errorMessage.value = error.message || "Error al subir el archivo.";
      console.error("Error al subir:", error);
      return null;
    }
  }

  // --------------------------- Crear archivo ---------------------------
  async function createArchivo(archivo: Partial<ArchivoDTO>, userId: number) {
    try {
      const response = await fetch("http://localhost:5687/api/Archivo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...archivo, usuarioId: userId })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el archivo");
      }

      const createdArchivo = await response.json();
      archivos.value.push(createdArchivo);

      return createdArchivo;
    } catch (error: any) {
      errorMessage.value = error.message;
      console.error("Error al crear el archivo:", error);
      return null;
    }
  }

  return { 
    archivos, 
    isUploading,
    uploadProgress,
    fetchAllArchivos, 
    fetchArchivoById, 
    fetchArchivosByTipoAndTemario,
    fetchArchivosByTemario, 
    fetchArchivosByUsuario,
    uploadArchivoFile, 
    createArchivo,
    errorMessage
  };
});
