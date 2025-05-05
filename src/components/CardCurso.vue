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

// Evento para ir a la página de asignaturas
const seleccionarCurso = () => {
  if (curso.id) {
    router.push(`/asignaturas/${curso.id}`);
  }
};

// Propiedades del curso
const curso = defineProps({
  id: Number, 
  titulo: String,
  subtitulo: String,
  descripcion: String,
  imagen: String
});

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
  if (usuarioId.value && curso.id) {
    await verificarInscripcion();
  }
});

// Verificar si el usuario está inscrito en este curso
async function verificarInscripcion() {
  try {
    const response = await fetch(`http://localhost:5687/api/UsuarioCurso/usuario/${usuarioId.value}`);
    
    if (response.ok) {
      const inscripciones = await response.json();
      estaInscrito.value = inscripciones.some(i => i.idCurso === curso.id);
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
    mostrarMensaje('Debes iniciar sesión para inscribirte en cursos', 'error');
    router.push('/login');
    return;
  }
  
  try {
    if (estaInscrito.value) {
      // ELIMINAR inscripción (usando query parameters)
      const url = `http://localhost:5687/api/UsuarioCurso?idUsuario=${usuarioId.value}&idCurso=${curso.id}`;
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
        mostrarMensaje('Error al desinscribirte del curso', 'error');
      }
    } else {
      // CREAR inscripción - SIMPLIFICADO AL MÁXIMO
      // Basado en los errores, parece que UsuarioCurso constructor espera IdUsuario e IdCurso
      const datos = {
        IdUsuario: usuarioId.value,
        IdCurso: curso.id
      };
      
      console.log("Creando inscripción con datos:", datos);
      
      const response = await fetch("http://localhost:5687/api/UsuarioCurso", {
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
        mostrarMensaje('Error al inscribirte en el curso', 'error');
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
      <v-img :src="imagen" height="200px" cover></v-img>
      
      <v-card-title>
        {{ titulo }}
      </v-card-title>
      
      <v-card-subtitle>
        {{ subtitulo }}
      </v-card-subtitle>
      
      <v-card-actions>
        <v-btn variant="flat" :color="estaInscrito ? 'orange' : 'white'" class="CardCurso__BotonLike" @click.stop="toggleInscripcion($event)">
          <v-icon :color="estaInscrito ? 'white' : 'orange'">
            {{ estaInscrito ? 'mdi-heart' : 'mdi-heart-outline' }}
          </v-icon>
        </v-btn>
      </v-card-actions>
      
      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>
          <v-card-text>{{ descripcion }}</v-card-text>
        </div>
      </v-expand-transition>
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
  @import "@/assets/sass/components/Cards/Ccurso.scss";
</style>