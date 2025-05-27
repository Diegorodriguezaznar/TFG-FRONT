<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { useComentarioStore } from '@/stores/Comentario';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import type { ComentarioUI } from '@/stores/dtos/ComentarioDTO';
import { storeToRefs } from 'pinia';
import ModalReportarComentario from './Modales/ModalReportarComentario.vue';
import ModalNotificacion from './Modales/ModalReporteCorrecto.vue';
import UserAvatar from '@/components/UserAvatar.vue';

const comentarioStore = useComentarioStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const { loading: storeLoading, errorMessage } = storeToRefs(comentarioStore);

const props = defineProps({
  videoId: {
    type: Number,
    required: true
  }
});

const comments = ref<ComentarioUI[]>([]);
const newComment = ref('');
const commentError = ref('');
const showLoginMsg = ref(false);

const dialogConfirmarReporte = ref(false);
const dialogReporteExitoso = ref(false);
const dialogErrorReporte = ref(false);
const comentarioAReportar = ref<ComentarioUI | null>(null);
const mensajeError = ref('');
const cargandoReporte = ref(false);

const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);
const usuarioId = computed(() => {
  if (!usuarioActual.value) return null;
  return usuarioActual.value.idUsuario || usuarioActual.value.id || null;
});

const cargarComentarios = async () => {
  try {
    if (props.videoId) {
      const comentarios = await comentarioStore.fetchComentariosByVideoId(props.videoId);
      comments.value = comentarios;
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
  if (!newComment.value.trim()) {
    commentError.value = 'Por favor, escribe un comentario';
    return;
  }
  
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
      comments.value.unshift(nuevoComentario);
      newComment.value = '';
    }
  } catch (error: any) {
    commentError.value = error.message || 'Error al enviar el comentario';
    console.error("Error al enviar comentario:", error);
  }
};

// Función para obtener el rol de un comentario basado en el ID del usuario
const obtenerRolComentario = (comment: ComentarioUI) => {
  // Si el comentario es del usuario actual, usar su rol
  if (comment.idUsuario === usuarioId.value && usuarioActual.value) {
    return usuarioActual.value.idRol;
  }
  
  // Para otros usuarios, podrías tener esta info en el comentario
  // o hacer una llamada para obtenerla. Por ahora, usar rol por defecto
  return 1; // Rol de estudiante por defecto
};

// --------------------------- Watchers ---------------------------
watch(() => props.videoId, (newId) => {
  if (newId) {
    cargarComentarios();
  }
});

onMounted(() => {
  cargarComentarios();
});
</script>

<template>
  <div class="VideoComments">
    <h3 class="VideoComments__titulo">{{ comments.length }} Comentarios</h3>
    
    <div v-if="storeLoading && comments.length === 0" class="VideoComments__loading">
      <v-progress-circular indeterminate color="primary" />
    </div>
    
    <v-alert
      v-if="errorMessage"
      type="error"
      variant="tonal"
      closable
      class="VideoComments__alerta"
    >
      {{ errorMessage }}
    </v-alert>
    
    <!-- Formulario para agregar comentarios -->
    <div v-if="!storeLoading || comments.length > 0" class="VideoComments__Form d-flex align-start mb-6">
      <!-- Avatar del usuario actual -->
      <UserAvatar
        v-if="usuarioActual"
        :usuario="usuarioActual"
        :size="40"
        class="mr-3 mt-1"
      />
      <UserAvatar
        v-else
        :nombre="'Invitado'"
        :id-rol="1"
        :size="40"
        class="mr-3 mt-1"
      />
      
      <div class="VideoComments__input">
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
        />
        
        <div class="VideoComments__botones">
          <v-btn 
            variant="text" 
            class="VideoComments__cancelar"
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
        
        <v-alert
          v-if="showLoginMsg"
          type="info"
          variant="tonal"
          closable
          class="VideoComments__login-msg"
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
          <!-- Avatar del usuario que comentó -->
          <UserAvatar
            :nombre="comment.user"
            :id-rol="obtenerRolComentario(comment)"
            :size="40"
            class="mr-3"
          />
          
          <div class="VideoComments__comentario-contenido">
            <div class="VideoComments__comentario-header">
              <span class="VideoComments__usuario">{{ comment.user }}</span>
              <span class="VideoComments__tiempo">{{ comment.time }}</span>
            </div>
            
            <p class="VideoComments__texto">{{ comment.content }}</p>
            
            <div class="VideoComments__acciones">
              <v-btn icon variant="plain" size="small">
                <v-icon size="small">mdi-thumb-up</v-icon>
              </v-btn>
              
              <span class="VideoComments__likes">{{ comment.likes }}</span>
              
              <v-btn icon variant="plain" size="small">
                <v-icon size="small">mdi-thumb-down</v-icon>
              </v-btn>
              
              <v-btn 
                variant="text" 
                class="VideoComments__reportar"
                @click="abrirModalReporte(comment)"
              >
                Reportar
              </v-btn>
              
              <v-btn 
                v-if="comment.idUsuario === usuarioId" 
                variant="text" 
                class="VideoComments__eliminar"
                @click="eliminarComentario(comment.id)"
              >
                Eliminar
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!storeLoading" class="VideoComments__vacio">
      <v-icon color="grey" size="large">mdi-comment-text-outline</v-icon>
      <p class="VideoComments__vacio-texto">No hay comentarios aún. ¡Sé el primero en comentar!</p>
    </div>

    <ModalReportarComentario
      :mostrar="dialogConfirmarReporte"
      :comentario="comentarioAReportar"
      :cargando="cargandoReporte"
      @update:mostrar="dialogConfirmarReporte = $event"
      @confirmar="confirmarReporte"
    />

    <ModalNotificacion
      :mostrar="dialogReporteExitoso"
      tipo="success"
      titulo="Reporte enviado"
      mensaje="Gracias por reportar este comentario. Nuestro equipo lo revisará pronto."
      @update:mostrar="dialogReporteExitoso = $event"
    />

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

<style scoped lang="scss">
@import "@/assets/sass/components/Video/VideoComentarios";
</style>