<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, watch, computed } from 'vue';
import { useComentarioStore } from '@/stores/Comentario';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import type { ComentarioUI } from '@/stores/dtos/ComentarioDTO';
import { storeToRefs } from 'pinia';
import ModalReportarComentario from './Modales/ModalReportarComentario.vue';
import ModalNotificacion from './Modales/ModalReporteCorrecto.vue';

// --------------------------- Stores ---------------------------
const comentarioStore = useComentarioStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const { loading: storeLoading, errorMessage } = storeToRefs(comentarioStore);

// --------------------------- Props ---------------------------
const props = defineProps({
  videoId: {
    type: Number,
    required: true
  }
});

// --------------------------- Variables ---------------------------
const comments = ref<ComentarioUI[]>([]);
const newComment = ref('');
const commentError = ref('');
const showLoginMsg = ref(false);

// Variables para los modales de reporte
const dialogConfirmarReporte = ref(false);
const dialogReporteExitoso = ref(false);
const dialogErrorReporte = ref(false);
const comentarioAReportar = ref<ComentarioUI | null>(null);
const mensajeError = ref('');
const cargandoReporte = ref(false);

// --------------------------- Computed ---------------------------
const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);
const usuarioId = computed(() => {
  if (!usuarioActual.value) return null;
  return usuarioActual.value.idUsuario || usuarioActual.value.id || null;
});

// --------------------------- Métodos ---------------------------
const cargarComentarios = async () => {
  try {
    if (props.videoId) {
      console.log(`Cargando comentarios para video ID: ${props.videoId}`);
      const comentarios = await comentarioStore.fetchComentariosByVideoId(props.videoId);
      comments.value = comentarios;
      
      console.log("Comentarios cargados:", comentarios);
    }
  } catch (error) {
    console.error("Error al cargar comentarios:", error);
  }
};
const eliminarComentario = async (idComentario: number) => {
  try {
    const exito = await comentarioStore.eliminarComentarioPropio(idComentario);
    if (exito) {
      comments.value = comments.value.filter(c => c.id !== idComentario);
    }
  } catch (error) {
    console.error("Error eliminando comentario:", error);
  }
};


const abrirModalReporte = (comentario: ComentarioUI) => {
  if (!usuarioId.value) {
    showLoginMsg.value = true;
    return;
  }
  
  comentarioAReportar.value = comentario;
  dialogConfirmarReporte.value = true;
};

const confirmarReporte = async () => {
  if (!comentarioAReportar.value) return;
  
  cargandoReporte.value = true;
  
  try {
    const exito = await comentarioStore.reportarComentario(comentarioAReportar.value.id);
    
    if (exito) {
      dialogConfirmarReporte.value = false;
      dialogReporteExitoso.value = true;
    } else {
      dialogConfirmarReporte.value = false;
      mensajeError.value = 'No se pudo reportar el comentario. Inténtalo de nuevo.';
      dialogErrorReporte.value = true;
    }
  } catch (error: any) {
    dialogConfirmarReporte.value = false;
    mensajeError.value = error.message || 'Error al reportar el comentario';
    dialogErrorReporte.value = true;
  } finally {
    cargandoReporte.value = false;
    comentarioAReportar.value = null;
  }
};

const submitComment = async () => {
  // Validar que el comentario no esté vacío
  if (!newComment.value.trim()) {
    commentError.value = 'Por favor, escribe un comentario';
    return;
  }
  
  // Validar que el usuario esté logueado
  if (!usuarioId.value) {
    showLoginMsg.value = true;
    return;
  }
  
  commentError.value = '';
  
  try {
    const nuevoComentario = await comentarioStore.createComentario({
      contenido: newComment.value,
      idUsuario: usuarioId.value,
      idVideo: props.videoId
    });
    
    if (nuevoComentario) {
      // Añadir el nuevo comentario al inicio de la lista
      comments.value.unshift(nuevoComentario);
      
      // Limpiar el formulario
      newComment.value = '';
    }
  } catch (error: any) {
    commentError.value = error.message || 'Error al enviar el comentario';
    console.error("Error al enviar comentario:", error);
  }
};

// --------------------------- Watchers ---------------------------
watch(() => props.videoId, (newId) => {
  if (newId) {
    cargarComentarios();
  }
});

// --------------------------- Lifecycle Hooks ---------------------------
onMounted(() => {
  cargarComentarios();
});
</script>

