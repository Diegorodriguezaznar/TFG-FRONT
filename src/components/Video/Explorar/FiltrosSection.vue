<!-- src/components/Explorar/FiltrosSection.vue - Versión Mejorada y Más Bonita -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  asignaturas: Array<{ idAsignatura: string | number; nombre: string }>;
  filtros: {
    asignatura: string;
    duracion: string;
    fechaPublicacion: string;
    ordenarPor: string;
    soloFavoritos: boolean;
  };
}>();

const emit = defineEmits<{
  'actualizar-filtro': [campo: string, valor: any];
}>();

const mostrarFiltrosAvanzados = ref(false);

// Opciones de filtros
const opcionesDuracion = [
  { value: 'Todas', text: 'Todas las duraciones', icon: 'mdi-clock', color: '#FF5722' },
  { value: 'Corto', text: 'Cortos (< 5 min)', icon: 'mdi-clock-fast', color: '#4CAF50' },
  { value: 'Medio', text: 'Medios (5-15 min)', icon: 'mdi-clock', color: '#FF9800' },
  { value: 'Largo', text: 'Largos (> 15 min)', icon: 'mdi-clock-outline', color: '#F44336' }
];

const opcionesFecha = [
  { value: 'Todas', text: 'Todas las fechas', icon: 'mdi-calendar', color: '#9C27B0' },
  { value: 'Hoy', text: 'Hoy', icon: 'mdi-calendar-today', color: '#4CAF50' },
  { value: 'Semana', text: 'Esta semana', icon: 'mdi-calendar-week', color: '#2196F3' },
  { value: 'Mes', text: 'Este mes', icon: 'mdi-calendar-month', color: '#FF9800' },
  { value: 'Año', text: 'Este año', icon: 'mdi-calendar-range', color: '#F44336' }
];

const opcionesOrden = [
  { value: 'Más Recientes', text: 'Más recientes', icon: 'mdi-clock-outline', color: '#4CAF50' },
  { value: 'Más Antiguos', text: 'Más antiguos', icon: 'mdi-history', color: '#9E9E9E' },
  { value: 'Más Likes', text: 'Más likes', icon: 'mdi-heart', color: '#E91E63' },
  { value: 'Menos Likes', text: 'Menos likes', icon: 'mdi-heart-outline', color: '#9E9E9E' },
  { value: 'Duración Ascendente', text: 'Duración ↑', icon: 'mdi-sort-ascending', color: '#2196F3' },
  { value: 'Duración Descendente', text: 'Duración ↓', icon: 'mdi-sort-descending', color: '#FF5722' },
  { value: 'Alfabético', text: 'A-Z', icon: 'mdi-sort-alphabetical-ascending', color: '#673AB7' },
  { value: 'Alfabético Inverso', text: 'Z-A', icon: 'mdi-sort-alphabetical-descending', color: '#3F51B5' }
];

// Asignaturas formateadas
const asignaturasFormateadas = computed(() => {
  const opciones = [{ idAsignatura: 'Todos', nombre: 'Todas las asignaturas', icon: 'mdi-book-open-variant', color: '#FF5722' }];
  
  if (props.asignaturas?.length > 0) {
    props.asignaturas.forEach((asignatura, index) => {
      const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'];
      opciones.push({
        idAsignatura: asignatura.idAsignatura,
        nombre: asignatura.nombre,
        icon: 'mdi-book',
        color: colors[index % colors.length]
      });
    });
  }
  
  return opciones;
});

// Contar filtros activos
const filtrosActivos = computed(() => {
  let count = 0;
  if (props.filtros.asignatura !== 'Todos') count++;
  if (props.filtros.duracion !== 'Todas') count++;
  if (props.filtros.fechaPublicacion !== 'Todas') count++;
  if (props.filtros.ordenarPor !== 'Más Recientes') count++;
  if (props.filtros.soloFavoritos) count++;
  return count;
});

// Métodos
const actualizarFiltro = (campo: string, valor: any) => {
  emit('actualizar-filtro', campo, valor);
};

const toggleFiltrosAvanzados = () => {
  mostrarFiltrosAvanzados.value = !mostrarFiltrosAvanzados.value;
};

const limpiarTodosFiltros = () => {
  emit('actualizar-filtro', 'reset', true);
};

