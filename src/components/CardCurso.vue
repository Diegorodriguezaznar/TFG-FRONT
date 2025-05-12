<script setup lang="ts">
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
const animacionCorazon = ref(false);

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
    // Añadir animación
    animacionCorazon.value = true;
    
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

    // Quitar animación después de un tiempo
    setTimeout(() => {
      animacionCorazon.value = false;
    }, 500);
    
  } catch (error) {
    console.error("Error en operación:", error);
    mostrarMensaje('Error en la operación', 'error');
    animacionCorazon.value = false;
  }
};
</script>

<template>
  <div>
    <v-hover v-slot="{ isHovering }">
      <v-card 
        class="curso-card" 
        @click="seleccionarCurso"
        :elevation="isHovering ? 8 : 2"
      >
        <!-- Contenedor de imagen con overlay de gradiente -->
        <div class="curso-card-imagen-container">
          <v-img 
            :src="imagen || 'https://picsum.photos/300/200'" 
            height="220px" 
            cover
            class="curso-card-imagen"
            :class="{ 'imagen-hover': isHovering }"
          >
            <!-- Overlay con gradiente -->
            <div class="curso-card-overlay">
              <!-- Botón de favorito -->
              <v-btn 
                :class="['curso-card-favorito', { 'favorito-activo': estaInscrito, 'animar': animacionCorazon }]"
                icon
                size="small"
                @click.stop="toggleInscripcion($event)"
              >
                <v-icon>
                  {{ estaInscrito ? 'mdi-heart' : 'mdi-heart-outline' }}
                </v-icon>
              </v-btn>
            </div>
          </v-img>
        </div>
        
        <v-card-title class="curso-card-titulo">
          {{ titulo }}
        </v-card-title>
        
        <v-card-text v-if="descripcion" class="curso-card-descripcion">
          {{ descripcion }}
        </v-card-text>
        
        <v-card-actions class="curso-card-acciones">
          <v-spacer></v-spacer>
          
          <v-btn 
            variant="flat" 
            color="primary" 
            @click.stop="seleccionarCurso"
            class="curso-card-boton"
            :class="{ 'btn-hover': isHovering }"
          >
            <v-icon left class="mr-1">mdi-play-circle-outline</v-icon>
            Ver videos
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-hover>
    
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
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  overflow: hidden;
}

.curso-card:hover {
  transform: translateY(-8px);
}

.curso-card-imagen-container {
  position: relative;
  overflow: hidden;
}

.curso-card-imagen {
  transition: transform 0.5s ease;
}

.imagen-hover {
  transform: scale(1.05);
}

.curso-card-overlay {
  position: absolute;
  top: 0;
  right: 0;
  padding: 12px;
  display: flex;
  justify-content: flex-end;
  z-index: 1;
}

.curso-card-titulo {
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  line-height: 1.3 !important;
  padding-bottom: 0;
  margin-bottom: 0;
  color: rgba(0, 0, 0, 0.87);
}

.curso-card-descripcion {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  color: rgba(0, 0, 0, 0.6);
  flex-grow: 1;
  font-size: 0.875rem;
}

.curso-card-acciones {
  padding: 8px 16px 16px 16px;
}

.curso-card-favorito {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.curso-card-favorito:hover {
  transform: scale(1.15);
}

.favorito-activo {
  color: #f44336 !important;
}

.animar {
  animation: pulse 0.4s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
  100% {
    transform: scale(1);
  }
}

.curso-card-boton {
  transition: all 0.3s ease;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0 16px;
}

.btn-hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>