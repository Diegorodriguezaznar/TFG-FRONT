<!-- 
UploadPage.vue - Página principal para montar el componente de subida de videos 
-->
<template>
    <div class="upload-page">
      <h1 class="page-title">Sube tu video</h1>
      <p class="page-subtitle">Comienza a compartir tu contenido subiendo un archivo de video</p>
      
      <VideoUpload @upload-complete="handleUploadComplete" />
    </div>
  </template>
  
  <script>
  import VideoUpload from '../components/video/VideoUpload.vue';
  
  export default {
    name: 'UploadPage',
    components: {
      VideoUpload
    },
    methods: {
      handleUploadComplete(videoData) {
        // Aquí puedes redirigir al usuario a la página del video o mostrar un mensaje de éxito
        console.log('Video subido exitosamente:', videoData);
        // Por ejemplo: this.$router.push(`/videos/${videoData.id}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .upload-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  
  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #202124;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #dadce0;
    padding-bottom: 0.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
    color: #5f6368;
    margin-bottom: 2rem;
  }
  </style>