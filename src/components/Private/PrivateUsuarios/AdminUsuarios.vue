<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUsuarioStore } from '@/stores/Usuario'
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO'
import ModalEditarUsuario from '@/components/Private/PrivateUsuarios/ModalEditarUsuario.vue'
import ModalCrearUsuario from '@/components/Private/PrivateUsuarios/ModalCrearUsuario.vue'


const usuarioStore = useUsuarioStore()

onMounted(() => {
  usuarioStore.fetchAllUsuarios()
})

// --- Modal de eliminación ---
const dialogEliminar = ref(false)
const idUsuarioEliminar = ref<number | null>(null)

function abrirDialogoEliminar(id: number) {
  idUsuarioEliminar.value = id
  dialogEliminar.value = true
}

async function confirmarEliminar() {
  if (idUsuarioEliminar.value !== null) {
    await usuarioStore.deleteUsuario(idUsuarioEliminar.value)
    dialogEliminar.value = false
  }
}

// --- Modal de edición ---
const dialogEditar = ref(false)
const usuarioEditable = ref<UsuarioDTO | null>(null)

function abrirDialogoEditar(usuario: UsuarioDTO) {
  usuarioEditable.value = { ...usuario }
  dialogEditar.value = true
}

async function guardarCambios(usuarioActualizado: UsuarioDTO) {
  try {
    await usuarioStore.updateUsuario(usuarioActualizado);
    await usuarioStore.fetchAllUsuarios(); 
    dialogEditar.value = false;
    
  } catch (error: any) {
    console.error("Error al actualizar usuario:", error);

    alert(`Error al actualizar: ${error.message}`);
  }
}

// --- Modal de creación ---
const dialogCrear = ref(false)
const errorCrear = ref('')

  async function crearUsuarioEnBD(nuevo: UsuarioDTO) {
    errorCrear.value = ''; // Limpiar errores previos
    
    try {
      await usuarioStore.createUsuario(nuevo)
      await usuarioStore.fetchAllUsuarios()
      // Mostrar mensaje de éxito (opcional)
      // Cerrar el diálogo
    } catch (error: any) {
      errorCrear.value = error.message || 'Error al crear el usuario';
      dialogCrear.value = true; // Mantener el diálogo abierto
    }
  }
// --- Crear usuario (por implementar) ---
function crearUsuario() {
  console.log("Crear usuario aún no implementado")
}
</script>

<template>
  <section class="admin-usuarios">
    <h2 class="text-h6 text-md-h5 mb-4">Listado de Usuarios</h2>

    <v-data-table
      :headers="[
        { title: 'Nombre', value: 'nombre' },
        { title: 'Apellidos', value: 'apellidos', class: 'd-none d-md-table-cell' },
        { title: 'Email', value: 'gmail' },
        { title: 'Teléfono', value: 'telefono', class: 'd-none d-md-table-cell' },
        { title: 'Rol', value: 'idRol', class: 'd-none d-md-table-cell' },
        { title: 'Acciones', value: 'acciones', sortable: false }
      ]"
      :items="usuarioStore.usuarios"
      class="elevation-1"
    >

      <template #item.apellidos="{ item }">
        <span class="d-none d-md-inline">{{ item.apellidos }}</span>
      </template>

      <template #item.telefono="{ item }">
        <span class="d-none d-md-inline">{{ item.telefono }}</span>
      </template>

      <template #item.idRol="{ item }">
        <span class="d-none d-md-inline">{{ item.idRol }}</span>
      </template>

      <template #item.acciones="{ item }">
        <v-btn
          color="primary"
          class="me-2"
          size="small"
          @click="abrirDialogoEditar(item)"
        >
          Editar
        </v-btn>

        <v-btn
          color="error"
          size="small"
          @click="abrirDialogoEliminar(item.idUsuario)"
        >
          Eliminar
        </v-btn>
      </template>
    </v-data-table>

    <!-- MODAL: Confirmar eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar este usuario?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn color="error" @click="confirmarEliminar">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- MODAL: Editar usuario -->
    <ModalEditarUsuario
      v-model="dialogEditar"
      :usuario="usuarioEditable"
      @guardar="guardarCambios"
    />

    <!-- BOTÓN: Crear usuario -->
        <v-btn
        color="primary"
        class="crear-btn"
        icon
        size="large"
        @click="dialogCrear = true"
        >
        <v-icon>mdi-plus</v-icon>
        </v-btn>

    <!-- MODAL: Crear usuario -->
    <ModalCrearUsuario
      v-model="dialogCrear"
      @crear="crearUsuarioEnBD"
    />

   <!-- Alerta de error si hay un problema al crear el usuario -->
    <v-snackbar
      v-model="mostrarError"
      :timeout="5000"
      color="error"
    >
      {{ errorCrear }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="mostrarError = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>

  </section>
</template>

<style scoped lang="scss">
.admin-usuarios {
  padding: 1rem;

  @media (min-width: 768px) {
    padding: 2rem;
  }

  .crear-btn {
    position: fixed;
    bottom: 1.5rem;
    left: 1.5rem;
    z-index: 10;
    border-radius: 50%;
  }
}
</style>
