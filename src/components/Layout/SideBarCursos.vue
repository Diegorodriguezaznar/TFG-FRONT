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

const allMenuItems = [
  { title: 'Inicio', icon: 'mdi-home', route: '/cursos' },
  { title: 'Mis Cursos', icon: 'mdi-folder', route: '/mis-cursos' },
  { title: 'Favoritos', icon: 'mdi-star', route: '/favoritos' },
  { title: 'Crear Curso', icon: 'mdi-plus-box', route: '/crear-curso', rolesPermitidos: [2, 3] },
  { title: 'Hazte Profesor', icon: 'mdi-school', route: '/peticion-profesor' }
];

const menuItems = computed(() => {
  const rol = usuarioStore.usuarioActual?.idRol;
  if (!rol) return [];
  return allMenuItems.filter(item => {
    if (!item.rolesPermitidos) return true;
    return item.rolesPermitidos.includes(rol);
  });
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
    
    <v-list v-if="usuarioStore.usuarioActual" density="compact" nav>
      <v-list-item
        v-for="item in menuItems"
        :key="item.title"
        :value="item.title"
        :to="item.route"
        :title="isExpanded ? item.title : ''"
        :prepend-icon="item.icon"
        class="Sidebar__item"
      >
        <template v-if="!isExpanded && !isMobile">
          <v-tooltip activator="parent" location="end">
            {{ item.title }}
          </v-tooltip>
        </template>
      </v-list-item>
    </v-list>
    
    <v-divider class="Sidebar__divider" />
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/SideBarCursos";
</style>