<!-- VideoDetailsStep.vue - Paso 2 optimizado -->
<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAsignaturaStore } from '@/stores/Asignaturas';

const props = defineProps({
  videoDetails: { type: Object, default: () => ({}) },
  idCurso: { type: [String, Number], default: null } // Cambiar a idCurso
});

const emit = defineEmits(['details-updated']);

const asignaturaStore = useAsignaturaStore();

const thumbnailPreview = ref<string | null>(null);
const isDragging = ref(false);
const asignaturas = ref([]);
const loading = ref(false);

const details = ref({
  title: props.videoDetails.title || '',
  description: props.videoDetails.description || '',
  thumbnail: props.videoDetails.thumbnail || null,
  subjectId: props.videoDetails.subjectId || null
});

// Cargar asignaturas del curso actual
const loadSubjects = async () => {
  console.log('Loading subjects for idCurso:', props.idCurso); // Debug
  
  if (!props.idCurso) {
    console.warn('No hay idCurso disponible para cargar asignaturas');
    return;
  }
  
  try {
    loading.value = true;
    await asignaturaStore.fetchAsignaturasByCurso(Number(props.idCurso));
    asignaturas.value = asignaturaStore.asignaturas || [];
    
    console.log('Asignaturas cargadas:', asignaturas.value); // Debug
  } catch (error) {
    console.error('Error cargando asignaturas:', error);
    asignaturas.value = [];
  } finally {
    loading.value = false;
  }
};

// Watch para cargar asignaturas cuando cambie idCurso
watch(() => props.idCurso, (newIdCurso) => {
  if (newIdCurso) {
    loadSubjects();
  } else {
    asignaturas.value = [];
  }
}, { immediate: true });

// Manejo de miniatura
const handleThumbnailInput = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file?.type.startsWith('image/')) {
    updateThumbnail(file);
  } else if (file) {
    alert('Por favor, selecciona una imagen válida.');
  }
};

const handleThumbnailDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file?.type.startsWith('image/')) {
    updateThumbnail(file);
  } else if (file) {
    alert('Por favor, arrastra una imagen válida.');
  }
};

const updateThumbnail = (file: File) => {
  details.value.thumbnail = file;
  if (thumbnailPreview.value) {
    URL.revokeObjectURL(thumbnailPreview.value);
  }
  thumbnailPreview.value = URL.createObjectURL(file);
  emitUpdate();
};

const removeThumbnail = (event: Event) => {
  event.stopPropagation();
  details.value.thumbnail = null;
  if (thumbnailPreview.value) {
    URL.revokeObjectURL(thumbnailPreview.value);
    thumbnailPreview.value = null;
  }
  emitUpdate();
};

const emitUpdate = () => {
  emit('details-updated', { 
    ...details.value,
    courseId: props.currentCourseId 
  });
};

// Watchers
watch(() => details.value.title, emitUpdate);
watch(() => details.value.description, emitUpdate);
watch(() => details.value.subjectId, emitUpdate);

onMounted(() => {
  loadSubjects();
  if (details.value.thumbnail) {
    thumbnailPreview.value = URL.createObjectURL(details.value.thumbnail);
  }
});

onBeforeUnmount(() => {
  if (thumbnailPreview.value) {
    URL.revokeObjectURL(thumbnailPreview.value);
  }
});
</script>

<template>
  <div>
    <h2 class="text-h5 mb-2">Detalles del video</h2>
    <p class="text-subtitle-1 mb-4">Añade información sobre tu video</p>

    <v-row>
      <!-- Columna izquierda: Miniatura -->
      <v-col cols="12" md="5">
        <v-card class="mb-4">
          <v-card-title>Vista previa</v-card-title>
          <v-card-text>
            <!-- Preview de miniatura -->
            <v-img
              v-if="thumbnailPreview"
              :src="thumbnailPreview"
              height="180"
              cover
              class="rounded mb-3"
            />
            
            <div 
              v-else
              class="preview-placeholder"
            >
              <v-icon size="large" class="mb-2">mdi-image-off</v-icon>
              <span>Sin miniatura</span>
            </div>

            <!-- Área de subida de miniatura -->
            <div
              class="thumbnail-upload"
              :class="{ 'thumbnail-upload--dragging': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleThumbnailDrop"
              @click="$refs.thumbnailInput?.click()"
            >
              <input 
                ref="thumbnailInput"
                type="file" 
                style="display: none" 
                accept="image/*" 
                @change="handleThumbnailInput"
              >
              
              <div v-if="!details.thumbnail" class="text-center">
                <v-icon class="me-2">mdi-image-plus</v-icon>
                <span>Subir miniatura</span>
              </div>
              
              <div v-else class="d-flex align-center justify-center">
                <v-icon color="success" class="me-2">mdi-check-circle</v-icon>
                <span>Miniatura seleccionada</span>
                <v-btn 
                  icon="mdi-close" 
                  size="small" 
                  color="error" 
                  variant="text" 
                  class="ms-2"
                  @click.stop="removeThumbnail"
                />
              </div>
            </div>
            
            <p class="text-caption mt-2 text-center text-grey">
              JPG, PNG o GIF (máx. 2MB)
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Columna derecha: Formulario -->
      <v-col cols="12" md="7">
        <v-card>
          <v-card-text>
            <!-- Título -->
            <v-text-field
              v-model="details.title"
              label="Título *"
              variant="outlined"
              placeholder="Título descriptivo del video"
              :counter="100"
              maxlength="100"
              required
              class="mb-4"
            />
            
            <!-- Descripción -->
            <v-textarea
              v-model="details.description"
              label="Descripción"
              variant="outlined"
              placeholder="Describe tu video (opcional)"
              :counter="500"
              maxlength="500"
              rows="4"
              auto-grow
              class="mb-4"
            />
            
            <!-- Selector de asignatura -->
            <v-select
              v-model="details.subjectId"
              :items="asignaturas"
              item-title="nombre"
              item-value="idAsignatura"
              label="Asignatura"
              variant="outlined"
              placeholder="Selecciona una asignatura (opcional)"
              :loading="loading"
              clearable
              prepend-inner-icon="mdi-clipboard-text"
            >
              <template v-slot:no-data>
                <div class="pa-2 text-center">
                  {{ loading ? 'Cargando asignaturas...' : 'No hay asignaturas disponibles para este curso' }}
                </div>
              </template>
            </v-select>
            
            <!-- Debug info (remover en producción) -->
            <div class="text-caption text-grey mt-2">
              Debug: idCurso = {{ idCurso }}, Asignaturas encontradas: {{ asignaturas.length }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 180px;
  background-color: #f5f5f5;
  border-radius: 8px;
  color: #666;
  margin-bottom: 16px;
}

.thumbnail-upload {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.thumbnail-upload:hover,
.thumbnail-upload--dragging {
  border-color: #FF9800;
  background-color: rgba(255, 152, 0, 0.05);
}
</style>