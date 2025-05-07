<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useAsignaturaStore } from '@/stores/Asignaturas';
import type { AsignaturaDTO } from '@/stores/dtos/AsignaturasDTO';

const asignaturaStore = useAsignaturaStore();
const searchQuery = ref('');
const showForm = ref(false);
const isEditing = ref(false);
const selectedAsignatura = ref<AsignaturaDTO | null>(null);
const asignaturaForm = ref<Partial<AsignaturaDTO>>({
  nombre: '', descripcion: '', imagen: '', idCurso: 18
});
const confirmDelete = ref(false);
const idToDelete = ref<number | null>(null);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const asignaturasFiltradas = computed(() => 
  !searchQuery.value 
    ? asignaturaStore.asignaturas 
    : asignaturaStore.asignaturas.filter(asignatura =>
        asignatura.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
);

onMounted(() => asignaturaStore.fetchAllAsignaturas());

function resetMessages() {
  errorMessage.value = '';
  successMessage.value = '';
}

function openCreateForm() {
  showForm.value = true;
  isEditing.value = false;
  selectedAsignatura.value = null;
  asignaturaForm.value = {
    nombre: '', descripcion: '', imagen: '', idCurso: 18
  };
  resetMessages();
}

function openEditForm(asignatura: AsignaturaDTO) {
  showForm.value = true;
  isEditing.value = true;
  selectedAsignatura.value = asignatura;
  asignaturaForm.value = { ...asignatura };
  resetMessages();
}

function closeForm() {
  showForm.value = false;
  errorMessage.value = '';
}

async function createAsignatura() {
  if (!asignaturaForm.value.nombre || !asignaturaForm.value.descripcion) {
    errorMessage.value = "Los campos nombre y descripción son obligatorios";
    return;
  }

  isLoading.value = true;
  resetMessages();
  
  // ID del curso como número entero
  const cursoId = parseInt(String(asignaturaForm.value.idCurso)) || 18;
  
  try {
    // Formatos para probar en orden
    const payloads = [
      // Formato 1: Objeto simple con idCurso
      {
        nombre: asignaturaForm.value.nombre,
        descripcion: asignaturaForm.value.descripcion,
        imagen: asignaturaForm.value.imagen || '',
        idCurso: cursoId
      },
      // Formato 2: Solo con objeto curso
      {
        nombre: asignaturaForm.value.nombre,
        descripcion: asignaturaForm.value.descripcion,
        imagen: asignaturaForm.value.imagen || '',
        curso: { idCurso: cursoId }
      },
      // Formato 3: Combinado idCurso + objeto curso
      {
        nombre: asignaturaForm.value.nombre,
        descripcion: asignaturaForm.value.descripcion,
        imagen: asignaturaForm.value.imagen || '',
        idCurso: cursoId,
        curso: { idCurso: cursoId }
      },
      // Formato 4: Completo según swagger
      {
        idAsignatura: 0,
        nombre: asignaturaForm.value.nombre,
        descripcion: asignaturaForm.value.descripcion,
        imagen: asignaturaForm.value.imagen || '',
        fechaCreacion: new Date().toISOString(),
        idCurso: cursoId,
        curso: {
          idCurso: cursoId,
          nombre: "",
          imagen: "",
          descripcion: "",
          fechaCreacion: new Date().toISOString()
        }
      }
    ];
    
    let response = null;
    let success = false;
    
    // Probar cada formato hasta que uno funcione
    for (let i = 0; i < payloads.length && !success; i++) {
      response = await fetch("http://localhost:5190/api/Asignatura", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloads[i]),
      });
      
      success = response.ok;
    }
    
    // Procesar respuesta final
    if (success) {
      await asignaturaStore.fetchAllAsignaturas();
      successMessage.value = "Asignatura creada con éxito";
      closeForm();
    } else {
      throw new Error(`No se pudo crear la asignatura. Código: ${response.status}`);
    }
  } catch (error) {
    errorMessage.value = error.message || "Error al crear la asignatura";
  } finally {
    isLoading.value = false;
  }
}

