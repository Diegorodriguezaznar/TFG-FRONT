<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, onMounted, computed } from "vue";
import CardComentario from "@/components/CardComentario.vue";
import { useComentarioStore } from "@/stores/Comentario";
import { useUsuarioLogeadoStore } from "@/stores/UsuarioLogeado";

// --------------------------- Propiedades del componente ---------------------------
const props = defineProps<{ 
  archivoId: number; 
}>();

// --------------------------- Emisión de eventos ---------------------------
const emit = defineEmits(["comentarioCargado"]);

// --------------------------- Almacenar comentarios ---------------------------
const comentarios = ref([]);

// --------------------------- Obtener usuario logeado ---------------------------
const usuarioLogeadoStore = useUsuarioLogeadoStore();
const usuarioActual = computed(() => usuarioLogeadoStore.usuarioActual);

// --------------------------- Variables ---------------------------
const nuevoComentario = ref("");
const cargando = ref(false);
const comentarioStore = useComentarioStore();
const errorMensaje = ref("");

// --------------------------- Mostrar comentarios (fetch) ---------------------------
async function mostrarComentarios() {
  cargando.value = true;
  
  try {
    const datos = await comentarioStore.fetchComentariosByArchivoId(props.archivoId);
    
    comentarios.value = datos.map(c => ({
      id: c.idComentario,
      usuario: `Usuario ${c.idUsuario}`,
      avatar: `https://i.pravatar.cc/40?u=${c.idUsuario}`,
      texto: c.contenido,
      fecha: new Date(c.fechaCreacion).toLocaleDateString()
    }));
    
    emit("comentarioCargado", comentarios.value.length);
  } catch (error) {
    console.error("Error:", error);
    comentarios.value = [];
  }
  
  cargando.value = false;
}

// --------------------------- Añadir comentario (fetch) ---------------------------
async function añadirComentario() {
  console.log("Intentando enviar comentario con usuario:", usuarioActual.value);

  if (!nuevoComentario.value.trim()) return;

  if (!usuarioActual.value || !usuarioActual.value.id) {
    return;
  }

  try {
    const comentarioObj = {
      idComentario: 0,
      contenido: nuevoComentario.value.trim(),
      idUsuario: usuarioActual.value.id,
      idArchivo: props.archivoId,
      fechaCreacion: new Date().toISOString()
    };

    console.log("Enviando comentario:", comentarioObj);
    
    const resultado = await comentarioStore.createComentario(comentarioObj);
    
    if (resultado) {
      nuevoComentario.value = "";
      errorMensaje.value = "";
      await mostrarComentarios();
    } else {
      errorMensaje.value = "No se pudo publicar el comentario.";
      console.error("No se pudo crear el comentario");
    }
  } catch (error) {
    console.error("Error al publicar comentario:", error);
    errorMensaje.value = "Ocurrió un error al publicar el comentario.";
  }
}

// --------------------------- Montar el componente ---------------------------
onMounted(() => {
  usuarioLogeadoStore.cargarUsuarioDesdeStorage(); 
  mostrarComentarios();
});

</script>

<template>
  <div class="ListaComentarios">
    <!-- --------------------------- Título y separador --------------------------- -->
    <h3>Comentarios</h3>
    <v-divider></v-divider>

    <!-- --------------------------- Lista de comentarios --------------------------- -->
    <div class="lista">
      <v-progress-circular v-if="cargando" indeterminate color="orange"></v-progress-circular>
      <template v-else>
        <CardComentario v-for="comentario in comentarios" :key="comentario.id" :comentario="comentario" />
        <p v-if="comentarios.length === 0">Los comentarios se implementarán próximamente.</p>
      </template>
    </div>

    <!-- --------------------------- Mensaje de error --------------------------- -->
    <p v-if="errorMensaje" class="ListaComentarios__Error">{{ errorMensaje }}</p>

    <!-- --------------------------- Sección para nuevo comentario --------------------------- -->
    <div class="nueva-entrada">
      <v-text-field
        v-model="nuevoComentario"
        label="Escribe un comentario..."
        @keyup.enter="añadirComentario"
      ></v-text-field>

      <v-btn color="orange" icon @click="añadirComentario">
        <v-icon>mdi-send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
  @import "@/assets/sass/components/Lists/Lcomentarios.scss";
</style>
