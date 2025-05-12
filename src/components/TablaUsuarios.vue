<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUsuarioStore } from '@/stores/Usuario';
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO';

const usuarioStore = useUsuarioStore();
const searchQuery = ref('');
const showForm = ref(false);
const isEditing = ref(false);
const selectedUsuario = ref<UsuarioDTO | null>(null);
const usuarioForm = ref<Partial<UsuarioDTO & {contraseña?: string}>>({
  nombre: '', apellido: '', gmail: '', telefono: '', 
  idRol: 2, fotoPerfil: '', contraseña: ''
});
const confirmDelete = ref(false);
const idToDelete = ref<number | null>(null);
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const showPassword = ref(false);

const roles = [
  { idRol: 1, nombre: 'Administrador' },
  { idRol: 2, nombre: 'Profesor' },
  { idRol: 3, nombre: 'Alumno' },
];

const usuariosFiltrados = computed(() => 
  !searchQuery.value 
    ? usuarioStore.usuarios 
    : usuarioStore.usuarios.filter(usuario =>
        usuario.nombre.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        usuario.apellido.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        usuario.gmail.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
);

onMounted(() => usuarioStore.fetchAllUsuarios());

function resetMessages() {
  errorMessage.value = '';
  successMessage.value = '';
}

function openCreateForm() {
  showForm.value = true;
  isEditing.value = false;
  selectedUsuario.value = null;
  usuarioForm.value = {
    nombre: '', apellido: '', gmail: '', telefono: '',
    idRol: 2, fotoPerfil: '', contraseña: ''
  };
  resetMessages();
}

function openEditForm(usuario: UsuarioDTO) {
  showForm.value = true;
  isEditing.value = true;
  selectedUsuario.value = usuario;
  usuarioForm.value = {
    ...usuario,
    contraseña: ''
  };
  resetMessages();
}

function closeForm() {
  showForm.value = false;
  errorMessage.value = '';
  showPassword.value = false;
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

async function handleApiRequest(url: string, method: string, payload?: any) {
  const options: RequestInit = {
    method,
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  
  return response;
}

async function createUsuario() {
  if (!usuarioForm.value.nombre || !usuarioForm.value.gmail || !usuarioForm.value.contraseña) {
    errorMessage.value = "Los campos nombre, email y contraseña son obligatorios";
    return;
  }

  isLoading.value = true;
  resetMessages();
  
  try {
    const payload = {
      idUsuario: 0,
      nombre: usuarioForm.value.nombre,
      apellido: usuarioForm.value.apellido || '',
      gmail: usuarioForm.value.gmail,
      telefono: usuarioForm.value.telefono || '',
      contraseña: usuarioForm.value.contraseña,
      idRol: parseInt(String(usuarioForm.value.idRol)) || 2
    };
    
    await handleApiRequest("http://localhost:5190/api/Usuario", "POST", payload);
    await usuarioStore.fetchAllUsuarios();
    successMessage.value = "Usuario creado con éxito";
    closeForm();
  } catch (error) {
    errorMessage.value = error.message || "Error al crear el usuario";
  } finally {
    isLoading.value = false;
  }
}

async function updateUsuario() {
  if (!selectedUsuario.value) return;
  
  if (!usuarioForm.value.nombre || !usuarioForm.value.gmail) {
    errorMessage.value = "Los campos nombre y email son obligatorios";
    return;
  }

  isLoading.value = true;
  resetMessages();
  
  try {
    const payload = {
      idUsuario: selectedUsuario.value.idUsuario,
      nombre: usuarioForm.value.nombre,
      apellido: usuarioForm.value.apellido || '',
      gmail: usuarioForm.value.gmail,
      telefono: usuarioForm.value.telefono || '',
      contraseña: usuarioForm.value.contraseña || '',
      idRol: parseInt(String(usuarioForm.value.idRol)) || 2
    };
    
    await handleApiRequest(`http://localhost:5190/api/Usuario/${selectedUsuario.value.idUsuario}`, "PUT", payload);
    await usuarioStore.fetchAllUsuarios();
    successMessage.value = "Usuario actualizado con éxito";
    closeForm();
  } catch (error) {
    errorMessage.value = error.message || "Error al actualizar el usuario";
  } finally {
    isLoading.value = false;
  }
}

async function saveUsuario() {
  isEditing.value ? await updateUsuario() : await createUsuario();
}

function prepareDelete(id: number) {
  confirmDelete.value = true;
  idToDelete.value = id;
  errorMessage.value = '';
}

async function confirmDeleteUsuario() {
  if (idToDelete.value === null) return;
  
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    await handleApiRequest(`http://localhost:5190/api/Usuario/${idToDelete.value}`, "DELETE");
    successMessage.value = "Usuario eliminado con éxito";
    await usuarioStore.fetchAllUsuarios();
    confirmDelete.value = false;
    idToDelete.value = null;
  } catch (error) {
    errorMessage.value = error.message || "Error al eliminar el usuario";
  } finally {
    isLoading.value = false;
  }
}

function cancelDelete() {
  confirmDelete.value = false;
  idToDelete.value = null;
  errorMessage.value = '';
}

function getNombreRol(idRol: number): string {
  const rol = roles.find(r => r.idRol === idRol);
  return rol ? rol.nombre : 'Desconocido';
}
</script>

<template>
  <div class="usuario-table">
    <v-alert v-if="errorMessage" type="error" variant="tonal" closable class="usuario-table__alert usuario-table__alert--error">
      {{ errorMessage }}
    </v-alert>

    <v-alert v-if="successMessage" type="success" variant="tonal" closable class="usuario-table__alert usuario-table__alert--success">
      {{ successMessage }}
    </v-alert>

    <div class="usuario-table__toolbar">
      <v-text-field v-model="searchQuery" label="Buscar usuario" prepend-inner-icon="mdi-magnify"
        density="compact" hide-details class="usuario-table__search" />
      
      <v-btn color="#ff7424" @click="openCreateForm" prepend-icon="mdi-plus" class="usuario-table__btn-new">
        Nuevo Usuario
      </v-btn>
    </div>

    <v-table class="usuario-table__data">
      <thead>
        <tr>
          <th>ID</th><th>Nombre</th><th>Apellido</th><th>Email</th>
          <th>Teléfono</th><th>Rol</th><th>Foto</th><th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="isLoading">
          <td colspan="8" class="text-center py-5">
            <v-progress-circular indeterminate color="#ff7424"></v-progress-circular>
          </td>
        </tr>
        <tr v-else-if="usuariosFiltrados.length === 0">
          <td colspan="8" class="text-center py-5">No se encontraron usuarios</td>
        </tr>
        <tr v-for="usuario in usuariosFiltrados" :key="usuario.idUsuario" class="usuario-table__row">
          <td>{{ usuario.idUsuario }}</td>
          <td>{{ usuario.nombre }}</td>
          <td>{{ usuario.apellido }}</td>
          <td>{{ usuario.gmail }}</td>
          <td>{{ usuario.telefono || 'N/A' }}</td>
          <td>{{ getNombreRol(usuario.idRol) }}</td>
          <td>
            <img v-if="usuario.fotoPerfil" :src="usuario.fotoPerfil" alt="Foto de perfil" class="usuario-table__img"/>
            <span v-else>Sin foto</span>
          </td>
          <td>
            <div class="usuario-table__actions">
              <v-btn icon variant="text" color="primary" size="small" @click="openEditForm(usuario)" class="usuario-table__btn usuario-table__btn--edit">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="error" size="small" @click="prepareDelete(usuario.idUsuario)" class="usuario-table__btn usuario-table__btn--delete">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="showForm" max-width="600px" class="usuario-form-dialog">
      <v-card class="usuario-form">
        <v-card-title class="usuario-form__title">
          <span>{{ isEditing ? 'Editar' : 'Nuevo' }} Usuario</span>
        </v-card-title>
        
        <v-card-text class="usuario-form__content">
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="usuario-form__alert usuario-form__alert--error">
            {{ errorMessage }}
          </v-alert>
          
          <v-alert v-if="successMessage" type="success" variant="tonal" class="usuario-form__alert usuario-form__alert--success">
            {{ successMessage }}
          </v-alert>
          
          <v-form @submit.prevent="saveUsuario" class="usuario-form__fields">
            <v-text-field v-model="usuarioForm.nombre" label="Nombre" required class="usuario-form__field"></v-text-field>
            <v-text-field v-model="usuarioForm.apellido" label="Apellido" class="usuario-form__field"></v-text-field>
            <v-text-field v-model="usuarioForm.gmail" label="Email" type="email" required class="usuario-form__field"></v-text-field>
            <v-text-field v-model="usuarioForm.telefono" label="Teléfono" class="usuario-form__field"></v-text-field>
            <v-select v-model="usuarioForm.idRol" :items="roles" item-title="nombre" 
              item-value="idRol" label="Rol" required class="usuario-form__field"></v-select>
            <v-text-field v-model="usuarioForm.fotoPerfil" label="URL de foto de perfil" class="usuario-form__field"></v-text-field>
            
            <div class="usuario-form__password-container">
              <v-text-field v-model="usuarioForm.contraseña" 
                :label="isEditing ? 'Nueva contraseña (dejar vacío para mantener la actual)' : 'Contraseña'"
                :type="showPassword ? 'text' : 'password'" :required="!isEditing"
                class="usuario-form__field usuario-form__field--password"></v-text-field>
              
              <v-btn variant="text" color="primary" icon @click="togglePasswordVisibility" 
                class="usuario-form__password-toggle">
                <v-icon>{{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="usuario-form__actions">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="closeForm" class="usuario-form__btn usuario-form__btn--cancel">
            Cancelar
          </v-btn>
          <v-btn color="#ff7424" @click="saveUsuario" :loading="isLoading" 
            class="usuario-form__btn usuario-form__btn--save">
            {{ isEditing ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="confirmDelete" max-width="400px" class="usuario-delete-dialog">
      <v-card class="usuario-delete">
        <v-card-title class="usuario-delete__title">¿Eliminar usuario?</v-card-title>
        
        <v-card-text class="usuario-delete__content">
          <v-alert v-if="errorMessage" type="error" variant="tonal" class="usuario-delete__alert">
            {{ errorMessage }}
          </v-alert>
          <p class="usuario-delete__message">Esta acción no se puede deshacer. ¿Estás seguro de que deseas eliminar este usuario?</p>
        </v-card-text>
        
        <v-card-actions class="usuario-delete__actions">
          <v-spacer></v-spacer>
          <v-btn color="grey-darken-1" variant="text" @click="cancelDelete" 
            class="usuario-delete__btn usuario-delete__btn--cancel">Cancelar</v-btn>
          <v-btn color="error" @click="confirmDeleteUsuario" :loading="isLoading" 
            class="usuario-delete__btn usuario-delete__btn--confirm">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.usuario-table {
  width: 100%;
  overflow-x: auto;
}

.usuario-table__alert {
  margin: 0.75rem 0;
}

.usuario-table__toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.usuario-table__search {
  max-width: 300px;
}

.usuario-table__actions {
  display: flex;
  gap: 0.5rem;
}

.usuario-table__img {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.usuario-form__password-container {
  position: relative;
}

.usuario-form__password-toggle {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 8px;
}
</style>