// Obtener información de filtro seleccionado
const getFilterInfo = (opciones: any[], valor: string) => {
  return opciones.find(op => op.value === valor) || opciones[0];
};
</script>

<template>
  <div class="FiltrosSection">
    <!-- Header mejorado -->
    <div class="FiltrosSection__Header">
      <div class="d-flex align-center justify-space-between w-100">
        <div class="d-flex align-center">
          <div class="FiltrosSection__HeaderIcon">
            <v-icon color="white" size="20">mdi-tune</v-icon>
          </div>
          <div class="FiltrosSection__HeaderText">
            <h3 class="FiltrosSection__Title">Filtros de Búsqueda</h3>
            <p class="FiltrosSection__Subtitle">Personaliza tu exploración</p>
          </div>
          <v-chip 
            v-if="filtrosActivos > 0"
            color="red"
            size="small"
            variant="elevated"
            class="ml-3 FiltrosSection__Counter"
          >
            <v-icon start size="small">mdi-filter</v-icon>
            {{ filtrosActivos }}
          </v-chip>
        </div>
        
        <v-btn
          @click="toggleFiltrosAvanzados"
          :color="mostrarFiltrosAvanzados ? 'red' : 'grey-darken-1'"
          :variant="mostrarFiltrosAvanzados ? 'elevated' : 'outlined'"
          rounded="xl"
        >
          <v-icon start>
            {{ mostrarFiltrosAvanzados ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
          </v-icon>
          {{ mostrarFiltrosAvanzados ? 'Ocultar' : 'Mostrar' }} Filtros
        </v-btn>
      </div>
    </div>
    
    <!-- Filtros básicos (siempre visibles) -->
    <div class="FiltrosSection__Basic">
      <v-row>
        <!-- Asignatura con estilo mejorado -->
        <v-col cols="12" sm="6" md="4">
          <div class="FiltrosSection__FilterGroup">
            <label class="FiltrosSection__Label">
              <v-icon size="small" color="red">mdi-book</v-icon>
              Asignatura
            </label>
            <v-select
              :model-value="filtros.asignatura"
              @update:model-value="actualizarFiltro('asignatura', $event)"
              :items="asignaturasFormateadas"
              item-title="nombre"
              item-value="idAsignatura"
              variant="outlined"
              density="comfortable"
              color="red"
              bg-color="white"
              rounded="lg"
              hide-details
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="item.raw.color" size="small" class="mr-2">{{ item.raw.icon }}</v-icon>
                  <span class="text-truncate">{{ item.title }}</span>
                </div>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="item.raw.color" size="small">{{ item.raw.icon }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </v-col>
        
        <!-- Ordenar por con estilo mejorado -->
        <v-col cols="12" sm="6" md="4">
          <div class="FiltrosSection__FilterGroup">
            <label class="FiltrosSection__Label">
              <v-icon size="small" color="red">mdi-sort</v-icon>
              Ordenar por
            </label>
            <v-select
              :model-value="filtros.ordenarPor"
              @update:model-value="actualizarFiltro('ordenarPor', $event)"
              :items="opcionesOrden"
              item-title="text"
              item-value="value"
              variant="outlined"
              density="comfortable"
              color="red"
              bg-color="white"
              rounded="lg"
              hide-details
            >
              <template v-slot:selection="{ item }">
                <div class="d-flex align-center">
                  <v-icon :color="item.raw.color" size="small" class="mr-2">{{ item.raw.icon }}</v-icon>
                  <span class="text-truncate">{{ item.title }}</span>
                </div>
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :color="item.raw.color" size="small">{{ item.raw.icon }}</v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>
          </div>
        </v-col>
        
        <!-- Botón mostrar más filtros -->
        <v-col cols="12" md="4" class="d-flex align-center">
          <v-btn
            @click="toggleFiltrosAvanzados"
            :color="mostrarFiltrosAvanzados ? 'red' : 'grey-darken-1'"
            :variant="mostrarFiltrosAvanzados ? 'elevated' : 'outlined'"
            block
            size="large"
            rounded="xl"
            class="FiltrosSection__ToggleBtn"
          >
            <v-icon start>mdi-tune</v-icon>
            {{ mostrarFiltrosAvanzados ? 'Ocultar' : 'Más' }} Filtros
            <v-badge 
              v-if="filtrosActivos > 2"
              :content="filtrosActivos - 2"
              color="red"
              class="ml-2"
            ></v-badge>
          </v-btn>
        </v-col>
      </v-row>
    </div>
    
    <!-- Filtros avanzados -->
    <v-expand-transition>
      <div v-show="mostrarFiltrosAvanzados" class="FiltrosSection__Advanced">
        <div class="FiltrosSection__Divider">
          <v-icon color="red" size="small">mdi-chevron-down</v-icon>
        </div>
        
        <v-row>
          <!-- Duración -->
          <v-col cols="12" sm="6" md="4">
            <div class="FiltrosSection__FilterGroup">
              <label class="FiltrosSection__Label">
                <v-icon size="small" color="red">mdi-clock</v-icon>
                Duración
              </label>
              <v-select
                :model-value="filtros.duracion"
                @update:model-value="actualizarFiltro('duracion', $event)"
                :items="opcionesDuracion"
                item-title="text"
                item-value="value"
                variant="outlined"
                density="comfortable" 
                color="red"
                bg-color="white"
                rounded="lg"
                hide-details
              >
                <template v-slot:selection="{ item }">
                  <div class="d-flex align-center">
                    <v-icon :color="item.raw.color" size="small" class="mr-2">{{ item.raw.icon }}</v-icon>
                    <span class="text-truncate">{{ item.title }}</span>
                  </div>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :color="item.raw.color" size="small">{{ item.raw.icon }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </v-col>
          
          <!-- Fecha de publicación -->
          <v-col cols="12" sm="6" md="4">
            <div class="FiltrosSection__FilterGroup">
              <label class="FiltrosSection__Label">
                <v-icon size="small" color="red">mdi-calendar</v-icon>
                Fecha de publicación
              </label>
              <v-select
                :model-value="filtros.fechaPublicacion"
                @update:model-value="actualizarFiltro('fechaPublicacion', $event)"
                :items="opcionesFecha"
                item-title="text"
                item-value="value"
                variant="outlined"
                density="comfortable"
                color="red"
                bg-color="white"
                rounded="lg"
                hide-details
              >
                <template v-slot:selection="{ item }">
                  <div class="d-flex align-center">
                    <v-icon :color="item.raw.color" size="small" class="mr-2">{{ item.raw.icon }}</v-icon>
                    <span class="text-truncate">{{ item.title }}</span>
                  </div>
                </template>
                <template v-slot:item="{ props, item }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon :color="item.raw.color" size="small">{{ item.raw.icon }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </div>
          </v-col>
          
          <!-- Switch para favoritos mejorado -->
          <v-col cols="12" sm="12" md="4">
            <div class="FiltrosSection__FilterGroup">
              <label class="FiltrosSection__Label">
                <v-icon size="small" color="red">mdi-heart</v-icon>
                Preferencias
              </label>
              <div class="FiltrosSection__SwitchCard">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <div class="FiltrosSection__SwitchIcon">
                      <v-icon color="red" size="20">mdi-heart</v-icon>
                    </div>
                    <div>
                      <div class="FiltrosSection__SwitchTitle">Solo Favoritos</div>
                      <div class="FiltrosSection__SwitchDesc">Videos más populares</div>
                    </div>
                  </div>
                  <v-switch
                    :model-value="filtros.soloFavoritos"
                    @update:model-value="actualizarFiltro('soloFavoritos', $event)"
                    color="red"
                    density="comfortable"
                    hide-details
                  ></v-switch>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        
        <!-- Información de filtros aplicados -->
        <div v-if="filtrosActivos > 0" class="FiltrosSection__ActiveFilters">
          <div class="FiltrosSection__ActiveCard">
            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon color="red" class="mr-2">mdi-information</v-icon>
                <span class="FiltrosSection__ActiveText">
                  <strong>{{ filtrosActivos }}</strong> filtro{{ filtrosActivos !== 1 ? 's' : '' }} aplicado{{ filtrosActivos !== 1 ? 's' : '' }}
                </span>
              </div>
              <v-btn
                @click="limpiarTodosFiltros"
                color="red"
                variant="text"
                size="small"
                rounded="lg"
              >
                <v-icon start size="small">mdi-refresh</v-icon>
                Limpiar Todo
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.FiltrosSection {
  border-radius: 20px;
  background: white;
  box-shadow: 0 8px 32px rgba(244, 67, 54, 0.08);
  border: 1px solid rgba(244, 67, 54, 0.1);
  overflow: hidden;
}

.FiltrosSection__Header {
  background: linear-gradient(135deg, #F44336 0%, #FF5722 100%);
  padding: 24px;
  color: white;
  position: relative;
}

.FiltrosSection__Header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1.5" fill="rgba(255,255,255,0.1)"/></svg>');
  opacity: 0.6;
}

.FiltrosSection__HeaderIcon {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  backdrop-filter: blur(10px);
}

.FiltrosSection__HeaderText {
  position: relative;
  z-index: 2;
}

.FiltrosSection__Title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: white;
}

.FiltrosSection__Subtitle {
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.9;
}

.FiltrosSection__Counter {
  position: relative;
  z-index: 2;
  animation: pulse 2s infinite;
}

.FiltrosSection__Basic {
  padding: 24px;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.02) 0%, #ffffff 100%);
}

.FiltrosSection__FilterGroup {
  height: 100%;
}

.FiltrosSection__Label {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  gap: 6px;
}

.FiltrosSection__ToggleBtn {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%);
  border: 2px solid rgba(244, 67, 54, 0.2);
  transition: all 0.3s ease;
}

.FiltrosSection__ToggleBtn:hover {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.15) 0%, rgba(255, 87, 34, 0.15) 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.2);
}

