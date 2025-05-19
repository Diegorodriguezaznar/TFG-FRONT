<script setup lang="ts">
import { ref, watch } from 'vue'
import type { CursoDTO } from '@/stores/dtos/CursoDTO'

const props = defineProps<{
  modelValue: boolean
  curso: CursoDTO | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'guardar', cursoActualizado: CursoDTO): void
}>()

const cursoLocal = ref<CursoDTO | null>(null)

// Objeto para almacenar errores de validación
const errores = ref({
  nombre: ''
})

watch(
  () => props.curso,
  (nuevo) => {
    cursoLocal.value = nuevo ? { ...nuevo } : null
    // Limpiar errores cuando cambia el curso
    errores.value = { nombre: '' }
  },
  { immediate: true }
)

// Función para validar campos antes de enviar
function validarFormulario(): boolean {
  // Restablecer errores
  errores.value = { nombre: '' }
  
  let esValido = true;
  
  if (!cursoLocal.value) return false;
  
  // Validar nombre
  if (!cursoLocal.value.nombre.trim()) {
    errores.value.nombre = 'El nombre es obligatorio';
    esValido = false;
  }
  
  return esValido;
}

function cerrar() {
  emit('update:modelValue', false)
}

function guardar() {
  if (cursoLocal.value && validarFormulario()) {
    emit('guardar', cursoLocal.value)
    cerrar()
  }
}
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="500px" persistent>
    <v-card v-if="cursoLocal">
      <v-card-title>Editar Curso</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field 
                v-model="cursoLocal.nombre" 
                label="Nombre" 
                :error-messages="errores.nombre"
                required
              />
            </v-col>
            <v-col cols="12">
              <v-text-field 
                v-model="cursoLocal.imagen" 
                label="URL de imagen" 
                hint="URL de la imagen del curso"
                persistent-hint
              />
            </v-col>
            <v-col cols="12">
              <v-textarea 
                v-model="cursoLocal.descripcion" 
                label="Descripción" 
                hint="Describe brevemente el contenido del curso"
                persistent-hint
                rows="3"
                auto-grow
              />
            </v-col>
            <v-col cols="12">
              <p class="text-caption text-grey">
                Fecha de creación: {{ new Date(cursoLocal.fechaCreacion).toLocaleDateString() }}
              </p>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="cerrar">Cancelar</v-btn>
        <v-btn color="primary" @click="guardar">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>