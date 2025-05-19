<script setup lang="ts">
import { ref } from 'vue'
import type { CursoDTO } from '@/stores/dtos/CursoDTO'

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'crear', nuevoCurso: Omit<CursoDTO, 'idCurso' | 'fechaCreacion'>): void
}>()

const props = defineProps<{
  modelValue: boolean
}>()

const nuevoCurso = ref<Omit<CursoDTO, 'idCurso' | 'fechaCreacion'>>({
  nombre: '',
  imagen: '',
  descripcion: ''
})

// Objeto para almacenar errores de validación
const errores = ref({
  nombre: ''
})

// Función para validar campos antes de enviar
function validarFormulario(): boolean {
  // Restablecer errores
  errores.value = { nombre: '' }
  
  let esValido = true;
  
  // Validar nombre
  if (!nuevoCurso.value.nombre.trim()) {
    errores.value.nombre = 'El nombre es obligatorio';
    esValido = false;
  }
  
  return esValido;
}

function cerrar() {
  emit('update:modelValue', false)
}

function crear() {
  // Validar formulario antes de enviar
  if (!validarFormulario()) {
    return;
  }

  emit('crear', { ...nuevoCurso.value })
  
  // Limpiar formulario
  nuevoCurso.value = {
    nombre: '',
    imagen: '',
    descripcion: ''
  }
  
  cerrar()
}
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="500px" persistent>
    <v-card>
      <v-card-title>Crear Curso</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field 
                v-model="nuevoCurso.nombre" 
                label="Nombre" 
                :error-messages="errores.nombre"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field 
                v-model="nuevoCurso.imagen" 
                label="URL de imagen" 
                hint="URL de la imagen del curso"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-textarea 
                v-model="nuevoCurso.descripcion" 
                label="Descripción" 
                hint="Describe brevemente el contenido del curso"
                persistent-hint
                rows="3"
                auto-grow
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cerrar">Cancelar</v-btn>
        <v-btn color="primary" @click="crear">Crear</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>