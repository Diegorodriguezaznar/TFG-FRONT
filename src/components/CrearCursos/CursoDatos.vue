<script setup lang="ts">
import { defineModel, ref } from 'vue';

const cursoForm = defineModel({
  type: Object,
  required: true
});

// Para manejar la imagen
const selectedFile = ref<File | null>(null);
const imagePreview = ref('');
const fileInput = ref();

// Función para seleccionar archivo
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    selectedFile.value = file;
    
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
      cursoForm.value.imagen = imagePreview.value; // Para el preview
    };
    reader.readAsDataURL(file);
  }
};

// Función para abrir selector de archivos
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Función para remover archivo
const removeFile = () => {
  selectedFile.value = null;
  imagePreview.value = '';
  cursoForm.value.imagen = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Exponer selectedFile para el componente padre
defineExpose({
  selectedFile
});
</script>

<template>
  <v-form>
    <v-text-field
      label="Nombre del curso"
      v-model="cursoForm.nombre"
      required
      variant="outlined"
      :rules="[v => !!v || 'El nombre es obligatorio']"
      placeholder="Ej. Desarrollo Web Full Stack"
      prepend-icon="mdi-format-title"
      class="mb-4"
    />

    <!-- Reemplazar campo URL por selector de archivo -->
    <div class="mb-4">
      <label class="text-subtitle-2 font-weight-medium mb-2 d-block">
        <v-icon class="me-2">mdi-image</v-icon>
        Imagen del curso
      </label>
      
      <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        @change="handleFileSelect" 
        style="display: none"
      >
      
      <div v-if="!selectedFile" class="upload-area" @click="triggerFileInput">
        <v-icon size="48" color="grey">mdi-cloud-upload</v-icon>
        <p class="text-body-2 mt-2">Haz clic para subir una imagen</p>
        <p class="text-caption text-grey">PNG, JPG, JPEG hasta 5MB</p>
      </div>
      
      <div v-else class="file-preview">
        <v-img 
          :src="imagePreview" 
          height="120"
          class="preview-image mb-2"
          cover
        ></v-img>
        <div class="d-flex align-center justify-space-between">
          <span class="text-body-2">{{ selectedFile.name }}</span>
          <v-btn 
            icon="mdi-delete" 
            variant="text" 
            color="error" 
            size="small"
            @click="removeFile"
          ></v-btn>
        </div>
      </div>
    </div>

    <v-textarea
      label="Descripción"
      v-model="cursoForm.descripcion"
      variant="outlined"
      auto-grow
      rows="4"
      placeholder="Describe los objetivos y contenido del curso..."
      :rules="[v => !!v || 'La descripción es obligatoria']"
      prepend-icon="mdi-text-box"
      class="mb-2"
    />
  </v-form>
</template>

<style scoped>
.upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-area:hover {
  border-color: #1976d2;
  background: #f5f7ff;
}

.file-preview {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  background: #f9f9f9;
}

.preview-image {
  border-radius: 4px;
}
</style>