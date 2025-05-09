<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, watch, computed } from 'vue';
// Comentamos temporalmente esta importación para ver si es el origen del problema
// import { useComentarioStore } from '@/stores/Comentario';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

// --------------------------- Stores ---------------------------
// Comentamos temporalmente el uso del store para ver si es el origen del problema
// const comentarioStore = useComentarioStore();
const usuarioLogeadoStore = useUsuarioLogeadoStore();

// --------------------------- Props ---------------------------
const props = defineProps({
  videoId: {
    type: Number,
    default: 0
  }
});

// --------------------------- Variables ---------------------------
const comments = ref([]);
const newComment = ref('');
const commentError = ref('');
const loading = ref(false);
const showLoginMsg = ref(false);

// --------------------------- Computed ---------------------------
const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);
const usuarioId = computed(() => {
  if (!usuarioActual.value) return null;
  return usuarioActual.value.idUsuario || usuarioActual.value.id || null;
});

// --------------------------- Métodos ---------------------------
// Usamos datos simulados temporalmente para evitar el error
const cargarComentarios = async () => {
  loading.value = true;
  
  try {
    // Comentamos temporalmente la llamada al store
    /*
    if (props.videoId) {
      const comentarios = await comentarioStore.fetchComentariosByArchivoId(props.videoId);
      comments.value = comentarios.map(c => transformarComentario(c));
    }
    */
    
    // Simulamos datos para probar
    setTimeout(() => {
      comments.value = [
        {
          id: 1,
          user: 'Laura García',
          avatar: 'https://picsum.photos/seed/user1/40/40',
          content: 'Excelente video, me ha sido muy útil para entender este tema.',
          likes: 24,
          time: 'hace 2 días'
        },
        {
          id: 2,
          user: 'Carlos Mendoza',
          avatar: 'https://picsum.photos/seed/user2/40/40',
          content: 'Me encantaría ver más contenido como este. ¡Gracias por compartir!',
          likes: 18,
          time: 'hace 1 día'
        }
      ];
      loading.value = false;
    }, 500);
    
  } catch (error) {
    console.error("Error al cargar comentarios:", error);
    loading.value = false;
  }
};

// Transformar comentario - también desactivado temporalmente
/*
const transformarComentario = (c) => {
  const fecha = new Date(c.fechaCreacion);
  const ahora = new Date();
  
  let tiempoTexto = '';
  const diferenciaMs = ahora.getTime() - fecha.getTime();
  const segundos = Math.floor(diferenciaMs / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) {
    tiempoTexto = dias === 1 ? 'hace 1 día' : `hace ${dias} días`;
  } else if (horas > 0) {
    tiempoTexto = horas === 1 ? 'hace 1 hora' : `hace ${horas} horas`;
  } else if (minutos > 0) {
    tiempoTexto = minutos === 1 ? 'hace 1 minuto' : `hace ${minutos} minutos`;
  } else {
    tiempoTexto = 'ahora mismo';
  }
  
  return {
    id: c.idComentario,
    user: c.usuario?.nombre || 'Usuario',
    avatar: `https://picsum.photos/seed/user${c.idUsuario}/40/40`,
    content: c.contenido,
    likes: Math.floor(Math.random() * 100),
    time: tiempoTexto,
    idUsuario: c.idUsuario,
    fechaCreacion: c.fechaCreacion
  };
};
*/

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
  
  // Simular envío de comentario
  loading.value = true;
  
  setTimeout(() => {
    const nuevoComentario = {
      id: Date.now(),
      user: usuarioActual.value?.nombre || 'Usuario actual',
      avatar: `https://picsum.photos/seed/user${usuarioId.value}/40/40`,
      content: newComment.value,
      likes: 0,
      time: 'ahora mismo'
    };
    
    comments.value.unshift(nuevoComentario);
    newComment.value = '';
    commentError.value = '';
    loading.value = false;
  }, 500);
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
    <div v-if="loading && comments.length === 0" class="d-flex justify-center my-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    
    <!-- Formulario para agregar comentarios -->
    <div v-if="!loading || comments.length > 0" class="VideoComments__Form d-flex align-start mb-6">
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
            :loading="loading"
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
              
              <v-btn variant="text" class="text-caption ml-4">Responder</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Estado sin comentarios -->
    <div v-else-if="!loading" class="VideoComments__Empty text-center py-4">
      <v-icon color="grey" size="large">mdi-comment-text-outline</v-icon>
      <p class="mt-2 text-body-2 text-grey">No hay comentarios aún. ¡Sé el primero en comentar!</p>
    </div>
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