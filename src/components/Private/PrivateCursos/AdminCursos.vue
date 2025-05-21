<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCursoStore } from '@/stores/Curso'
import type { CursoDTO } from '@/stores/dtos/CursoDTO'

const cursoStore = useCursoStore()

onMounted(() => {
  cursoStore.fetchAllCursos()
})

// Modal eliminación
const dialogEliminar = ref(false)
const idCursoEliminar = ref<number | null>(null)

function abrirDialogoEliminar(id: number) {
  idCursoEliminar.value = id
  dialogEliminar.value = true
}

async function confirmarEliminar() {
  if (idCursoEliminar.value !== null) {
    await cursoStore.deleteCurso(idCursoEliminar.value)
    dialogEliminar.value = false
  }
}

// Modal editar (futuro)
function editarCurso(curso: CursoDTO) {
  console.log("EDITAR CURSO:", curso)
}

function crearCurso() {
  console.log("CREAR CURSO (pendiente)")
}
</script>

<template>
  <section class="admin-cursos">
    <h2 class="text-h6 text-md-h5 mb-4">Listado de Cursos</h2>

    <v-data-table
      :headers="[
        { title: 'Imagen', value: 'imagen', class: 'd-none d-md-table-cell' },
        { title: 'Nombre', value: 'nombre' },
        { title: 'Descripción', value: 'descripcion', class: 'd-none d-md-table-cell' },
        { title: 'Fecha', value: 'fechaCreacion', class: 'd-none d-md-table-cell' },
        { title: 'Acciones', value: 'acciones', sortable: false }
      ]"
      :items="cursoStore.cursos"
      class="elevation-1"
    >
      <template #item.imagen="{ item }">
        <v-avatar size="40" class="d-none d-md-flex">
          <img :src="item.imagen" alt="imagen" />
        </v-avatar>
      </template>

      <template #item.descripcion="{ item }">
        <span class="d-none d-md-inline">{{ item.descripcion }}</span>
      </template>

      <template #item.fechaCreacion="{ item }">
        <span class="d-none d-md-inline">{{ new Date(item.fechaCreacion).toLocaleDateString() }}</span>
      </template>

      <template #item.acciones="{ item }">
        <v-btn
          color="error"
          size="small"
          @click="abrirDialogoEliminar(item.idCurso)"
        >
          Eliminar
        </v-btn>
      </template>
    </v-data-table>

    <!-- Modal Confirmar eliminación -->
    <v-dialog v-model="dialogEliminar" max-width="400px">
      <v-card>
        <v-card-title class="text-h6">Confirmar eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que quieres eliminar este curso?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialogEliminar = false">Cancelar</v-btn>
          <v-btn color="error" @click="confirmarEliminar">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Botón flotante para crear curso -->
    <v-btn
      color="primary"
      class="crear-btn"
      icon
      size="large"
      @click="crearCurso"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </section>
</template>

<style scoped lang="scss">
.admin-cursos {
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
