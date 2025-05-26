<!-- src/components/Layout/Sidebar.vue - Actualizado con permisos de rol -->
<script setup lang="ts">
// --------------------------- Imports ---------------------------
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

// --------------------------- Variables ---------------------------
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue']);

const isExpanded = ref(true);
const { mobile } = useDisplay();
const isMobile = computed(() => mobile.value);
const usuarioStore = useUsuarioLogeadoStore();

// --------------------------- Computed ---------------------------
const usuarioActual = computed(() => usuarioStore.usuarioActual);

// Verificar si es profesor (rol 2) o gestor (rol 3)
const esProfesor = computed(() => {
  const rol = usuarioActual.value?.idRol;
  return rol === 2 || rol === 3;
});

// Verificar si es admin (rol 1)
const esAdmin = computed(() => {
  const rol = usuarioActual.value?.idRol;
  return rol === 1;
});

// --------------------------- Menú base ---------------------------
const menuItemsBase = [
  { title: 'Inicio', icon: 'mdi-home', route: '/' },

// --------------------------- Usuario y Rol ---------------------------
const usuarioStore = useUsuarioLogeadoStore();
const idRol = computed(() => usuarioStore.usuarioActual?.idRol ?? 1);

// --------------------------- Menú ---------------------------
const allMenuItems = [
  { title: 'Inicio', icon: 'mdi-home', route: '/cursos' },
  { title: 'Explorar', icon: 'mdi-compass', route: '/explorar' },
  { title: 'Biblioteca', icon: 'mdi-folder', route: '/biblioteca' },
  { title: 'Historial', icon: 'mdi-history', route: '/historial' },
  { title: 'Favoritos', icon: 'mdi-star', route: '/favoritos' },
  { title: 'Usuarios', icon: 'mdi-account-group', route: '/usuarios' },
  { title: 'Quizzes', icon: 'mdi-school-outline', route: '/quizz-time!' },
  { title: 'MarIAno', icon: 'mdi-robot-outline', route: '/ia' },

  { title: 'Subir Video', icon: 'mdi-upload', route: '/subir-video' }
];

// Elementos adicionales para profesores
const menuItemsProfesores = [
  { title: 'Crear Quiz', icon: 'mdi-plus-circle', route: '/admin/crear-quiz', color: 'orange' }
];

// Elementos para administradores
const menuItemsAdmin = [
  { title: 'Panel Admin', icon: 'mdi-shield-crown', route: '/admin', color: 'red' }
];

// Menú dinámico según el rol
const menuItems = computed(() => {
  let items = [...menuItemsBase];
  
  // Agregar elementos para profesores
  if (esProfesor.value) {
    items.push(...menuItemsProfesores);
  }
  
  // Agregar elementos para administradores
  if (esAdmin.value) {
    items.push(...menuItemsAdmin);
  }
  
  return items;
});

  { title: 'Hazte Profesor', icon: 'mdi-school', route: '/peticion-profesor' }
];

const menuItems = computed(() =>
  allMenuItems.filter(item => {
    if (!item.rolesPermitidos) return true;
    return item.rolesPermitidos.includes(idRol.value);
  })
);


// --------------------------- Métodos ---------------------------
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};

const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="!isExpanded && !isMobile"
    :permanent="!isMobile"
    :width="isExpanded ? 240 : 80"
    class="Sidebar"
  >
    <!-- Cabecera del sidebar -->
    <div class="d-flex align-center justify-space-between pa-2">
      <v-btn v-if="!isMobile" icon @click="toggleSidebar" size="small">
        <v-icon>{{ isExpanded ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
      </v-btn>
    </div>
    
    <v-divider></v-divider>
    
    <!-- Menú de navegación -->
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :value="item.title"
        :to="item.route"
        :title="isExpanded ? item.title : ''"
        :prepend-icon="item.icon" 
        :class="['Sidebar__MenuItem', item.title === 'MarIAno' && 'Sidebar__MarIAno']"

        :color="item.color"
        class="Sidebar__MenuItem"

        :class="{ 
          'Sidebar__MenuItem--profesor': item.color === 'orange',
          'Sidebar__MenuItem--admin': item.color === 'red'
        }"
      >
        <!-- Tooltip para modo colapsado -->
        <template v-if="!isExpanded && !isMobile">
          <v-tooltip activator="parent" location="end">
            {{ item.title }}
          </v-tooltip>
        </template>
      </v-list-item>
 
      />
    </v-list>
    
    <v-divider class="my-2"></v-divider>
    
    <!-- Información del usuario (solo si está expandido) -->
    <div v-if="isExpanded && usuarioActual" class="px-3 py-2">
      <div class="text-subtitle-2 font-weight-medium mb-2">Usuario Actual</div>
      <v-list density="compact">
        <v-list-item
          :title="usuarioActual.nombre"
          :subtitle="esAdmin ? 'Administrador' : esProfesor ? 'Profesor' : 'Estudiante'"
          prepend-avatar="https://picsum.photos/seed/user/40/40"
          to="/perfil"
        >
          <template v-slot:append>
            <v-chip 
              :color="esAdmin ? 'red' : esProfesor ? 'orange' : 'blue'" 
              size="x-small"
            >
              {{ esAdmin ? 'Admin' : esProfesor ? 'Prof' : 'Est' }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </div>
    
    <!-- Sección de canales suscritos (simplificado) -->
    <div v-if="isExpanded" class="px-3 py-2">
      <div class="text-subtitle-2 font-weight-medium mb-2">Canales suscritos</div>
      <v-list density="compact" nav>
        <v-list-item
          v-for="i in 3"
          :key="i"
          :title="`Canal ${i}`"
          prepend-avatar="https://picsum.photos/seed/picsum/40/40"
        />
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<style scoped>
.Sidebar {
  background-color: white;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.Sidebar__MenuItem--profesor {
  background: rgba(255, 152, 0, 0.05);
  border-radius: 8px;
  margin: 2px 8px;
}

.Sidebar__MenuItem--profesor:hover {
  background: rgba(255, 152, 0, 0.1);
}

.Sidebar__MenuItem--admin {
  background: rgba(244, 67, 54, 0.05);
  border-radius: 8px;
  margin: 2px 8px;
}

.Sidebar__MenuItem--admin:hover {
  background: rgba(244, 67, 54, 0.1);
}

.Sidebar__MenuItem {
  margin: 1px 4px;
  border-radius: 6px;
}

/* ------------------ MarIAno personalizado ------------------ */
.Sidebar__MarIAno {
  color: #ff6600 !important;
  font-weight: bold;
  font-family: 'Courier New', monospace;
  border-left: 4px solid #f88112;
}

.Sidebar__MarIAno .v-icon {
  color: #e08105 !important;
}
</style>
