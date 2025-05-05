<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, defineProps, defineEmits, watch } from "vue";
import ListaComentarios from "@/components/ListaComentarios.vue";

// --------------------------- Propiedades ---------------------------
const props = defineProps<{ 
  archivo: { 
    id: number;
    nombre: string;
    url: string 
  } 
  | null; 
  abierto: boolean 
}>();

// --------------------------- Emitir eventos ---------------------------
const emit = defineEmits(["cerrar"]);

// --------------------------- Variables ---------------------------
const cantidadComentarios = ref(0);

// --------------------------- Manejo de evento de comentarios cargados ---------------------------
const onComentariosCargados = (cantidad: number) => {
  cantidadComentarios.value = cantidad;
};
</script>

<template>
  <!-- --------------------------- Modal del archivo y comentarios --------------------------- -->
  <v-dialog v-model="props.abierto" max-width="1000px">
    <v-card class="ArchivoComentario__Contenedor">
      
      <!-- --------------------------- Título del archivo --------------------------- -->
      <v-card-title>
        {{ props.archivo ? props.archivo.nombre : 'Sin archivo seleccionado' }}
        <span v-if="cantidadComentarios > 0" class="ArchivoComentario__ContadorComentarios">({{ cantidadComentarios }} comentarios)</span>
      </v-card-title>
      
      <v-divider></v-divider>
    
      <v-card-text class="ArchivoComentario__Contenido">
        <!-- --------------------------- Vista previa del archivo --------------------------- -->
        <div class="ArchivoComentario__VerArchivo">
          
          <!-- Imágenes -->
          <img
            v-if="props.archivo?.url && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(props.archivo.url)"
            :src="props.archivo.url"
            alt="Vista previa de imagen"
            style="max-width: 100%; max-height: 400px;"
          />

          <!-- PDFs -->
          <iframe
            v-else-if="props.archivo?.url && /\.pdf$/i.test(props.archivo.url)"
            :src="props.archivo.url"
            width="100%"
            height="400px"
          ></iframe>

          <!-- Vídeos -->
          <video
            v-else-if="props.archivo?.url && /\.(mp4|webm|ogg)$/i.test(props.archivo.url)"
            :src="props.archivo.url"
            controls
            width="100%"
            height="400px"
          ></video>

          <!-- Archivos no renderizables directamente (Word y otros) -->
          <div v-else-if="props.archivo?.url">
            <v-alert type="info" class="mt-2">
              Este tipo de archivo no se puede previsualizar. Puedes <a :href="props.archivo.url" target="_blank">descargarlo aquí</a>.
            </v-alert>
          </div>

          <!-- Error si no hay archivo o la URL no es válida -->
          <div v-else class="ArchivoComentario__ErrorVerArchivo">
            <p>No hay archivo seleccionado o la URL no es válida</p>
          </div>
        </div>

        <!-- --------------------------- Listado de comentarios --------------------------- -->
        <ListaComentarios 
          v-if="props.archivo && (props.archivo.id || props.archivo.idArchivo)"
          :archivoId="props.archivo.id || props.archivo.idArchivo" 
          @comentarioCargado="onComentariosCargados"
        />
      </v-card-text>

      <!-- --------------------------- Botones del modal --------------------------- -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" @click="emit('cerrar')">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
  @import "@/assets/sass/components/Models/M_ArchivoComentarios.scss";
</style>
