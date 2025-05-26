<template>
  <div class="admin-peticiones">
    <h2 class="text-2xl font-bold mb-4">Peticiones para ser Profesor</h2>

    <v-alert v-if="errorMessage" type="error" class="mb-4">
      {{ errorMessage }}
    </v-alert>

    <v-progress-circular indeterminate v-if="loading" />

    <v-table v-if="!loading && peticiones.length">
      <thead>
        <tr>
          <th>Usuario</th>
          <th>Documento</th>
          <th>Motivo</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in peticiones" :key="p.id">
          <td>
            <v-avatar size="32" class="mr-2">
              <img :src="p.avatar" alt="avatar" />
            </v-avatar>
            {{ p.user }}
          </td>
          <td>
            <a :href="p.documentoUrl" target="_blank">Ver documento</a>
          </td>
          <td>{{ p.razon }}</td>
          <td>{{ p.fecha }}</td>
          <td>
            <v-btn icon @click="abrirModal(p)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </td>
        </tr>
      </tbody>
    </v-table>

    <modal-peticion-profesor
      v-if="modalAbierto"
      :peticion="peticionSeleccionada"
      @cerrar="modalAbierto = false"
      @accionRealizada="recargar"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { usePeticionProfesorStore } from "@/stores/PeticionProfesor";
import type { PeticionProfesorUI } from "@/stores/dtos/PeticionProfesorDTO";
import ModalPeticionProfesor from "./ModalPeticionProfesor.vue";

const peticionStore = usePeticionProfesorStore();

const peticiones = ref<PeticionProfesorUI[]>([]);
const errorMessage = ref("");
const loading = ref(false);

const modalAbierto = ref(false);
const peticionSeleccionada = ref<PeticionProfesorUI | null>(null);

async function recargar() {
  loading.value = true;
  peticiones.value = await peticionStore.fetchPeticiones();
  errorMessage.value = peticionStore.errorMessage;
  loading.value = false;
}

function abrirModal(peticion: PeticionProfesorUI) {
  peticionSeleccionada.value = peticion;
  modalAbierto.value = true;
}

onMounted(() => recargar());
</script>