async function updateAsignatura() {
  if (!selectedAsignatura.value) return;
  
  if (!asignaturaForm.value.nombre || !asignaturaForm.value.descripcion) {
    errorMessage.value = "Los campos nombre y descripción son obligatorios";
    return;
  }

  isLoading.value = true;
  resetMessages();
  
  try {
    const idCurso = parseInt(String(asignaturaForm.value.idCurso)) || 18;
    
    const payload = {
      idAsignatura: selectedAsignatura.value.idAsignatura,
      nombre: asignaturaForm.value.nombre,
      descripcion: asignaturaForm.value.descripcion,
      imagen: asignaturaForm.value.imagen || '',
      fechaCreacion: selectedAsignatura.value.fechaCreacion || new Date().toISOString(),
      idCurso: idCurso,
      curso: {
        idCurso: idCurso,
        nombre: "string",
        imagen: "string",
        descripcion: "string",
        fechaCreacion: new Date().toISOString()
      }
    };
    
    const response = await fetch(`http://localhost:5190/api/Asignatura/${selectedAsignatura.value.idAsignatura}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar la asignatura. Código: ${response.status}`);
    }

    await asignaturaStore.fetchAllAsignaturas();
    successMessage.value = "Asignatura actualizada con éxito";
    closeForm();
  } catch (error) {
    errorMessage.value = error.message || "Error al actualizar la asignatura";
  } finally {
    isLoading.value = false;
  }
}

async function saveAsignatura() {
  isEditing.value ? await updateAsignatura() : await createAsignatura();
}

function prepareDelete(id: number) {
  confirmDelete.value = true;
  idToDelete.value = id;
  errorMessage.value = '';
}

