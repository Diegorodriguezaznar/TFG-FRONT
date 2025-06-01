<template>
  <div class="card-curso">
    <v-hover v-slot="{ isHovering }">
      <v-card 
        class="card-curso__item" 
        @click="seleccionarCurso"
        :elevation="isHovering ? 8 : 2"
      >
        <div class="card-curso__imagen-container">
          <v-img 
            :src="imagen || 'https://picsum.photos/300/200'" 
            height="220px" 
            cover
            class="card-curso__imagen"
            :class="{ 'card-curso__imagen--hover': isHovering }"
          ></v-img>
        </div>
        
        <v-card-title class="card-curso__titulo">
          {{ titulo }}
        </v-card-title>
        
        <v-card-text v-if="descripcion" class="card-curso__descripcion">
          {{ descripcion }}
        </v-card-text>
        
        <v-card-actions class="card-curso__acciones">
          <v-btn 
            v-if="!estaInscrito"
            variant="flat" 
            color="blue" 
            @click.stop="guardarCurso($event)"
            class="card-curso__boton card-curso__boton--guardar"
            :class="{ 'card-curso__boton--hover': isHovering, 'card-curso__boton--animar': animacionGuardar }"
          >
            <v-icon left class="mr-1">mdi-bookmark-outline</v-icon>
            Guardar
          </v-btn>
          
          <v-btn 
            v-if="estaInscrito"
            variant="flat" 
            color="red" 
            @click.stop="borrarGuardado($event)"
            class="card-curso__boton card-curso__boton--quitar"
            :class="{ 'card-curso__boton--hover': isHovering, 'card-curso__boton--animar': animacionGuardar }"
          >
            <v-icon left class="mr-1">mdi-bookmark-check</v-icon>
            Quitar
          </v-btn>
          
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-hover>
    
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";
import { useUsuarioCursoStore } from "@/stores/UsuarioCurso";

const usuarioLogeadoStore = useUsuarioLogeadoStore();
const usuarioCursoStore = useUsuarioCursoStore();
const router = useRouter();

const mostrarAlerta = ref(false);
const mensajeAlerta = ref('');
const tipoAlerta = ref('success');

const mostrarMensaje = (mensaje, tipo = 'success') => {
  mensajeAlerta.value = mensaje;
  tipoAlerta.value = tipo;
  mostrarAlerta.value = true;
  
  setTimeout(() => {
    mostrarAlerta.value = false;
  }, 3000);
};

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

const emit = defineEmits(['guardado', 'eliminado']);

const seleccionarCurso = () => {
  if (props.id) {
    router.push(`/curso/${props.id}`);
  }
};

const usuarioId = computed(() => {
  const usuario = usuarioLogeadoStore.usuarioActual;
  return usuario?.id || usuario?.idUsuario || null;
});

const estaInscrito = ref(false);
const animacionGuardar = ref(false);

onMounted(async () => {
  if (usuarioId.value && props.id) {
    await verificarInscripcion();
  }
});

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

const guardarCurso = async (event) => {
  event.stopPropagation();
  
  if (!usuarioId.value) {
    mostrarMensaje('Debes iniciar sesión para guardar curso', 'error');
    router.push('/login');
    return;
  }

  try {
    animacionGuardar.value = true;
    
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

    setTimeout(() => {
      animacionGuardar.value = false;
    }, 500);
    
  } catch (error) {
    console.error("Error al guardar curso:", error);
    mostrarMensaje('Error en la operación', 'error');
    animacionGuardar.value = false;
  }
};

const borrarGuardado = async (event) => {
  event.stopPropagation();
  
  if (!estaInscrito.value) {
    console.warn("No se puede borrar un curso que no está guardado");
    return;
  }
  
  try {
    animacionGuardar.value = true;
    
    if (!usuarioId.value || !props.id) {
      console.error("Error: Faltan datos para eliminar inscripción", { 
        usuarioId: usuarioId.value, 
        cursoId: props.id 
      });
      mostrarMensaje('Error al quitar curso guardado: Datos incompletos', 'error');
      animacionGuardar.value = false;
      return;
    }
    
    console.log("Eliminando inscripción usando el store...");
    
    const resultado = await usuarioCursoStore.deleteInscripcion(usuarioId.value, props.id);
    
    if (resultado) {
      estaInscrito.value = false;
      mostrarMensaje('Curso quitado de guardados', 'success');
      emit('eliminado', props.id);
    } else {
      console.error("Error al eliminar inscripción:", usuarioCursoStore.errorMessage);
      mostrarMensaje(`Error al quitar curso guardado: ${usuarioCursoStore.errorMessage}`, 'error');
    }

    setTimeout(() => {
      animacionGuardar.value = false;
    }, 500);
    
  } catch (error) {
    console.error("Error al borrar guardado:", error);
    mostrarMensaje(`Error en la operación: ${error.message}`, 'error');
    animacionGuardar.value = false;
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/Cursos/CardCurso";
</style>