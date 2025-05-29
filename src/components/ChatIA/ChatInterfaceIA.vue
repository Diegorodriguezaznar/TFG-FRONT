<template>
  <section class="ChatInterfaceIA" ref="chatSection">
    <v-container>
      <div class="ChatInterfaceIA__Header">
        <div class="d-flex align-center justify-center mb-4">
          <v-avatar size="60" color="cyan" class="mr-4">
            <v-icon color="white" size="35">mdi-robot-happy</v-icon>
          </v-avatar>
          <div>
            <h2 class="ChatInterfaceIA__Title">Chatea con MarIAno</h2>
            <p class="ChatInterfaceIA__Subtitle">Tu asistente personal de AcademIQ</p>
          </div>
        </div>
      </div>

      <v-card class="ChatInterfaceIA__ChatCard" elevation="8" rounded="xl">
        <!-- Estado de conexión -->
        <div class="ChatInterfaceIA__StatusBar">
          <div class="d-flex align-center">
            <div class="ChatInterfaceIA__StatusDot" :class="{ 'online': !cargando }"></div>
            <span class="ChatInterfaceIA__StatusText">
              {{ cargando ? 'MarIAno está pensando...' : 'MarIAno está en línea' }}
            </span>
          </div>
        </div>

        <!-- Chat log -->
        <div class="ChatInterfaceIA__ChatLog" ref="chatLog">
          <!-- Mensaje de bienvenida -->
          <div v-if="historial.length === 0" class="ChatInterfaceIA__WelcomeMessage">
            <v-avatar size="40" color="cyan" class="mb-3">
              <v-icon color="white">mdi-robot-happy</v-icon>
            </v-avatar>
            <div class="ChatInterfaceIA__WelcomeBubble">
              <h4>¡Hola! Soy MarIAno 👋</h4>
              <p>Tu asistente personal de AcademIQ. Estoy aquí para ayudarte con cualquier duda sobre la plataforma.</p>
              <div class="ChatInterfaceIA__QuickQuestions">
                <h5>Preguntas rápidas:</h5>
                <v-chip
                  v-for="question in quickQuestions"
                  :key="question"
                  @click="enviarPreguntaRapida(question)"
                  color="cyan-lighten-4"
                  size="small"
                  variant="elevated"
                  class="ma-1 ChatInterfaceIA__QuickChip"
                >
                  {{ question }}
                </v-chip>
              </div>
            </div>
          </div>

          <!-- Mensajes del historial -->
          <div 
            v-for="(msg, index) in historial" 
            :key="index" 
            class="ChatInterfaceIA__Message"
            :class="msg.tipo"
          >
            <div v-if="msg.tipo === 'user'" class="ChatInterfaceIA__UserMessage">
              <div class="ChatInterfaceIA__MessageBubble ChatInterfaceIA__MessageBubble--user">
                <p>{{ msg.texto }}</p>
                <div class="ChatInterfaceIA__MessageTime">
                  {{ formatTime(msg.timestamp) }}
                </div>
              </div>
              <v-avatar size="32" color="blue" class="ml-2">
                <v-icon color="white" size="18">mdi-account</v-icon>
              </v-avatar>
            </div>

            <div v-else class="ChatInterfaceIA__IAMessage">
              <v-avatar size="32" color="cyan" class="mr-2">
                <v-icon color="white" size="18">mdi-robot</v-icon>
              </v-avatar>
              <div class="ChatInterfaceIA__MessageBubble ChatInterfaceIA__MessageBubble--ia">
                <div class="ChatInterfaceIA__TypingIndicator" v-if="msg.typing">
                  <div class="ChatInterfaceIA__TypingDots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
                <div v-else>
                  <p>{{ msg.texto }}</p>
                  <div class="ChatInterfaceIA__MessageTime">
                    {{ formatTime(msg.timestamp) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Indicador de escritura -->
          <div v-if="cargando" class="ChatInterfaceIA__Message ia">
            <div class="ChatInterfaceIA__IAMessage">
              <v-avatar size="32" color="cyan" class="mr-2">
                <v-icon color="white" size="18">mdi-robot</v-icon>
              </v-avatar>
              <div class="ChatInterfaceIA__MessageBubble ChatInterfaceIA__MessageBubble--ia">
                <div class="ChatInterfaceIA__TypingIndicator">
                  <div class="ChatInterfaceIA__TypingDots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input del chat -->
        <div class="ChatInterfaceIA__InputSection">
          <v-form @submit.prevent="enviarPregunta" class="ChatInterfaceIA__Form">
            <v-text-field
              v-model="pregunta"
              placeholder="Escribe tu pregunta aquí..."
              variant="outlined"
              density="comfortable"
              hide-details
              :disabled="cargando"
              class="ChatInterfaceIA__Input"
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
          
          <!-- Información adicional -->
          <div class="ChatInterfaceIA__InputInfo">
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

// Variables reactivas
const pregunta = ref('');
const historial = ref<any[]>([]);
const cargando = ref(false);
const chatLog = ref<HTMLElement>();
const chatSection = ref<HTMLElement>();

// Preguntas rápidas
const quickQuestions = ref([
  '¿Cómo navego por los cursos?',
  '¿Dónde están mis favoritos?',
  '¿Cómo cambio mi perfil?',
  '¿Puedo descargar videos?',
  '¿Cómo me convierto en profesor?'
]);

// Métodos
const enviarPregunta = async () => {
  const texto = pregunta.value.trim();
  if (!texto || cargando.value) return;

  // Agregar mensaje del usuario
  historial.value.push({ 
    tipo: 'user', 
    texto,
    timestamp: new Date()
  });
  
  pregunta.value = '';
  cargando.value = true;
  
  // Scroll al final
  await nextTick();
  scrollToBottom();

  try {
    const res = await axios.post('http://localhost:3001/api/ia', {
      pregunta: texto
    });
    
    // Agregar respuesta de la IA
    historial.value.push({ 
      tipo: 'ia', 
      texto: res.data.respuesta || 'Lo siento, no pude procesar tu pregunta. ¿Podrías reformularla?',
      timestamp: new Date()
    });
  } catch (err: any) {
    console.error('Error al contactar con MarIAno:', err);
    
    // Respuesta de error amigable
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

// Exponer método para scroll desde componente padre
defineExpose({
  scrollToChat: () => {
    if (chatSection.value) {
      chatSection.value.scrollIntoView({ behavior: 'smooth' });
    }
  }
});
</script>

<style scoped>
.ChatInterfaceIA {
  padding: 60px 0;
  background: white;
}

.ChatInterfaceIA__Header {
  text-align: center;
  margin-bottom: 2rem;
}

.ChatInterfaceIA__Title {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.ChatInterfaceIA__Subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

.ChatInterfaceIA__ChatCard {
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(0, 188, 212, 0.2);
}

.ChatInterfaceIA__StatusBar {
  padding: 12px 20px;
  background: rgba(0, 188, 212, 0.05);
  border-bottom: 1px solid rgba(0, 188, 212, 0.1);
}

.ChatInterfaceIA__StatusDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
  margin-right: 8px;
  transition: all 0.3s ease;
}

.ChatInterfaceIA__StatusDot.online {
  background: #4CAF50;
  box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
}

.ChatInterfaceIA__StatusText {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.ChatInterfaceIA__ChatLog {
  height: 500px;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.ChatInterfaceIA__WelcomeMessage {
  text-align: center;
  padding: 2rem 1rem;
}

.ChatInterfaceIA__WelcomeBubble {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 188, 212, 0.2);
  max-width: 400px;
  margin: 0 auto;
}

.ChatInterfaceIA__WelcomeBubble h4 {
  color: #00BCD4;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.ChatInterfaceIA__WelcomeBubble p {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.ChatInterfaceIA__QuickQuestions h5 {
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-align: left;
}

.ChatInterfaceIA__QuickChip {
  cursor: pointer;
  transition: all 0.2s ease;
}

.ChatInterfaceIA__QuickChip:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);
}

.ChatInterfaceIA__Message {
  margin-bottom: 1rem;
  animation: messageSlideIn 0.3s ease-out;
}

.ChatInterfaceIA__UserMessage,
.ChatInterfaceIA__IAMessage {
  display: flex;
  align-items: flex-end;
}

.ChatInterfaceIA__UserMessage {
  justify-content: flex-end;
}

.ChatInterfaceIA__IAMessage {
  justify-content: flex-start;
}

.ChatInterfaceIA__MessageBubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.ChatInterfaceIA__MessageBubble--user {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  border-bottom-right-radius: 6px;
}

.ChatInterfaceIA__MessageBubble--ia {
  background: white;
  border: 1px solid rgba(0, 188, 212, 0.2);
  color: #333;
  border-bottom-left-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ChatInterfaceIA__MessageBubble p {
  margin: 0;
  line-height: 1.4;
  word-wrap: break-word;
}

.ChatInterfaceIA__MessageTime {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
  text-align: right;
}

.ChatInterfaceIA__MessageBubble--ia .ChatInterfaceIA__MessageTime {
  text-align: left;
}

.ChatInterfaceIA__TypingIndicator {
  padding: 8px 0;
}

.ChatInterfaceIA__TypingDots {
  display: flex;
  gap: 4px;
  align-items: center;
}

.ChatInterfaceIA__TypingDots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00BCD4;
  animation: typing 1.4s infinite;
}

.ChatInterfaceIA__TypingDots span:nth-child(2) {
  animation-delay: 0.2s;
}

.ChatInterfaceIA__TypingDots span:nth-child(3) {
  animation-delay: 0.4s;
}

.ChatInterfaceIA__InputSection {
  padding: 20px;
  background: white;
  border-top: 1px solid rgba(0, 188, 212, 0.1);
}

.ChatInterfaceIA__Form {
  margin-bottom: 8px;
}

.ChatInterfaceIA__Input {
  border-radius: 25px;
}

.ChatInterfaceIA__InputInfo {
  text-align: center;
}

/* Animaciones */
@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

/* Scrollbar personalizada */
.ChatInterfaceIA__ChatLog::-webkit-scrollbar {
  width: 6px;
}

.ChatInterfaceIA__ChatLog::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.ChatInterfaceIA__ChatLog::-webkit-scrollbar-thumb {
  background: rgba(0, 188, 212, 0.3);
  border-radius: 3px;
}

.ChatInterfaceIA__ChatLog::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 188, 212, 0.5);
}

@media (max-width: 768px) {
  .ChatInterfaceIA {
    padding: 40px 0;
  }
  
  .ChatInterfaceIA__ChatLog {
    height: 400px;
    padding: 15px;
  }
  
  .ChatInterfaceIA__MessageBubble {
    max-width: 85%;
  }
  
  .ChatInterfaceIA__WelcomeBubble {
    padding: 1rem;
  }
}
</style>