async function confirmDeleteAsignatura() {
  if (idToDelete.value === null) return;
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await fetch(`http://localhost:5190/api/Asignatura/${idToDelete.value}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      throw new Error(`Error al eliminar la asignatura. Código: ${response.status}`);
    }

    successMessage.value = "Asignatura eliminada con éxito";
    await asignaturaStore.fetchAllAsignaturas();
    confirmDelete.value = false;
    idToDelete.value = null;
  } catch (error) {
    errorMessage.value = error.message || "Error al eliminar la asignatura";
  } finally {
    isLoading.value = false;
  }
}

function cancelDelete() {
  confirmDelete.value = false;
  idToDelete.value = null;
  errorMessage.value = '';
}

function formatDate(date: Date | string): string {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
}
</script>

<template>
  <div class="asignatura-table">
    <v-alert v-if="errorMessage" type="error" variant="tonal" closable class="asignatura-table__alert asignatura-table__alert--error">
      {{ errorMessage }}
    </v-alert>

    <v-alert v-if="successMessage" type="success" variant="tonal" closable class="asignatura-table__alert asignatura-table__alert--success">
      {{ successMessage }}
    </v-alert>

    <div class="asignatura-table__toolbar">
      <v-text-field v-model="searchQuery" label="Buscar asignatura" prepend-inner-icon="mdi-magnify"
        density="compact" hide-details class="asignatura-table__search" />
      
      <v-btn color="#ff7424" @click="openCreateForm" prepend-icon="mdi-plus" class="asignatura-table__btn-new">
        Nueva Asignatura
      </v-btn>
    </div>

    <v-table class="asignatura-table__data">
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Descripción</th>
          <th>Curso ID</th><th>Fecha Creación</th><th>Imagen</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="7" class="text-center py-5">
            <v-progress-circular indeterminate color="#ff7424"></v-progress-circular>
          </td>
        </tr>
        <tr v-else-if="asignaturasFiltradas.length === 0">
          <td colspan="7" class="text-center py-5">No se encontraron asignaturas</td>
        </tr>
        <tr v-for="asignatura in asignaturasFiltradas" :key="asignatura.idAsignatura" class="asignatura-table__row">
          <td>{{ asignatura.idAsignatura }}</td>
          <td>{{ asignatura.nombre }}</td>
          <td><span class="asignatura-table__descripcion">{{ asignatura.descripcion }}</span></td>
          <td>{{ asignatura.idCurso }}</td>
          <td>{{ formatDate(asignatura.fechaCreacion) }}</td>
          <td>
            <img v-if="asignatura.imagen" :src="asignatura.imagen" alt="Imagen de asignatura" class="asignatura-table__img"/>
            <span v-else>Sin imagen</span>
          </td>
          <td>
            <div class="asignatura-table__actions">
              <v-btn icon variant="text" color="primary" size="small" @click="openEditForm(asignatura)" class="asignatura-table__btn asignatura-table__btn--edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="error" size="small" @click="prepareDelete(asignatura.idAsignatura)" class="asignatura-table__btn asignatura-table__btn--delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="showForm" max-width="600px" class="asignatura-form-dialog">
      <v-card class="asignatura-form">
        <v-card-title class="asignatura-form__title">
          <span>{{ isEditing ? 'Editar' : 'Nueva' }} Asignatura</span>
        </v-card-title>
        
        <v-card-text class="asignatura-form__content">
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="asignatura-form__alert asignatura-form__alert--error">
            {{ errorMessage }}
          </v-alert>
          
          <v-alert v-if="successMessage" type="success" variant="tonal" class="asignatura-form__alert asignatura-form__alert--success">
            {{ successMessage }}
          </v-alert>
          
          <v-form @submit.prevent="saveAsignatura" class="asignatura-form__fields">
            <v-text-field v-model="asignaturaForm.nombre" label="Nombre" required class="asignatura-form__field"></v-text-field>
            <v-textarea v-model="asignaturaForm.descripcion" label="Descripción" required class="asignatura-form__field"></v-textarea>
            <v-text-field v-model="asignaturaForm.imagen" label="URL de imagen" class="asignatura-form__field"></v-text-field>
            <v-text-field v-model.number="asignaturaForm.idCurso" label="ID de Curso" type="number" required
              :hint="!isEditing ? 'Probando múltiples formatos para ID de curso' : ''"
              persistent-hint class="asignatura-form__field"></v-text-field>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="asignatura-form__actions">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeForm" class="asignatura-form__btn asignatura-form__btn--cancel">
            Cancelar
          </v-btn>
          <v-btn color="#ff7424" @click="saveAsignatura" :loading="isLoading" 
            class="asignatura-form__btn asignatura-form__btn--save">
            {{ isEditing ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDelete" max-width="400px" class="asignatura-delete-dialog">
      <v-card class="asignatura-delete">
        <v-card-title class="asignatura-delete__title">¿Eliminar asignatura?</v-card-title>
        
        <v-card-text class="asignatura-delete__content">
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="asignatura-delete__alert">
            {{ errorMessage }}
          </v-alert>
          <p class="asignatura-delete__message">Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar esta asignatura?</p>
        </v-card-text>
        
        <v-card-actions class="asignatura-delete__actions">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="cancelDelete" 
            class="asignatura-delete__btn asignatura-delete__btn--cancel">Cancelar</v-btn>
          <v-btn color="error" @click="confirmDeleteAsignatura" :loading="isLoading" 
            class="asignatura-delete__btn asignatura-delete__btn--confirm">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.asignatura-table {
  width: 100%;
  overflow-x: auto;
}

.asignatura-table__alert {
  margin: 0.75rem 0;
}

.asignatura-table__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.asignatura-table__search {
  max-width: 300px;
}

.asignatura-table__actions {
  display: flex;
  gap: 0.5rem;
}

.asignatura-table__descripcion {
  display: block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.asignatura-table__img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
</style>