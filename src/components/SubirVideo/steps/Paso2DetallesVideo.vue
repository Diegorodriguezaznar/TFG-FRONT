<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAsignaturaStore } from '@/stores/Asignaturas';

const props = defineProps({
  videoDetails: { type: Object, default: () => ({}) },
  idCurso: { type: [String, Number], default: null }
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

const loadSubjects = async () => {
  if (!props.idCurso) {
    return;
  }
  
  try {
    loading.value = true;
    await asignaturaStore.fetchAsignaturasByCurso(Number(props.idCurso));
    asignaturas.value = asignaturaStore.asignaturas || [];
  } catch (error) {
    asignaturas.value = [];
  } finally {
    loading.value = false;
  }
};

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
    courseId: props.idCurso 
  });
};

watch(() => details.value.title, emitUpdate);
watch(() => details.value.description, emitUpdate);
watch(() => details.value.subjectId, emitUpdate);

watch(() => props.idCurso, (newIdCurso) => {
  if (newIdCurso) {
    loadSubjects();
  } else {
    asignaturas.value = [];
  }
}, { immediate: true });

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
  <div class="VideoDetailsStep">
    <div class="VideoDetailsStep__header">
      <h2 class="VideoDetailsStep__titulo">Detalles del video</h2>
      <p class="VideoDetailsStep__subtitulo">Añade información sobre tu video</p>
    </div>

    <div class="VideoDetailsStep__contenido">
      <div class="VideoDetailsStep__miniatura">
        <v-card class="VideoDetailsStep__card-miniatura">
          <v-card-title class="VideoDetailsStep__card-titulo">Vista previa</v-card-title>
          <v-card-text class="VideoDetailsStep__card-contenido">
            <v-img
              v-if="thumbnailPreview"
              :src="thumbnailPreview"
              height="180"
              cover
              class="VideoDetailsStep__imagen"
            />
            
            <div 
              v-else
              class="VideoDetailsStep__placeholder"
            >
              <v-icon size="large" class="VideoDetailsStep__icono-placeholder">mdi-image-off</v-icon>
              <span class="VideoDetailsStep__texto-placeholder">Sin miniatura</span>
            </div>

            <div
              class="VideoDetailsStep__upload"
              :class="{ 'VideoDetailsStep__upload--dragging': isDragging }"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleThumbnailDrop"
              @click="$refs.thumbnailInput?.click()"
            >
              <input 
                ref="thumbnailInput"
                type="file" 
                class="VideoDetailsStep__input" 
                accept="image/*" 
                @change="handleThumbnailInput"
              >
              
              <div v-if="!details.thumbnail" class="VideoDetailsStep__upload-vacio">
                <v-icon class="VideoDetailsStep__icono-upload">mdi-image-plus</v-icon>
                <span>Subir miniatura</span>
              </div>
              
              <div v-else class="VideoDetailsStep__upload-completo">
                <v-icon color="success" class="VideoDetailsStep__icono-success">mdi-check-circle</v-icon>
                <span>Miniatura seleccionada</span>
                <v-btn 
                  icon="mdi-close" 
                  size="small" 
                  color="error" 
                  variant="text" 
                  class="VideoDetailsStep__boton-eliminar"
                  @click.stop="removeThumbnail"
                />
              </div>
            </div>
            
            <p class="VideoDetailsStep__info-formato">
              JPG, PNG o GIF (máx. 2MB)
            </p>
          </v-card-text>
        </v-card>
      </div>
      
      <div class="VideoDetailsStep__formulario">
        <v-card class="VideoDetailsStep__card-formulario">
          <v-card-text class="VideoDetailsStep__form-contenido">
            <v-text-field
              v-model="details.title"
              label="Título *"
              variant="outlined"
              placeholder="Título descriptivo del video"
              :counter="100"
              maxlength="100"
              required
              class="VideoDetailsStep__campo"
            />
            
            <v-textarea
              v-model="details.description"
              label="Descripción"
              variant="outlined"
              placeholder="Describe tu video (opcional)"
              :counter="500"
              maxlength="500"
              rows="4"
              auto-grow
              class="VideoDetailsStep__campo"
            />
            
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
              class="VideoDetailsStep__campo"
            >
              <template v-slot:no-data>
                <div class="VideoDetailsStep__no-data">
                  {{ loading ? 'Cargando asignaturas...' : 'No hay asignaturas disponibles para este curso' }}
                </div>
              </template>
            </v-select>
          </v-card-text>
        </v-card>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/SubirVideo/steps/paso2DetallesVideo";
</style>