<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useComentarioStore } from '@/stores/Comentario';
import type { ComentarioUI } from '@/stores/dtos/ComentarioDTO';
import ModalComentarioReportado from './ModalComentarioReportado.vue';
import ModalConfirmarEliminar from './ModalConfirmarEliminar.vue';
import ModalConfirmarAprobar from './ModalConfirmarAprobar.vue';

const comentarioStore = useComentarioStore();
const comentarios = ref<ComentarioUI[]>([]);
const modalVisible = ref(false);
const comentarioSeleccionado = ref<ComentarioUI | null>(null);
const dialogConfirmarEliminar = ref(false);
const dialogConfirmarAprobar = ref(false);

onMounted(async () => {
  const reportados = await comentarioStore.fetchComentariosReportados();
  comentarios.value = reportados;
});

function verComentario(comentario: ComentarioUI) {
  comentarioSeleccionado.value = comentario;
  modalVisible.value = true;
}

function abrirDialogoEliminar(comentario: ComentarioUI) {
  comentarioSeleccionado.value = comentario;
  dialogConfirmarEliminar.value = true;
}

function abrirDialogoAprobar(id: number) {
  const comentario = comentarios.value.find(c => c.id === id);
  if (comentario) {
    comentarioSeleccionado.value = comentario;
    dialogConfirmarAprobar.value = true;
  }
}

async function confirmarEliminar(id: number) {
  try {
    await comentarioStore.eliminarComentario(id);
    comentarios.value = comentarios.value.filter(c => c.id !== id);
    dialogConfirmarEliminar.value = false;
    modalVisible.value = false;
  } catch (error) {
    console.error(error);
  }
}

async function confirmarAprobar(id: number) {
  try {
    const resultado = await comentarioStore.quitarReporteComentario(id);
    if (resultado) {
      comentarios.value = comentarios.value.filter(c => c.id !== id);
      dialogConfirmarAprobar.value = false;
      modalVisible.value = false;
    } else {
      throw new Error("No se pudo aprobar el comentario");
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <div class="admin-comentarios">
    <h1>Comentarios Reportados</h1>

    <v-table>
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Comentario</th>
          <th>Fecha</th>
          <th class="text-center">Reportes</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comentario in comentarios" :key="comentario.id">
          <td>{{ comentario.user }}</td>
          <td>{{ comentario.content.slice(0, 50) }}...</td>
          <td>{{ comentario.time }}</td>
          <td class="text-center">
            <v-chip color="error" :text="String(comentario.numeroReportes)" />
          </td>
          <td>
            <div class="d-flex">
              <v-btn
                color="info"
                variant="text"
                icon
                size="small"
                class="me-2"
                @click="verComentario(comentario)"
              >
                <v-icon>mdi-eye</v-icon>
              </v-btn>

              <v-btn
                color="error"
                variant="text"
                icon
                size="small"
                @click="abrirDialogoEliminar(comentario)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </td>
        </tr>
      </tbody>
    </v-table>

    <ModalComentarioReportado
      v-if="modalVisible"
      :mostrar="modalVisible"
      :comentario="comentarioSeleccionado"
      @update:mostrar="modalVisible = $event"
      @aprobar="abrirDialogoAprobar"
      @eliminar="abrirDialogoEliminar"
    />

    <!-- Modal para confirmar eliminación -->
    <ModalConfirmarEliminar
      :mostrar="dialogConfirmarEliminar"
      :comentario="comentarioSeleccionado"
      @update:mostrar="dialogConfirmarEliminar = $event"
      @confirmar="confirmarEliminar"
    />

    <!-- Modal para confirmar aprobación -->
    <ModalConfirmarAprobar
      :mostrar="dialogConfirmarAprobar"
      :comentario="comentarioSeleccionado"
      @update:mostrar="dialogConfirmarAprobar = $event"
      @confirmar="confirmarAprobar"
    />
  </div>
</template>