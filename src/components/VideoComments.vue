<script setup>
// --------------------------- Imports ---------------------------
import { ref } from 'vue';

// --------------------------- Props ---------------------------
const props = defineProps({
  comments: {
    type: Array,
    required: true
  }
});

// --------------------------- Emits ---------------------------
const emit = defineEmits(['add-comment']);

// --------------------------- Variables ---------------------------
const newComment = ref('');
const showComments = ref(true);

// --------------------------- Métodos ---------------------------
const addComment = () => {
  if (newComment.value.trim()) {
    emit('add-comment', newComment.value);
    newComment.value = '';
  }
};

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const likeComment = (commentId) => {
  // Aquí iría la lógica para dar like a un comentario
  console.log('Like a comentario:', commentId);
};
</script>

<template>
  <div class="VideoComments">
    <div class="d-flex align-center mb-4">
      <h2 class="text-h6 font-weight-medium">
        {{ comments.length }} comentarios
      </h2>
      
      <v-btn 
        icon 
        size="small" 
        class="ml-2"
        @click="toggleComments"
      >
        <v-icon>{{ showComments ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
      </v-btn>
    </div>
    
    <!-- Formulario para añadir un comentario -->
    <div class="VideoComments__Form d-flex align-start mb-6">
      <v-avatar size="40" class="mr-3">
        <v-img src="https://picsum.photos/seed/currentuser/40/40" alt="Tu avatar"></v-img>
      </v-avatar>
      
      <v-text-field
        v-model="newComment"
        placeholder="Añade un comentario..."
        variant="outlined"
        density="compact"
        hide-details
        class="flex-grow-1"
        @keyup.enter="addComment"
      ></v-text-field>
      
      <v-btn
        color="primary"
        variant="text"
        class="ml-2"
        :disabled="!newComment.trim()"
        @click="addComment"
      >
        Comentar
      </v-btn>
    </div>
    
    <!-- Lista de comentarios -->
    <v-expand-transition>
      <div v-if="showComments">
        <div 
          v-for="comment in comments" 
          :key="comment.id"
          class="VideoComments__Item d-flex mb-4"
        >
          <v-avatar size="40" class="mr-3">
            <v-img :src="comment.avatar" :alt="comment.user"></v-img>
          </v-avatar>
          
          <div class="flex-grow-1">
            <div class="d-flex align-center">
              <span class="font-weight-medium">{{ comment.user }}</span>
              <span class="text-caption text-grey ml-2">{{ comment.time }}</span>
            </div>
            
            <p class="text-body-2 mt-1">{{ comment.content }}</p>
            
            <div class="d-flex align-center mt-1">
              <v-btn 
                icon 
                size="x-small" 
                variant="plain"
                @click="likeComment(comment.id)"
              >
                <v-icon size="small">mdi-thumb-up</v-icon>
              </v-btn>
              
              <span class="text-caption ml-1">{{ comment.likes }}</span>
              
              <v-btn 
                icon 
                size="x-small" 
                variant="plain"
                class="ml-2"
              >
                <v-icon size="small">mdi-thumb-down</v-icon>
              </v-btn>
              
              <v-btn 
                variant="text" 
                size="small" 
                class="ml-4 text-caption"
              >
                Responder
              </v-btn>
            </div>
          </div>
        </div>
        
        <!-- Botón para cargar más comentarios -->
        <div class="text-center mt-4">
          <v-btn variant="outlined" size="small">
            Cargar más comentarios
          </v-btn>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.VideoComments {
  padding: 0 16px;
  margin-bottom: 24px;
}

.VideoComments__Item:hover {
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 8px;
}

@media (max-width: 600px) {
  .VideoComments__Form {
    flex-direction: column;
  }
  
  .VideoComments__Form .v-btn {
    margin-left: 43px !important;
    margin-top: 8px;
    align-self: flex-start;
  }
}
</style>