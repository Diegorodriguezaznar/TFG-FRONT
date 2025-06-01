<template>
  <section class="chat-interface" ref="chatSection">
    <v-container>
      <div class="chat-interface__header">
        <div class="d-flex align-center justify-center mb-4">
          <v-avatar size="60" color="cyan" class="mr-4">
            <v-icon color="white" size="35">mdi-robot-happy</v-icon>
          </v-avatar>
          <div>
            <h2 class="chat-interface__title">Chatea con MarIAno</h2>
            <p class="chat-interface__subtitle">Tu asistente personal de AcademIQ</p>
          </div>
        </div>
      </div>

      <v-card class="chat-interface__card" elevation="8" rounded="xl">
        <div class="chat-interface__status-bar">
          <div class="d-flex align-center">
            <div class="chat-interface__status-dot" :class="{ 'chat-interface__status-dot--online': !cargando }"></div>
            <span class="chat-interface__status-text">
              {{ cargando ? 'MarIAno está pensando...' : 'MarIAno está en línea' }}
            </span>
          </div>
        </div>

        <div class="chat-interface__chat-log" ref="chatLog">
          <div v-if="historial.length === 0" class="chat-interface__welcome-message">
            <v-avatar size="40" color="cyan" class="mb-3">
              <v-icon color="white">mdi-robot-happy</v-icon>
            </v-avatar>
            <div class="chat-interface__welcome-bubble">
              <h4>¡Hola! Soy MarIAno 👋</h4>
              <p>Tu asistente personal de AcademIQ. Estoy aquí para ayudarte con cualquier duda sobre la plataforma.</p>
              <div class="chat-interface__quick-questions">
                <h5>Preguntas rápidas:</h5>
                <v-chip
                  v-for="question in quickQuestions"
                  :key="question"
                  @click="enviarPreguntaRapida(question)"
                  color="cyan-lighten-4"
                  size="small"
                  variant="elevated"
                  class="ma-1 chat-interface__quick-chip"
                >
                  {{ question }}
                </v-chip>
              </div>
            </div>
          </div>

          <div 
            v-for="(msg, index) in historial" 
            :key="index" 
            class="chat-interface__message"
            :class="msg.tipo"
          >
            <div v-if="msg.tipo === 'user'" class="chat-interface__user-message">
              <div class="chat-interface__message-bubble chat-interface__message-bubble--user">
                <p>{{ msg.texto }}</p>
                <div class="chat-interface__message-time">
                  {{ formatTime(msg.timestamp) }}
                </div>
              </div>
              <v-avatar size="32" color="blue" class="ml-2">
                <v-icon color="white" size="18">mdi-account</v-icon>
              </v-avatar>
            </div>

            <div v-else class="chat-interface__ia-message">
              <v-avatar size="32" color="cyan" class="mr-2">
                <v-icon color="white" size="18">mdi-robot</v-icon>
              </v-avatar>
              <div class="chat-interface__message-bubble chat-interface__message-bubble--ia">
                <div class="chat-interface__typing-indicator" v-if="msg.typing">
                  <div class="chat-interface__typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div v-else>
                  <p>{{ msg.texto }}</p>
                  <div class="chat-interface__message-time">
                    {{ formatTime(msg.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="cargando" class="chat-interface__message ia">
            <div class="chat-interface__ia-message">
              <v-avatar size="32" color="cyan" class="mr-2">
                <v-icon color="white" size="18">mdi-robot</v-icon>
              </v-avatar>
              <div class="chat-interface__message-bubble chat-interface__message-bubble--ia">
                <div class="chat-interface__typing-indicator">
                  <div class="chat-interface__typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chat-interface__input-section">
          <v-form @submit.prevent="enviarPregunta" class="chat-interface__form">
            <v-text-field
              v-model="pregunta"
              placeholder="Escribe tu pregunta aquí..."
              variant="outlined"
              density="comfortable"
              hide-details
              :disabled="cargando"
              class="chat-interface__input"
              @keydown.enter.prevent="enviarPregunta"
            >
              <template v-slot:prepend-inner>
                <v-icon color="cyan">mdi-message-text</v-icon>
              </template>
              <template v-slot:append-inner>
                <v-btn
                  @click="enviarPregunta"
                  :disabled="cargando || !pregunta.trim()"
                  :loading="cargando"
                  color="cyan"
                  variant="elevated"
                  size="small"
                  rounded="lg"
                >
                  <v-icon>mdi-send</v-icon>
                </v-btn>
              </template>
            </v-text-field>
          </v-form>
          
          <div class="chat-interface__input-info">
            <p class="text-caption text-grey">
              <v-icon size="small" class="mr-1">mdi-information</v-icon>
              MarIAno responde sobre AcademIQ. Para soporte técnico avanzado, contacta al administrador.
            </p>
          </div>
        </div>
      </v-card>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import axios from 'axios';

const pregunta = ref('');
const historial = ref<any[]>([]);
const cargando = ref(false);
const chatLog = ref<HTMLElement>();
const chatSection = ref<HTMLElement>();

const quickQuestions = ref([
  '¿Cómo navego por los cursos?',
  '¿Dónde están mis favoritos?',
  '¿Cómo cambio mi perfil?',
  '¿Puedo descargar videos?',
  '¿Cómo me convierto en profesor?'
]);

const enviarPregunta = async () => {
  const texto = pregunta.value.trim();
  if (!texto || cargando.value) return;

  historial.value.push({ 
    tipo: 'user', 
    texto,
    timestamp: new Date()
  });
  
  pregunta.value = '';
  cargando.value = true;
  
  await nextTick();
  scrollToBottom();

  try {
    const res = await axios.post('http://localhost:3001/api/ia', {
      pregunta: texto
    });
    
    historial.value.push({ 
      tipo: 'ia', 
      texto: res.data.respuesta || 'Lo siento, no pude procesar tu pregunta. ¿Podrías reformularla?',
      timestamp: new Date()
    });
  } catch (err: any) {
    console.error('Error al contactar con MarIAno:', err);
    
    historial.value.push({ 
      tipo: 'ia', 
      texto: '🤖 ¡Oops! Parece que tengo problemas de conexión. Por favor, intenta de nuevo en unos momentos. Mientras tanto, puedes revisar la sección de ayuda o contactar al soporte técnico.',
      timestamp: new Date()
    });
  } finally {
    cargando.value = false;
    await nextTick();
    scrollToBottom();
  }
};

const enviarPreguntaRapida = (question: string) => {
  pregunta.value = question;
  enviarPregunta();
};

const scrollToBottom = () => {
  if (chatLog.value) {
    chatLog.value.scrollTop = chatLog.value.scrollHeight;
  }
};

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

defineExpose({
  scrollToChat: () => {
    if (chatSection.value) {
      chatSection.value.scrollIntoView({ behavior: 'smooth' });
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/ChatIA/ChatInterfaceIA";
</style>