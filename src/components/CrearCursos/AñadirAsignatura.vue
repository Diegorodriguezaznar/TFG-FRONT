<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAsignaturaStore } from '@/stores/Asignaturas';

const props = defineProps<{
  cursoId: number;
  mostrar: boolean;
}>();

const emit = defineEmits(['cerrar', 'asignaturaCreada', 'update:mostrar']);

// Referencia local para el diálogo
const dialogVisible = ref(props.mostrar);

// Sincronizar cambios bidireccionales
watch(() => props.mostrar, (newVal) => {
  dialogVisible.value = newVal;
});

watch(() => dialogVisible.value, (newVal) => {
  if (newVal !== props.mostrar) {
    emit('update:mostrar', newVal);
  }
});

const asignaturaStore = useAsignaturaStore();

const nuevaAsignatura = ref({
  nombre: '',
  descripcion: '',
  idCurso: props.cursoId
});

const loading = ref(false);
const errors = ref<string[]>([]);

const resetForm = () => {
  nuevaAsignatura.value = {
    nombre: '',
    descripcion: '',
    idCurso: props.cursoId
  };
  errors.value = [];
};

const cerrarModal = () => {
  resetForm();
  dialogVisible.value = false;
  emit('cerrar');
};

const crearAsignatura = async () => {
  // Validación básica
  errors.value = [];
  if (!nuevaAsignatura.value.nombre) {
    errors.value.push('El nombre de la asignatura es obligatorio');
    return;
  }

  loading.value = true;
  try {
    const resultado = await asignaturaStore.createAsignatura({
      nombre: nuevaAsignatura.value.nombre,
      descripcion: nuevaAsignatura.value.descripcion || null,
      idCurso: props.cursoId
    });

    if (resultado) {
      emit('asignaturaCreada');
      cerrarModal();
    } else {
      errors.value.push(asignaturaStore.errorMessage || 'Error al crear la asignatura');
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <v-dialog 
    :model-value="dialogVisible" 
    @update:model-value="dialogVisible = $event"
    max-width="500" 
    persistent
  >
    <v-card>
      <v-toolbar color="primary" dark flat>
        <v-toolbar-title>
          <v-icon class="mr-2">mdi-book-plus</v-icon>
          Añadir nueva asignatura
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="cerrarModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="pt-5">
        <v-alert v-if="errors.length > 0" type="error" class="mb-4">
          <ul class="pl-4 mb-0">
            <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
          </ul>
        </v-alert>

        <v-form @submit.prevent="crearAsignatura">
          <v-text-field
            v-model="nuevaAsignatura.nombre"
            label="Nombre de la asignatura"
            required
            variant="outlined"
            prepend-icon="mdi-book"
            :rules="[v => !!v || 'El nombre es obligatorio']"
            hide-details="auto"
            class="mb-4"
          ></v-text-field>

          <v-textarea
            v-model="nuevaAsignatura.descripcion"
            label="Descripción (opcional)"
            variant="outlined"
            prepend-icon="mdi-text-box"
            auto-grow
            rows="3"
            hide-details="auto"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions class="pb-5 px-5">
        <v-spacer></v-spacer>
        <v-btn 
          variant="text" 
          @click="cerrarModal"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="crearAsignatura"
          :loading="loading"
          :disabled="!nuevaAsignatura.nombre"
        >
          Crear asignatura
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>