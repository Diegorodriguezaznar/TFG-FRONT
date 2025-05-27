<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import VideoUpload from '@/components/SubirVideo/VideoUpload.vue';
import Header from '@/components/Layout/Header.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';

// --------------------------- Actualizar búsqueda ---------------------------
const actualizarBusqueda = (query: string) => {
  searchQuery.value = query;
};
// --------------------------- Variables ---------------------------
const drawer = ref(false);
const searchQuery = ref('');

// --------------------------- Router ---------------------------
const router = useRouter();

// --------------------------- Métodos ---------------------------
const handleUploadComplete = (videoData: any) => {
  console.log('Video subido exitosamente:', videoData);
  // Aquí puedes redirigir al usuario a la página del video o mostrar un mensaje de éxito
  // router.push(`/videos/${videoData.id}`);
};
</script>

<template>
<v-app>

      <Header 
      @toggle-sidebar="drawer = !drawer" 
      @update-search="actualizarBusqueda"/>
  <div class="UploadPage">
    <v-container>

            <Sidebar v-model="drawer" />

      <v-row justify="center">
        <v-col cols="12" md="10" lg="8">
          <div class="UploadPage__Header text-center mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">Sube tu video</h1>
            <p class="text-subtitle-1">Comienza a compartir tu contenido subiendo un archivo de video</p>
          </div>
          
          <VideoUpload @upload-complete="handleUploadComplete" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</v-app>

</template>

<style scoped>
.UploadPage {
  padding: 32px 0;
  background-color: #f9f9f9;
  min-height: 100vh;
}

.UploadPage__Header {
  margin-top: 8%;
  margin-bottom: 5%;
}
</style>