<script setup lang="ts">
import { defineModel, ref } from 'vue';

const cursoForm = defineModel({
  type: Object,
  required: true
});

const selectedFile = ref<File | null>(null);
const imagePreview = ref('');
const fileInput = ref();

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    selectedFile.value = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
      cursoForm.value.imagen = imagePreview.value;
    };
    reader.readAsDataURL(file);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const removeFile = () => {
  selectedFile.value = null;
  imagePreview.value = '';
  cursoForm.value.imagen = '';
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

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
      class="CursoForm__campo"
    />

    <div class="CursoForm__imagen">
      <label class="CursoForm__label">
        <v-icon class="CursoForm__icono">mdi-image</v-icon>
        Imagen del curso
      </label>
      
      <input 
        ref="fileInput"
        type="file" 
        accept="image/*" 
        @change="handleFileSelect" 
        class="CursoForm__input-oculto"
      >
      
      <div v-if="!selectedFile" class="CursoForm__area-subida" @click="triggerFileInput">
        <v-icon size="48" color="grey">mdi-cloud-upload</v-icon>
        <p class="CursoForm__texto-subida">Haz clic para subir una imagen</p>
        <p class="CursoForm__texto-info">PNG, JPG, JPEG hasta 5MB</p>
      </div>
      
      <div v-else class="CursoForm__preview">
        <v-img 
          :src="imagePreview" 
          height="120"
          class="CursoForm__imagen-preview"
          cover
        />
        <div class="CursoForm__archivo-info">
          <span class="CursoForm__nombre-archivo">{{ selectedFile.name }}</span>
          <v-btn 
            icon="mdi-delete" 
            variant="text" 
            color="error" 
            size="small"
            @click="removeFile"
          />
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
      class="CursoForm__campo"
    />
  </v-form>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/CrearCursos/CursoDatos";
</style>