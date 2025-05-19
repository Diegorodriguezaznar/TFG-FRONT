<script setup lang="ts">
// Imports
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import { useUsuarioCursoStore } from "@/stores/UsuarioCurso";

// Stores
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const usuarioCursoStore = useUsuarioCursoStore();

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
  id: {
    type: Number,
    required: true
  },
  titulo: String,
  subtitulo: String,
  descripcion: String,
  imagen: String
});

// Emits
const emit = defineEmits(['guardado', 'eliminado']);

// Evento para ir a la página de videos del curso
const seleccionarCurso = () => {
  if (props.id) {
    router.push(`/curso/${props.id}`);
  }
};

// ID del usuario actual
const usuarioId = computed(() => {
  const usuario = usuarioLogeadoStore.usuarioActual;
  return usuario?.id || usuario?.idUsuario || null;
});

// Estado de inscripción
const estaInscrito = ref(false);
const animacionGuardar = ref(false);

// Verificar si el usuario está inscrito en este curso al cargar el componente
onMounted(async () => {
  if (usuarioId.value && props.id) {
    await verificarInscripcion();
  }
});

// Verificar si el usuario está inscrito en este curso
async function verificarInscripcion() {
  try {
    if (usuarioId.value) {
      const inscripciones = await usuarioCursoStore.fetchInscripcionesByUsuarioId(usuarioId.value);
      estaInscrito.value = inscripciones.some(i => i.idCurso === props.id);
    }
  } catch (error) {
    console.error("Error al verificar inscripción:", error);
  }
}

// Método para guardar un curso
const guardarCurso = async (event) => {
  // Prevenir la navegación
  event.stopPropagation();
  
  // Verificar login
  if (!usuarioId.value) {
    mostrarMensaje('Debes iniciar sesión para guardar curso', 'error');
    router.push('/login');
    return;
  }

  try {
    // Añadir animación
    animacionGuardar.value = true;
    
    // CREAR inscripción usando el store
    const nuevaInscripcion = {
      IdUsuario: usuarioId.value,
      IdCurso: props.id
    };
    
    const resultado = await usuarioCursoStore.createInscripcion(nuevaInscripcion);
    
    if (resultado) {
      estaInscrito.value = true;
      mostrarMensaje('Curso guardado correctamente', 'success');
      emit('guardado', props.id);
    } else {
      console.error("Error al crear inscripción:", usuarioCursoStore.errorMessage);
      mostrarMensaje('Error al guardar curso', 'error');
    }

    // Quitar animación después de un tiempo
    setTimeout(() => {
      animacionGuardar.value = false;
    }, 500);
    
  } catch (error) {
    console.error("Error al guardar curso:", error);
    mostrarMensaje('Error en la operación', 'error');
    animacionGuardar.value = false;
  }
};

// Método para borrar un curso guardado
const borrarGuardado = async (event) => {
  // Prevenir la navegación
  event.stopPropagation();
  
  // Verificar que esté inscrito
  if (!estaInscrito.value) {
    console.warn("No se puede borrar un curso que no está guardado");
    return;
  }
  
  try {
    // Añadir animación
    animacionGuardar.value = true;
    
    // Verificar que tenemos los datos necesarios
    if (!usuarioId.value || !props.id) {
      console.error("Error: Faltan datos para eliminar inscripción", { 
        usuarioId: usuarioId.value, 
        cursoId: props.id 
      });
      mostrarMensaje('Error al quitar curso guardado: Datos incompletos', 'error');
      animacionGuardar.value = false;
      return;
    }
    
    console.log("Intentando eliminar inscripción con método POST");
    
    // Intentar eliminar con método POST y un campo especial para indicar eliminación
    const response = await fetch("http://localhost:5190/api/UsuarioCurso/Eliminar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdUsuario: usuarioId.value,
        IdCurso: props.id
      })
    });
    
    if (response.ok) {
      estaInscrito.value = false;
      mostrarMensaje('Curso quitado de guardados', 'success');
      emit('eliminado', props.id);
    } else {
      // Si falla, intentar con otro endpoint
      console.log("Primer intento falló, probando con otro endpoint");
      
      // Intentar con otro endpoint específico para eliminar
      const response2 = await fetch(`http://localhost:5190/api/UsuarioCurso/Eliminar/${usuarioId.value}/${props.id}`, {
        method: "GET" // Probar con GET ya que muchos backends permiten eliminar con GET en endpoints específicos
      });
      
      if (response2.ok) {
        estaInscrito.value = false;
        mostrarMensaje('Curso quitado de guardados', 'success');
        emit('eliminado', props.id);
      } else {
        // Si falla, intentar con método PUT
        console.log("Segundo intento falló, probando con método PUT");
        
        const response3 = await fetch("http://localhost:5190/api/UsuarioCurso", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            IdUsuario: usuarioId.value,
            IdCurso: props.id,
            _method: "DELETE" // Algunos backends usan este patrón para emular DELETE
          })
        });
        
        if (response3.ok) {
          estaInscrito.value = false;
          mostrarMensaje('Curso quitado de guardados', 'success');
          emit('eliminado', props.id);
        } else {
          const errorText = await response3.text();
          console.error("Todos los intentos de eliminar fallaron. Último error:", errorText);
          mostrarMensaje('Error al quitar curso guardado. Consulta la consola para más detalles.', 'error');
        }
      }
    }

    // Quitar animación después de un tiempo
    setTimeout(() => {
      animacionGuardar.value = false;
    }, 500);
    
  } catch (error) {
    console.error("Error al borrar guardado:", error);
    mostrarMensaje(`Error en la operación: ${error.message}`, 'error');
    animacionGuardar.value = false;
  }
};

