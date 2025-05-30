<!-- src/views/UsuariosPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsuarioStore } from '@/stores/Usuario';
import HeaderUsuarios from '@/components/Layout/HeaderUsuarios.vue';
import Sidebar from '@/components/Layout/Sidebar.vue';
import CardUsuario from '@/components/Usuarios/CardUsuario.vue';
import type { UsuarioDTO } from '@/stores/dtos/UsuarioDTO';

// Store
const usuarioStore = useUsuarioStore();

// Variables
const drawer = ref(false);
const searchQuery = ref('');
const loading = ref(false);

// Computed - Solo mostrar profesores (rol 2)
const usuariosFiltrados = computed(() => {
  let usuarios = usuarioStore.usuarios.filter(usuario => usuario.idRol === 2); // Solo profesores
  
  // Filtrar por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    usuarios = usuarios.filter(usuario => 
      usuario.nombre.toLowerCase().includes(query) ||
      (usuario.apellidos && usuario.apellidos.toLowerCase().includes(query)) ||
      `${usuario.nombre} ${usuario.apellidos || ''}`.toLowerCase().includes(query)
    );
  }
  
  return usuarios;
});

// Métodos
const toggleSidebar = () => {
  drawer.value = !drawer.value;
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

const cargarUsuarios = async () => {
  loading.value = true;
  try {
    await usuarioStore.fetchAllUsuarios();
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  cargarUsuarios();
});
</script>

<template>
  <v-app>
    <!-- Header personalizado para usuarios -->
    <HeaderUsuarios 
      @toggle-sidebar="toggleSidebar"
      @search="handleSearch"
    />
    
    <!-- Contenedor principal -->
    <v-main class="UsuariosPage">
      <!-- Sidebar -->
      <Sidebar v-model="drawer" />
      
      <!-- Contenido -->
      <v-container class="UsuariosPage__Container">
        <!-- Estado de carga -->
        <div v-if="loading" class="d-flex justify-center my-8">
          <v-progress-circular indeterminate color="orange" size="64"></v-progress-circular>
        </div>
        
        <!-- Título y estadísticas -->
        <div v-else class="UsuariosPage__Header mb-6">
          <div class="d-flex align-center justify-space-between flex-wrap">
            <div>
              <h1 class="text-h4 font-weight-bold text-orange mb-2">
                Nuestros Profesores
              </h1>
              <p class="text-subtitle-1 text-grey-darken-1">
                Conoce a los educadores que hacen posible el aprendizaje
              </p>
            </div>
            
            <div class="UsuariosPage__Stats d-flex flex-column align-end">
              <v-chip color="orange" variant="elevated" size="large" class="mb-2">
                <v-icon start>mdi-account-tie</v-icon>
                {{ usuariosFiltrados.length }} profesores encontrados
              </v-chip>
              <v-chip color="white" variant="outlined" size="small">
                Total: {{ usuarioStore.usuarios.filter(u => u.idRol === 2).length }} profesores
              </v-chip>
            </div>
          </div>
        </div>
        
        <!-- Mensaje sin resultados -->
        <div v-if="!loading && usuariosFiltrados.length === 0" class="text-center py-12">
          <v-icon color="grey-lighten-2" size="64" class="mb-4">mdi-account-search</v-icon>
          <h3 class="text-h6 text-grey-darken-1 mb-2">No se encontraron profesores</h3>
          <p class="text-body-1 text-grey">
            {{ searchQuery ? 'Prueba con otro término de búsqueda' : 'No hay profesores disponibles' }}
          </p>
        </div>
        
        <!-- Grid de usuarios -->
        <div v-else-if="!loading" class="UsuariosPage__Grid">
          <v-row>
            <v-col 
              v-for="usuario in usuariosFiltrados" 
              :key="usuario.idUsuario"
              cols="12" 
              sm="6" 
              md="4" 
              lg="3"
            >
              <CardUsuario :usuario="usuario" />
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.UsuariosPage {
  background: linear-gradient(135deg, #fff5f0 0%, #ffffff 50%, #fff8f5 100%);
  min-height: 100vh;
}

.UsuariosPage__Container {
  padding-top: 24px;
  max-width: 1400px;
}

.UsuariosPage__Header {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(255, 152, 0, 0.1);
  border: 1px solid rgba(255, 152, 0, 0.2);
}

.UsuariosPage__Stats {
  text-align: right;
}

.UsuariosPage__Grid {
  animation: fadeIn 0.6s ease-in-out;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@media (max-width: 600px) {
  .UsuariosPage__Container {
    padding: 16px;
  }
  
  .UsuariosPage__Header {
    padding: 16px;
  }
  
  .UsuariosPage__Stats {
    text-align: left;
    margin-top: 16px;
  }
}
</style>