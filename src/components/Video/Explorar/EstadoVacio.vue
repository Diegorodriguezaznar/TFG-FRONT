<!-- src/components/Explorar/EstadoVacio.vue -->
<script setup lang="ts">
const props = defineProps<{
  tieneBusqueda: boolean;
}>();

const emit = defineEmits<{
  'limpiar-filtros': [];
}>();

const limpiarFiltros = () => {
  emit('limpiar-filtros');
};
</script>

<template>
  <div class="EstadoVacio">
    <v-card class="EstadoVacio__Card" elevation="2">
      <v-card-text class="EstadoVacio__Content">
        <div class="text-center py-12">
          <!-- Icono animado con logo chuli -->
          <div class="EstadoVacio__IconContainer mb-6">
            <div class="EstadoVacio__VideoLogo">
              <div class="EstadoVacio__VideoIcon">
                <v-icon color="white" size="40">mdi-video-off</v-icon>
              </div>
            </div>
            <div class="EstadoVacio__IconBackground"></div>
          </div>
          
          <!-- Título dinámico -->
          <h3 class="EstadoVacio__Title mb-4">
            {{ tieneBusqueda ? 'No se encontraron videos' : 'No hay videos disponibles' }}
          </h3>
          
          <!-- Descripción dinámica -->
          <p class="EstadoVacio__Description mb-6">
            <template v-if="tieneBusqueda">
              Prueba con otros términos de búsqueda o ajusta los filtros para encontrar más contenido
            </template>
            <template v-else>
              Parece que no hay videos que coincidan con los filtros seleccionados
            </template>
          </p>
          
          <!-- Sugerencias -->
          <div class="EstadoVacio__Suggestions mb-6">
            <h4 class="EstadoVacio__SuggestionsTitle mb-3">Sugerencias:</h4>
            <div class="EstadoVacio__SuggestionsList">
              <v-chip 
                color="red" 
                variant="outlined" 
                size="small"
                class="ma-1"
              >
                <v-icon start size="small">mdi-magnify</v-icon>
                Usar términos más generales
              </v-chip>
              <v-chip 
                color="red" 
                variant="outlined" 
                size="small"
                class="ma-1"
              >
                <v-icon start size="small">mdi-filter-off</v-icon>
                Reducir filtros
              </v-chip>
              <v-chip 
                color="red" 
                variant="outlined" 
                size="small"
                class="ma-1"
              >
                <v-icon start size="small">mdi-refresh</v-icon>
                Intentar más tarde
              </v-chip>
            </div>
          </div>
          
          <!-- Botones de acción -->
          <div class="EstadoVacio__Actions">
            <v-btn 
              @click="limpiarFiltros"
              color="red"
              variant="elevated"
              size="large"
              prepend-icon="mdi-refresh"
              class="mb-3"
            >
              Mostrar Todos los Videos
            </v-btn>
            
            <div class="EstadoVacio__SecondaryActions">
              <v-btn 
                to="/cursos"
                color="red"
                variant="outlined"
                prepend-icon="mdi-book-education"
                class="mr-2"
              >
                Explorar Cursos
              </v-btn>
              
              <v-btn 
                to="/usuarios"
                color="red"
                variant="outlined"
                prepend-icon="mdi-account-group"
              >
                Ver Profesores
              </v-btn>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.EstadoVacio {
  padding: 40px 0;
}

.EstadoVacio__Card {
  border-radius: 16px;
  border: 2px dashed rgba(244, 67, 54, 0.3);
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.02) 0%, #ffffff 100%);
}

.EstadoVacio__Content {
  padding: 40px 32px;
}

.EstadoVacio__IconContainer {
  position: relative;
  display: inline-block;
}

/* Logo chuli de videos para estado vacío */
.EstadoVacio__VideoLogo {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #F44336 0%, #FF5722 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(244, 67, 54, 0.3);
  position: relative;
  z-index: 2;
  animation: bounce 2s infinite;
}

.EstadoVacio__VideoLogo::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: rotate(45deg);
  animation: shine 3s infinite;
}

.EstadoVacio__VideoIcon {
  position: relative;
  z-index: 3;
}

.EstadoVacio__Icon {
  position: relative;
  z-index: 2;
  animation: bounce 2s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
  100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
}

.EstadoVacio__IconBackground {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120px;
  height: 120px;
  background: rgba(244, 67, 54, 0.1);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.EstadoVacio__Title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #333;
}

.EstadoVacio__Description {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.5;
  max-width: 500px;
  margin: 0 auto;
}

.EstadoVacio__SuggestionsTitle {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.EstadoVacio__SuggestionsList {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.EstadoVacio__Actions {
  max-width: 400px;
  margin: 0 auto;
}

.EstadoVacio__SecondaryActions {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

/* Animaciones */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .EstadoVacio__Content {
    padding: 32px 24px;
  }
  
  .EstadoVacio__Title {
    font-size: 1.5rem;
  }
  
  .EstadoVacio__Description {
    font-size: 1rem;
  }
  
  .EstadoVacio__SecondaryActions {
    flex-direction: column;
  }
  
  .EstadoVacio__SecondaryActions .v-btn {
    width: 100%;
    margin: 4px 0;
  }
}

@media (max-width: 600px) {
  .EstadoVacio__Content {
    padding: 24px 16px;
  }
  
  .EstadoVacio__SuggestionsList {
    flex-direction: column;
    align-items: center;
  }
  
  .EstadoVacio__SuggestionsList .v-chip {
    width: 200px;
    justify-content: center;
  }
}
</style>