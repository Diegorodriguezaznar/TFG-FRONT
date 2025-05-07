<script setup>
//Imports
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

// Stores
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// Router
const router = useRouter();

// Estado para las alertas
const mostrarAlerta = ref(false);
const mensajeAlerta = ref('');
const tipoAlerta = ref('success');

// Función para mostrar alertas
const mostrarMensaje = (mensaje, tipo = 'success') => {
  mensajeAlerta.value = mensaje;
  tipoAlerta.value = tipo;
  mostrarAlerta.value = true;
  
  setTimeout(() => {
    mostrarAlerta.value = false;
  }, 3000);
};

// Propiedades del curso
const props = defineProps({
  id: Number, 
  titulo: String,
  descripcion: String,
  imagen: String
});

// Evento para ir a la página de videos del curso
const seleccionarCurso = () => {
  if (props.id) {
    // Redirigimos a la página Home con el ID del curso
    router.push(`/curso/${props.id}`);
  }
};

const show = ref(false);

// ID del usuario actual
const usuarioId = computed(() => {
  const usuario = usuarioLogeadoStore.usuarioActual;
  return usuario?.id || usuario?.idUsuario || null;
});

// Estado de inscripción
const estaInscrito = ref(false);

// Verificar si el usuario está inscrito en este curso al cargar el componente
onMounted(async () => {
  if (usuarioId.value && props.id) {
    await verificarInscripcion();
  }
});

// Verificar si el usuario está inscrito en este curso
async function verificarInscripcion() {
  try {
    const response = await fetch(`http://localhost:5190/api/UsuarioCurso/usuario/${usuarioId.value}`);
    
    if (response.ok) {
      const inscripciones = await response.json();
      estaInscrito.value = inscripciones.some(i => i.idCurso === props.id);
    }
  } catch (error) {
    console.error("Error al verificar inscripción:", error);
  }
}

// Método para inscribirse o desinscribirse del curso
const toggleInscripcion = async (event) => {
  // Prevenir la navegación
  event.stopPropagation();
  
  // Verificar login
  if (!usuarioId.value) {
    mostrarMensaje('Debes iniciar sesión para marcar como favorito', 'error');
    router.push('/login');
    return;
  }
  
  try {
    if (estaInscrito.value) {
      // ELIMINAR inscripción (usando query parameters)
      const url = `http://localhost:5190/api/UsuarioCurso?idUsuario=${usuarioId.value}&idCurso=${props.id}`;
      console.log("Eliminando inscripción:", url);
      
      const response = await fetch(url, {
        method: "DELETE"
      });
      
      if (response.ok) {
        estaInscrito.value = false;
        // No mostramos mensaje de desincripción
      } else {
        const errorText = await response.text();
        console.error("Error al eliminar inscripción:", errorText);
        mostrarMensaje('Error al quitar favorito', 'error');
      }
    } else {
      // CREAR inscripción - SIMPLIFICADO AL MÁXIMO
      const datos = {
        IdUsuario: usuarioId.value,
        IdCurso: props.id
      };
      
      console.log("Creando inscripción con datos:", datos);
      
      const response = await fetch("http://localhost:5190/api/UsuarioCurso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
      });
      
      if (response.ok) {
        estaInscrito.value = true;
        // No mostramos mensaje de inscripción
      } else {
        const errorText = await response.text();
        console.error("Error al crear inscripción:", errorText);
        mostrarMensaje('Error al marcar como favorito', 'error');
      }
    }
  } catch (error) {
    console.error("Error en operación:", error);
    mostrarMensaje('Error en la operación', 'error');
  }
};
</script>

<template>
  <div>
    <v-card class="curso-card" @click="seleccionarCurso">
      <!-- Usamos una imagen por defecto si no hay imagen proporcionada -->
      <v-img 
        :src="imagen || 'https://picsum.photos/300/200'" 
        height="200px" 
        cover
        class="curso-card-imagen"
      ></v-img>
      
      <v-card-title class="text-subtitle-1 font-weight-bold">
        {{ titulo }}
      </v-card-title>
      
      <v-card-text v-if="descripcion" class="curso-card-descripcion text-caption">
        {{ descripcion }}
      </v-card-text>
      
      <v-card-actions>
        <v-btn 
          variant="flat" 
          :color="estaInscrito ? 'orange' : 'white'" 
          class="curso-card-boton" 
          @click.stop="toggleInscripcion($event)"
        >
          <v-icon :color="estaInscrito ? 'white' : 'orange'">
            {{ estaInscrito ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
        </v-btn>
        
        <v-spacer></v-spacer>
        
        <v-btn 
          variant="text" 
          color="primary" 
          size="small"
          @click.stop="seleccionarCurso"
        >
          Ver videos
        </v-btn>
      </v-card-actions>
    </v-card>
    
    <!-- Alerta de acción completada (solo para errores) -->
    <v-snackbar
      v-model="mostrarAlerta"
      :color="tipoAlerta"
      :timeout="3000"
      bottom
      right
    >
      {{ mensajeAlerta }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="mostrarAlerta = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.curso-card {
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.curso-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1) !important;
}

.curso-card-imagen {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.curso-card-descripcion {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex-grow: 1;
}

.curso-card-boton {
  min-width: 36px !important;
  border-radius: 50% !important;
}
</style>