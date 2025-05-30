<script setup lang="ts">
import { ref } from "vue";
import { usePeticionProfesorStore } from "@/stores/PeticionProfesor";
import { useUsuarioStore } from "@/stores/Usuario";
import type { PeticionProfesorUI, PeticionProfesorDTO } from "@/stores/dtos/PeticionProfesorDTO";

const props = defineProps<{
  peticion: PeticionProfesorDTO;
}>();

const emit = defineEmits(["cerrar", "accionRealizada"]);

const storePeticiones = usePeticionProfesorStore();
const storeUsuarios = useUsuarioStore();

const visible = ref(true);
const loading = ref(false);

async function aprobar() {
  loading.value = true;

  // 1. Cambiar el rol del usuario
  const rolActualizado = await storeUsuarios.aceptarUsuarioComoProfesor(props.peticion.idUsuario);

  // 2. Eliminar la petición si el rol fue cambiado correctamente
  if (rolActualizado) {
    const eliminada = await storePeticiones.rechazarPeticion(props.peticion.id); // mismo método que borrar
    if (eliminada) {
      emit("accionRealizada");
      emit("cerrar");
    }
  }

  loading.value = false;
}

async function rechazar() {
  loading.value = true;
  const ok = await storePeticiones.rechazarPeticion(props.peticion.id);
  loading.value = false;
  if (ok) {
    emit("accionRealizada");
    emit("cerrar");
  }
}
</script>

<template>
  <v-dialog v-model="visible" max-width="600">
    <v-card>
      <v-card-title class="text-h6">
        Petición de {{ peticion.user }}
      </v-card-title>
      <v-card-text>
        <p><strong>Documento:</strong>
          <a :href="peticion.documentoUrl" target="_blank" class="text-blue-500 underline">
            Ver documento
          </a>
        </p>
        <p class="mt-2"><strong>Motivo:</strong></p>
        <p>{{ peticion.razon }}</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green" @click="aprobar" :loading="loading">Aprobar</v-btn>
        <v-btn color="red" @click="rechazar" :loading="loading">Rechazar</v-btn>
        <v-btn @click="$emit('cerrar')">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
