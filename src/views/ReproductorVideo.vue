<script setup>
// --------------------------- Imports ---------------------------
import { ref, onMounted } from 'vue';
import VideoPlayer from '../components/VideoPlayer.vue';
import VideoInfo from '../components/VideoInfo.vue';
import VideoSuggestions from '../components/VideoSuggestions.vue';
import VideoComments from '../components/VideoComments.vue';
import Header from '../components/Header.vue';
import Sidebar from '../components/Sidebar.vue';

// --------------------------- Variables ---------------------------
const sidebarOpen = ref(true);
const searchQuery = ref('');
const currentVideo = ref({
  id: 'video1',
  title: '¿Te Arriesgarías A Ahogarte Por $500,000?',
  channel: 'MrBeast',
  views: '2.3M',
  publishedDate: 'Hace 2 días',
  likes: '156K',
  description: 'En este desafío extremo, los participantes compiten por un premio de $500,000 en una serie de pruebas acuáticas que pondrán a prueba sus límites. ¿Qué harías tú por esta cantidad de dinero?',
  duration: '24:45',
  avatar: 'https://picsum.photos/seed/mrbeast/40/40',
  videoUrl: 'https://example.com/video1.mp4',
  subscribers: '201M'
});

// Lista de videos sugeridos
const suggestedVideos = ref([
  {
    id: 'video2',
    title: 'Sobreviví A Los 5 Lugares Más Mortales En La Tierra',
    channel: 'MrBeast',
    views: '11M',
    publishedDate: 'Hace 1 semana',
    duration: '17:23',
    thumbnail: 'https://picsum.photos/seed/video2/320/180',
    avatar: 'https://picsum.photos/seed/mrbeast/40/40'
  },
  {
    id: 'video3',
    title: '100 Personas, 100 Círculos, 1 Ganador de $500,000',
    channel: 'MrBeast',
    views: '17M',
    publishedDate: 'Hace 2 semanas',
    duration: '38:38',
    thumbnail: 'https://picsum.photos/seed/video3/320/180',
    avatar: 'https://picsum.photos/seed/mrbeast/40/40'
  },
  {
    id: 'video4',
    title: 'Vencí A Ronaldo, Gané $1,000,000',
    channel: 'MrBeast',
    views: '25M',
    publishedDate: 'Hace 5 días',
    duration: '22:42',
    thumbnail: 'https://picsum.photos/seed/video4/320/180',
    avatar: 'https://picsum.photos/seed/mrbeast/40/40'
  },
  {
    id: 'video5',
    title: 'Láser vs Rayo - ¿Cuál es más poderoso?',
    channel: 'Mark Rober',
    views: '7M',
    publishedDate: 'Hace 3 días',
    duration: '23:15',
    thumbnail: 'https://picsum.photos/seed/video5/320/180',
    avatar: 'https://picsum.photos/seed/markrober/40/40'
  }
]);

// Lista de comentarios
const comments = ref([
  {
    id: 'comment1',
    user: 'Laura García',
    avatar: 'https://picsum.photos/seed/user1/40/40',
    content: 'Increíble video, definitivamente yo no me arriesgaría por esa cantidad. ¡La salud es primero!',
    likes: 1204,
    time: 'hace 1 día'
  },
  {
    id: 'comment2',
    user: 'Carlos Mendoza',
    avatar: 'https://picsum.photos/seed/user2/40/40',
    content: 'MrBeast siempre superándose. Cada reto es más extremo que el anterior.',
    likes: 856,
    time: 'hace 12 horas'
  },
  {
    id: 'comment3',
    user: 'Ana Torres',
    avatar: 'https://picsum.photos/seed/user3/40/40',
    content: 'Yo participaría sin dudarlo. La recompensa vale totalmente la pena por ese desafío.',
    likes: 432,
    time: 'hace 6 horas'
  }
]);

// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const updateSearch = (query) => {
  searchQuery.value = query;
  console.log('Buscando:', query);
  // Aquí iría la lógica de búsqueda
};

const handleVideoSelect = (videoId) => {
  // Aquí iría la lógica para cambiar el video actual
  console.log('Video seleccionado:', videoId);
  
  // Simulación de cambio de video (en una app real, haríamos una petición al backend)
  const selectedVideo = suggestedVideos.value.find(v => v.id === videoId);
  if (selectedVideo) {
    currentVideo.value = {
      ...selectedVideo,
      description: 'Descripción del nuevo video seleccionado. En una aplicación real, esto vendría del backend.',
      likes: Math.floor(Math.random() * 100) + 'K',
      videoUrl: `https://example.com/${videoId}.mp4`
    };
  }
};

const addComment = (newComment) => {
  comments.value.unshift({
    id: `comment${comments.value.length + 1}`,
    user: 'Usuario actual',
    avatar: 'https://picsum.photos/seed/currentuser/40/40',
    content: newComment,
    likes: 0,
    time: 'ahora mismo'
  });
};
</script>

<template>
  <v-app>
    <!-- Header -->
    <Header @toggle-sidebar="toggleSidebar" @update-search="updateSearch" />
    
    <!-- Sidebar -->
    <Sidebar v-model="sidebarOpen" />
    
    <!-- Contenido principal -->
    <v-main :class="{ 'ml-240': sidebarOpen, 'ml-80': !sidebarOpen }">
      <v-container fluid class="pa-0 pa-sm-4">
        <v-row>
          <!-- Columna del reproductor y la información -->
          <v-col cols="12" md="8" lg="9">
            <!-- Reproductor de video -->
            <VideoPlayer :video="currentVideo" />
            
            <!-- Información del video -->
            <VideoInfo :video="currentVideo" />
            
            <!-- Comentarios -->
            <VideoComments 
              :comments="comments" 
              @add-comment="addComment" 
            />
          </v-col>
          
          <!-- Columna de videos sugeridos -->
          <v-col cols="12" md="4" lg="3">
            <VideoSuggestions 
              :videos="suggestedVideos" 
              @select-video="handleVideoSelect" 
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.ml-240 {
  margin-left: 240px;
}

.ml-80 {
  margin-left: 80px;
}

@media (max-width: 960px) {
  .ml-240,
  .ml-80 {
    margin-left: 0;
  }
}
</style>