<script setup>
// --------------------------- Imports ---------------------------
import { ref, computed, onMounted } from 'vue';
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import Filtros from '@/components/Filtros.vue';
import Sugerencias from '@/components/Sugerencias.vue';
import ListaVideos from '@/components/ListaVideos.vue';

// --------------------------- Variables ---------------------------
const drawer = ref(false);
const searchQuery = ref('');
const filtroSeleccionado = ref('Todos');

// --------------------------- Videos ---------------------------
const videos = ref([]);

// --------------------------- Fetch de videos ---------------------------
const fetchVideos = async () => {
  try {
    // En un caso real, esta sería una llamada a tu API
    // Simulamos una respuesta con datos de ejemplo
    videos.value = [
      {
        id: 1,
        titulo: 'Introducción a las ecuaciones',
        asignatura: 'Mates',
        thumbnail: 'https://picsum.photos/id/10/300/200',
        autor: 'Profesor García',
        vistas: '10K',
        fecha: 'Hace 2 días'
      },
      {
        id: 2,
        titulo: 'Análisis de "Don Quijote"',
        asignatura: 'Lengua',
        thumbnail: 'https://picsum.photos/id/20/300/200',
        autor: 'Profesora Martínez',
        vistas: '5.2K',
        fecha: 'Hace 1 semana'
      },
      {
        id: 3,
        titulo: 'La Segunda Guerra Mundial',
        asignatura: 'Historia',
        thumbnail: 'https://picsum.photos/id/30/300/200',
        autor: 'Profesor López',
        vistas: '8.7K',
        fecha: 'Hace 3 días'
      },
      {
        id: 4,
        titulo: 'Elementos químicos básicos',
        asignatura: 'Química',
        thumbnail: 'https://picsum.photos/id/40/300/200',
        autor: 'Profesora Sánchez',
        vistas: '3.9K',
        fecha: 'Hace 5 días'
      },
      {
        id: 5,
        titulo: 'La célula y sus partes',
        asignatura: 'Biología',
        thumbnail: 'https://picsum.photos/id/50/300/200',
        autor: 'Profesor Rodríguez',
        vistas: '7.3K',
        fecha: 'Hace 1 día'
      },
      {
        id: 6,
        titulo: 'Presente simple en inglés',
        asignatura: 'Inglés',
        thumbnail: 'https://picsum.photos/id/60/300/200',
        autor: 'Profesora Wilson',
        vistas: '6.5K',
        fecha: 'Hace 4 días'
      },
      {
        id: 7,
        titulo: 'Fuerzas y movimiento',
        asignatura: 'Física',
        thumbnail: 'https://picsum.photos/id/70/300/200',
        autor: 'Profesor Hernández',
        vistas: '4.2K',
        fecha: 'Hace 2 semanas'
      },
      {
        id: 8,
        titulo: 'Perspectiva en el dibujo',
        asignatura: 'Arte',
        thumbnail: 'https://picsum.photos/id/80/300/200',
        autor: 'Profesora Gómez',
        vistas: '2.8K',
        fecha: 'Hace 6 días'
      }
    ];
  } catch (error) {
    console.error("Error al obtener los videos:", error);
  }
};

// --------------------------- Filtrar videos ---------------------------
const videosFiltrados = computed(() => {
  let resultado = videos.value;
  
  // Filtrar por término de búsqueda
  if (searchQuery.value) {
    resultado = resultado.filter(video => 
      video.titulo.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  
  // Filtrar por asignatura seleccionada
  if (filtroSeleccionado.value !== 'Todos') {
    resultado = resultado.filter(video => 
      video.asignatura === filtroSeleccionado.value
    );
  }
  
  return resultado;
});

// --------------------------- Sugerencias de videos ---------------------------
const videosSugeridos = computed(() => {
  // Simplemente muestra los 4 más recientes (en una aplicación real podría ser basado en algoritmos)
  return videos.value.slice(0, 4);
});

// --------------------------- Actualizar búsqueda ---------------------------
const actualizarBusqueda = (query) => {
  searchQuery.value = query;
};

// --------------------------- Actualizar filtro ---------------------------
const actualizarFiltro = (filtro) => {
  filtroSeleccionado.value = filtro;
};

// --------------------------- Cargar datos al montar ---------------------------
onMounted(() => {
  fetchVideos();
});
</script>

<template>
  <v-app>
    <!-- --------------------------- Header --------------------------- -->
    <Header 
      @toggle-sidebar="drawer = !drawer" 
      @update-search="actualizarBusqueda"
    />
    
    <!-- --------------------------- Contenedor principal --------------------------- -->
    <v-main class="HomePage">
      <!-- --------------------------- Sidebar --------------------------- -->
      <Sidebar v-model="drawer" />
      
      <!-- --------------------------- Contenido principal --------------------------- -->
      <v-container class="HomePage__Contenedor">
        <!-- --------------------------- Filtros por asignatura --------------------------- -->
        <Filtros 
          @filtro-seleccionado="actualizarFiltro" 
          :filtro-actual="filtroSeleccionado"
        />
        
        <v-divider class="my-2"></v-divider>
        
        <!-- --------------------------- Sugerencias --------------------------- -->
        <Sugerencias :videos="videosSugeridos" />
        
        <v-divider class="my-4"></v-divider>
        
        <!-- --------------------------- Lista de videos --------------------------- -->
        <ListaVideos :videos="videosFiltrados" />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.HomePage {
  background-color: #f9f9f9;
  min-height: 100vh;
}

.HomePage__Contenedor {
  padding-top: 16px;
  max-width: 1800px;
}

@media (max-width: 600px) {
  .HomePage__Contenedor {
    padding: 8px;
  }
}
</style>