// Método que decide si guardar o borrar en función del estado
const toggleInscripcion = async (event) => {
  // Prevenir la navegación
  event.stopPropagation();
  
  // Verificar login
  if (!usuarioId.value) {
    mostrarMensaje('Debes iniciar sesión para guardar curso', 'error');
    router.push('/login');
    return;
  }
  
  if (estaInscrito.value) {
    await borrarGuardado(event);
  } else {
    await guardarCurso(event);
  }
};
</script>

<template>
  <div class="curso-card-wrapper">
    <v-hover v-slot="{ isHovering }">
      <v-card 
        class="curso-card" 
        @click="seleccionarCurso"
        :elevation="isHovering ? 8 : 2"
      >
        <!-- Contenedor de imagen -->
        <div class="curso-card-imagen-container">
          <v-img 
            :src="imagen || 'https://picsum.photos/300/200'" 
            height="220px" 
            cover
            class="curso-card-imagen"
            :class="{ 'imagen-hover': isHovering }"
          ></v-img>
        </div>
        
        <!-- Título del curso -->
        <v-card-title class="curso-card-titulo">
          {{ titulo }}
        </v-card-title>
        
        <!-- Descripción del curso -->
        <v-card-text v-if="descripcion" class="curso-card-descripcion">
          {{ descripcion }}
        </v-card-text>
        
        <!-- Botones de acción -->
        <v-card-actions class="curso-card-acciones">
          <!-- Botón Guardar (solo se muestra si no está guardado) -->
          <v-btn 
            v-if="!estaInscrito"
            variant="flat" 
            color="orange" 
            @click.stop="guardarCurso($event)"
            class="curso-card-boton-guardar"
            :class="{ 'btn-hover': isHovering, 'animar': animacionGuardar }"
          >
            <v-icon left class="mr-1">mdi-bookmark-outline</v-icon>
            Guardar
          </v-btn>
          
          <!-- Botón Borrar (solo se muestra si está guardado) -->
          <v-btn 
            v-if="estaInscrito"
            variant="flat" 
            color="orange" 
            @click.stop="borrarGuardado($event)"
            class="curso-card-boton-guardar guardado-activo"
            :class="{ 'btn-hover': isHovering, 'animar': animacionGuardar }"
          >
            <v-icon left class="mr-1">mdi-bookmark-check</v-icon>
            Quitar
          </v-btn>
          
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
    
    <!-- Snackbar para alertas -->
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
.curso-card-wrapper {
  width: 100%;
  height: 100%;
}

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

.curso-card-boton, .curso-card-boton-guardar {
  transition: all 0.3s ease;
  border-radius: 20px;
  font-weight: 500;
  letter-spacing: 0.5px;
  padding: 0 16px;
}

.curso-card-boton-guardar {
  background-color: #FF9800 !important;
  color: white !important;
}

.guardado-activo {
  background-color: #FB8C00 !important;
}

.animar {
  animation: pulse 0.4s ease-in-out;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.btn-hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>