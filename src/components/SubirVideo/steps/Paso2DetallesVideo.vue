<script setup lang="ts">
// Imports esenciales
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import CourseSubjectSelector from './SelectorCursoAsignatura.vue';

// Props y emits básicos
const props = defineProps({
  videoDetails: {
    type: Object,
    default: () => ({
      title: '',
      description: '',
      thumbnail: null,
      courseId: null,
      subjectId: null
    })
  }
});

const emit = defineEmits(['details-updated']);

// Variables principales
const thumbnailPreview = ref<string | null>(null);
const isDragging = ref(false);
const details = ref({
  title: props.videoDetails.title || '',
  description: props.videoDetails.description || '',
  thumbnail: props.videoDetails.thumbnail || null,
  courseId: props.videoDetails.courseId || null,
  subjectId: props.videoDetails.subjectId || null
});

// Métodos simplificados
const handleThumbnailInput = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file?.type.startsWith('image/')) updateThumbnail(file);
  else if (file) alert('Por favor, selecciona una imagen válida.');
};

const handleThumbnailDrop = (event: DragEvent) => {
  isDragging.value = false;
  const file = event.dataTransfer?.files[0];
  if (file?.type.startsWith('image/')) updateThumbnail(file);
  else if (file) alert('Por favor, arrastra una imagen válida.');
};

const updateThumbnail = (file: File) => {
  details.value.thumbnail = file;
  if (thumbnailPreview.value) URL.revokeObjectURL(thumbnailPreview.value);
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

const handleCourseSubjectSelection = (selection: {courseId: number | null, subjectId: number | null}) => {
  details.value.courseId = selection.courseId;
  details.value.subjectId = selection.subjectId;
  emitUpdate();
};

const emitUpdate = () => {
  emit('details-updated', { ...details.value });
};

// Watchers y lifecycle hooks
watch(() => props.videoDetails, (newDetails) => {
  details.value = { 
    ...newDetails,
    title: newDetails.title || '',
    description: newDetails.description || '',
    courseId: newDetails.courseId || null,
    subjectId: newDetails.subjectId || null,
    thumbnail: newDetails.thumbnail || null
  };
  
  if (newDetails.thumbnail && !thumbnailPreview.value) {
    if (thumbnailPreview.value) URL.revokeObjectURL(thumbnailPreview.value);
    thumbnailPreview.value = URL.createObjectURL(newDetails.thumbnail);
  }
}, { deep: true });

onMounted(() => {
  if (details.value.thumbnail) {
    thumbnailPreview.value = URL.createObjectURL(details.value.thumbnail);
  }
});

onBeforeUnmount(() => {
  if (thumbnailPreview.value) URL.revokeObjectURL(thumbnailPreview.value);
});
</script>

<template>
  <v-sheet class="pa-4 rounded">
    <h2 class="text-h5 mb-2">Detalles del video</h2>
    <p class="text-subtitle-1 mb-4">Añade información sobre tu video</p>

    <v-row>
      <!-- Columna izquierda: Miniatura -->
      <v-col cols="12" md="5">
        <v-card class="mb-4">
          <v-card-title class="text-h6">Vista previa</v-card-title>
          <v-card-text>
            <v-img
              v-if="thumbnailPreview"
              :src="thumbnailPreview"
              cover
              height="180"
              class="rounded"
            ></v-img>
            
            <v-sheet
              v-else
              color="grey-lighten-3"
              height="180"
              class="d-flex flex-column align-center justify-center rounded"
            >
              <v-icon icon="mdi-image-off" size="large" class="mb-2"></v-icon>
              <span>No hay miniatura seleccionada</span>
            </v-sheet>
          </v-card-text>

          <!-- Área para subir miniatura -->
          <v-card-text class="pt-0">
            <v-sheet
              rounded
              class="thumbnail-drop-area pa-3 d-flex align-center justify-center"
              height="70"
              :elevation="isDragging ? 2 : 0"
              :color="details.thumbnail ? 'grey-lighten-5' : 'grey-lighten-4'"
              style="border: 2px dashed #ccc; cursor: pointer;"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleThumbnailDrop"
              @click="$event => document.getElementById('thumbnailInput')?.click()"
            >
              <input 
                type="file" 
                id="thumbnailInput" 
                style="display: none;" 
                accept="image/*" 
                @change="handleThumbnailInput"
              >
              
              <div v-if="!details.thumbnail" class="text-center">
                <v-icon icon="mdi-image-plus" class="me-2"></v-icon>
                <span>Subir miniatura</span>
              </div>
              
              <div v-else class="text-center d-flex align-center">
                <v-icon icon="mdi-check-circle" color="success" class="me-2"></v-icon>
                <span>Miniatura seleccionada</span>
                <v-btn icon="mdi-close" size="small" color="error" variant="text" class="ms-2"
                  @click.stop="removeThumbnail"></v-btn>
              </div>
            </v-sheet>
            
            <div class="text-caption mt-2 text-center">
              JPG, PNG o GIF (máx. 2MB)
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      
      <!-- Columna derecha: Formulario -->
      <v-col cols="12" md="7">
        <v-card class="mb-4">
          <v-card-text>
            <v-form @submit.prevent>
              <v-text-field
                v-model="details.title"
                label="Título"
                variant="outlined"
                placeholder="Añade un título descriptivo"
                :counter="100"
                :rules="[v => !!v || 'El título es obligatorio']"
                required
                @input="emitUpdate"
                class="mb-4"
              ></v-text-field>
              
              <v-textarea
                v-model="details.description"
                label="Descripción"
                variant="outlined"
                placeholder="Describe tu video"
                :counter="1000"
                rows="4"
                auto-grow
                @input="emitUpdate"
              ></v-textarea>
            </v-form>
          </v-card-text>
        </v-card>
        
        <!-- Selector de Curso y Asignatura -->
        <CourseSubjectSelector 
          :initialCourseId="details.courseId"
          :initialSubjectId="details.subjectId"
          @selection-changed="handleCourseSubjectSelection"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<style scoped>
.thumbnail-drop-area {
  transition: all 0.2s ease;
}

.thumbnail-drop-area:hover {
  border-color: #FF9800;
  background-color: rgba(255, 152, 0, 0.05) !important;
}

/* Estilo para los campos de formulario cuando tienen foco */
:deep(.v-field--focused .v-field__outline) {
  border-color: #FF9800 !important;
}
</style>