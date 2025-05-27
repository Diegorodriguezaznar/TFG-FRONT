<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';

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
const usuarioActual = computed(() => usuarioStore.usuarioActual);
const idRol = computed(() => usuarioActual.value?.idRol ?? 1);

const esProfesor = computed(() => idRol.value === 2 || idRol.value === 3);
const esAdmin = computed(() => idRol.value === 1);

const menuItemsBase = [
  { title: 'Inicio', icon: 'mdi-home', route: '/cursos' },
  { title: 'Explorar', icon: 'mdi-compass', route: '/explorar' },
  { title: 'Biblioteca', icon: 'mdi-folder', route: '/biblioteca' },
  { title: 'Historial', icon: 'mdi-history', route: '/historial' },
  { title: 'Favoritos', icon: 'mdi-star', route: '/favoritos' },
  { title: 'Profesores', icon: 'mdi-account-group', route: '/usuarios' },
  { title: 'MarIAno', icon: 'mdi-robot-outline', route: '/ia' },
  { title: 'Ranking', icon: 'mdi-chart-bar', route: '/ranking' },
  ...(esAdmin.value ? [
    { title: 'Hazte Profesor', icon: 'mdi-school', route: '/peticion-profesor' }
  ] : [])
];

const menuItemsAdmin = [
  { title: 'Panel Admin', icon: 'mdi-shield-crown', route: '/admin', color: 'red' }
];

const menuItems = computed(() => {
  let items = [...menuItemsBase];
  if (esAdmin.value) items.push(...menuItemsAdmin);
  return items;
});

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
    <div class="Sidebar__cabecera">
      <v-btn v-if="!isMobile" icon @click="toggleSidebar" size="small">
        <v-icon>{{ isExpanded ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
      </v-btn>
    </div>
    
    <v-divider />
    
    <v-list density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :value="item.title"
        :to="item.route"
        :title="isExpanded ? item.title : ''"
        :prepend-icon="item.icon" 
        :color="item.color"
        :class="[
          'Sidebar__item',
          item.title === 'MarIAno' && 'Sidebar__item--mariano',
          item.color === 'orange' && 'Sidebar__item--profesor',
          item.color === 'red' && 'Sidebar__item--admin'
        ]"
      >
        <template v-if="!isExpanded && !isMobile">
          <v-tooltip activator="parent" location="end">
            {{ item.title }}
          </v-tooltip>
        </template>
      </v-list-item>
    </v-list>
    
    <v-divider class="Sidebar__divider" />
    
    <div v-if="isExpanded && usuarioActual" class="Sidebar__usuario">
      <div class="Sidebar__usuario-titulo">Usuario Actual</div>
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
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/SideBar";
</style>