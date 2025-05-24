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
  { title: 'Quizzes', icon: 'mdi-school-outline', route: '/quizz-time!' },
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
        class="Sidebar__MenuItem"
      />
    </v-list>
    
    <v-divider class="my-2"></v-divider>
    
    <!-- Sección de canales suscritos (simplificado) -->
    <div v-if="isExpanded" class="px-3 py-2">
      <div class="text-subtitle-2 font-weight-medium mb-2">Canales suscritos</div>
      <v-list density="compact" nav>
        <v-list-item
          v-for="i in 5"
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

.Sidebar__MenuItem {
  margin-bottom: 4px;
  border-radius: 0;
}
</style>
