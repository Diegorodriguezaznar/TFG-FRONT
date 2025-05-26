<template>
  <div class="chat-ia">
    <h1>Asistente IA - Pregunta sobre la plataforma</h1>

    <div class="chat-log">
      <div v-for="(msg, index) in historial" :key="index" :class="msg.tipo">
        <strong>{{ msg.tipo === 'user' ? 'Tú' : 'IA' }}:</strong> {{ msg.texto }}
      </div>
    </div>

    <form @submit.prevent="enviarPregunta" class="formulario">
      <input
        type="text"
        v-model="pregunta"
        placeholder="Escribe tu pregunta..."
        required
      />
      <button type="submit" :disabled="cargando">
        {{ cargando ? 'Pensando...' : 'Enviar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const pregunta = ref('')
const historial = ref([])
const cargando = ref(false)

const enviarPregunta = async () => {
  const texto = pregunta.value.trim()
  if (!texto) return

  historial.value.push({ tipo: 'user', texto })
  pregunta.value = ''
  cargando.value = true

  try {
    const res = await axios.post('http://localhost:3001/api/ia', {
      pregunta: texto
    })
    historial.value.push({ tipo: 'ia', texto: res.data.respuesta })
  } catch (err) {
    historial.value.push({ tipo: 'ia', texto: 'Error al contactar con la IA.' })
    console.error(err)
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.chat-ia {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.chat-log {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  height: 300px;
  overflow-y: auto;
  background: #fafafa;
}

.user {
  text-align: right;
  margin-bottom: 0.5rem;
  color: #333;
}

.ia {
  text-align: left;
  margin-bottom: 0.5rem;
  color: #007bff;
}

.formulario {
  display: flex;
  gap: 0.5rem;
}

input[type="text"] {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

button:disabled {
  background: #aaa;
}
</style>