<template>
  <div class="VideoComments">
    <h3 class="text-subtitle-1 font-weight-bold mb-4">
      {{ comments.length }} Comentarios
    </h3>
    
    <!-- Loader -->
    <div v-if="storeLoading && comments.length === 0" class="d-flex justify-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <!-- Mensaje de error -->
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      closable
      class="mb-4"
    >
      {{ errorMessage }}
    </v-alert>
    
    <!-- Formulario para agregar comentarios -->
    <div v-if="!storeLoading || comments.length > 0" class="VideoComments__Form d-flex align-start mb-6">
      <v-avatar size="40" class="mr-3 mt-1">
        <v-img 
          :src="usuarioActual ? `https://picsum.photos/seed/user${usuarioId}/40/40` : 'https://picsum.photos/seed/guest/40/40'" 
          alt="Tu avatar"
        ></v-img>
      </v-avatar>
      
      <div class="VideoComments__Input flex-grow-1">
        <v-textarea
          v-model="newComment"
          :label="usuarioActual ? 'Añadir un comentario...' : 'Inicia sesión para comentar'"
          rows="1"
          auto-grow
          hide-details="auto"
          density="comfortable"
          variant="outlined"
          :error-messages="commentError"
          :disabled="!usuarioActual"
        ></v-textarea>
        
        <div class="d-flex justify-end mt-2">
          <v-btn 
            variant="text" 
            class="mr-2"
            @click="newComment = ''"
            :disabled="!usuarioActual || !newComment.trim()"
          >
            Cancelar
          </v-btn>
          
          <v-btn 
            color="primary" 
            @click="submitComment"
            :loading="storeLoading"
            :disabled="!usuarioActual || !newComment.trim()"
          >
            Comentar
          </v-btn>
        </div>
        
        <!-- Mensaje para iniciar sesión -->
        <v-alert
          v-if="showLoginMsg"
          type="info"
          variant="tonal"
          closable
          class="mt-2"
          @click:close="showLoginMsg = false"
        >
          Debes iniciar sesión para poder comentar.
        </v-alert>
      </div>
    </div>
    
    <!-- Lista de comentarios -->
    <div v-if="comments.length > 0" class="VideoComments__List">
      <div v-for="comment in comments" :key="comment.id" class="VideoComments__Comment mb-4">
        <div class="d-flex">
          <v-avatar size="40" class="mr-3">
            <v-img :src="comment.avatar" :alt="comment.user"></v-img>
          </v-avatar>
          
          <div class="VideoComments__CommentContent">
            <div class="d-flex align-center">
              <span class="font-weight-medium">{{ comment.user }}</span>
              <span class="ml-2 text-caption text-grey">{{ comment.time }}</span>
            </div>
            
            <p class="mt-1 text-body-2">{{ comment.content }}</p>
            
            <div class="d-flex align-center mt-1">
              <v-btn icon variant="plain" size="small">
                <v-icon size="small">mdi-thumb-up</v-icon>
              </v-btn>
              
              <span class="text-caption mr-4">{{ comment.likes }}</span>
              
              <v-btn icon variant="plain" size="small">
                <v-icon size="small">mdi-thumb-down</v-icon>
              </v-btn>
              
              <v-btn 
                variant="text" 
                class="text-caption ml-4 text-red"
                @click="abrirModalReporte(comment)"
              >
                Reportar
              </v-btn>
              <v-btn 
                v-if="comment.idUsuario === usuarioId" 
                variant="text" 
                class="text-caption ml-2 text-grey"
                @click="eliminarComentario(comment.id)"
              >
                Eliminar
              </v-btn>

            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Estado sin comentarios -->
    <div v-else-if="!storeLoading" class="VideoComments__Empty text-center py-4">
      <v-icon color="grey" size="large">mdi-comment-text-outline</v-icon>
      <p class="mt-2 text-body-2 text-grey">No hay comentarios aún. ¡Sé el primero en comentar!</p>
    </div>

    <!-- Modal de confirmación de reporte -->
    <ModalReportarComentario
      :mostrar="dialogConfirmarReporte"
      :comentario="comentarioAReportar"
      :cargando="cargandoReporte"
      @update:mostrar="dialogConfirmarReporte = $event"
      @confirmar="confirmarReporte"
    />

    <!-- Modal de reporte exitoso -->
    <ModalNotificacion
      :mostrar="dialogReporteExitoso"
      tipo="success"
      titulo="Reporte enviado"
      mensaje="Gracias por reportar este comentario. Nuestro equipo lo revisará pronto."
      @update:mostrar="dialogReporteExitoso = $event"
    />

    <!-- Modal de error en reporte --> 
    <ModalNotificacion
      :mostrar="dialogErrorReporte"
      tipo="error"
      titulo="Error al reportar"
      :mensaje="mensajeError"
      texto-boton="Cerrar"
      @update:mostrar="dialogErrorReporte = $event"
    />
  </div>
</template>

<style scoped>
.VideoComments {
  padding: 0 16px 24px;
}

.VideoComments__Form {
  margin-bottom: 24px;
}

.VideoComments__Comment {
  margin-bottom: 16px;
}

.VideoComments__CommentContent {
  flex: 1;
}

.VideoComments__Empty {
  padding: 32px 0;
}
</style>