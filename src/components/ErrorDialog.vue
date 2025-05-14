<template>
  <div class="error-dialog-overlay" v-if="show">
    <div class="error-dialog">
      <div class="error-header">
        <v-icon color="error" size="large">mdi-alert-circle</v-icon>
        <h2>{{ title }}</h2>
        <v-spacer></v-spacer>
        <v-btn icon @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="error-content">
        <p class="error-message">{{ message }}</p>
        
        <div v-if="showDetails" class="error-details">
          <div class="details-header">
            <h3>Detalles técnicos</h3>
            <v-btn 
              variant="text" 
              size="small" 
              color="primary"
              @click="copyDetails"
            >
              Copiar detalles
            </v-btn>
          </div>
          <pre class="details-code">{{ details }}</pre>
        </div>
        
        <div class="error-actions">
          <v-btn 
            color="grey-lighten-2" 
            variant="outlined" 
            @click="toggleDetails"
          >
            {{ showDetails ? 'Ocultar detalles' : 'Mostrar detalles' }}
          </v-btn>
          <v-btn 
            color="primary" 
            @click="close"
          >
            Cerrar
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ErrorDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Error'
    },
    message: {
      type: String,
      default: 'Ha ocurrido un error'
    },
    details: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const showDetails = ref(false);
    
    const toggleDetails = () => {
      showDetails.value = !showDetails.value;
    };
    
    const close = () => {
      emit('close');
    };
    
    const copyDetails = () => {
      if (props.details) {
        navigator.clipboard.writeText(props.details)
          .then(() => {
            alert('Detalles copiados al portapapeles');
          })
          .catch(err => {
            console.error('Error al copiar el texto: ', err);
          });
      }
    };
    
    return {
      showDetails,
      toggleDetails,
      close,
      copyDetails
    };
  }
});
</script>

<style scoped>
.error-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.error-dialog {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.error-header {
  padding: 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
}

.error-header h2 {
  margin: 0 0 0 12px;
  font-size: 1.2rem;
}

.error-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.error-message {
  margin-bottom: 16px;
  font-size: 1rem;
}

.error-details {
  background-color: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 16px;
  overflow: hidden;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #e0e0e0;
}

.details-header h3 {
  margin: 0;
  font-size: 0.9rem;
}

.details-code {
  padding: 16px;
  overflow-x: auto;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 0.9rem;
  margin: 0;
  background-color: #f5f5f5;
  color: #333;
}

.error-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 16px;
}
</style>