.FiltrosSection__Advanced {
  padding: 0 24px 24px;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.01) 0%, #ffffff 100%);
}

.FiltrosSection__Divider {
  text-align: center;
  margin: 16px 0 24px;
  position: relative;
}

.FiltrosSection__Divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(244, 67, 54, 0.3) 50%, transparent 100%);
}

.FiltrosSection__SwitchCard {
  background: white;
  border: 2px solid rgba(244, 67, 54, 0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
}

.FiltrosSection__SwitchCard:hover {
  border-color: rgba(244, 67, 54, 0.3);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.1);
}

.FiltrosSection__SwitchIcon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(255, 87, 34, 0.1) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.FiltrosSection__SwitchTitle {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.FiltrosSection__SwitchDesc {
  font-size: 0.8rem;
  color: #666;
}

.FiltrosSection__ActiveFilters {
  margin-top: 20px;
  animation: slideInDown 0.3s ease-out;
}

.FiltrosSection__ActiveCard {
  background: linear-gradient(135deg, rgba(244, 67, 54, 0.05) 0%, rgba(255, 87, 34, 0.05) 100%);
  border: 1px solid rgba(244, 67, 54, 0.2);
  border-radius: 12px;
  padding: 16px;
}

.FiltrosSection__ActiveText {
  color: #333;
  font-size: 0.9rem;
}

/* Animaciones */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Focus states mejorados */
:deep(.v-field--focused .v-field__outline) {
  border-color: #F44336 !important;
  border-width: 2px !important;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
}

:deep(.v-field--focused .v-field__prepend-inner .v-icon) {
  color: #F44336 !important;
}

:deep(.v-select .v-field) {
  transition: all 0.3s ease;
}

:deep(.v-select .v-field:hover) {
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.1);
}

/* Responsive mejorado */
@media (max-width: 768px) {
  .FiltrosSection__Header {
    padding: 20px;
  }
  
  .FiltrosSection__Basic,
  .FiltrosSection__Advanced {
    padding: 20px;
  }
  
  .FiltrosSection__Title {
    font-size: 1.1rem;
  }
  
  .FiltrosSection__HeaderIcon {
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
}

@media (max-width: 600px) {
  .FiltrosSection__Header {
    padding: 16px;
  }
  
  .FiltrosSection__Basic,
  .FiltrosSection__Advanced {
    padding: 16px;
  }
  
  .FiltrosSection__Title {
    font-size: 1rem;
  }
  
  .FiltrosSection__Subtitle {
    font-size: 0.8rem;
  }
  
  .FiltrosSection__SwitchCard {
    padding: 12px;
  }
  
  .FiltrosSection__HeaderIcon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
}
</style>