<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/UserAvatar.vue';

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
const esAdmin = computed(() => idRol.value === 3);

const menuItemsBase = [
  { title: 'Inicio', icon: 'mdi-home', route: '/cursos' },
  { title: 'Mis Cursos', icon: 'mdi-bookmark-multiple', route: '/mis-cursos' },
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

// Información del rol para mostrar
const rolInfo = computed(() => {
  const roles = {
    1: { name: 'Estudiante', color: 'green' },
    2: { name: 'Profesor', color: 'blue' },
    3: { name: 'Administrador', color: 'red' }
  };
  return roles[idRol.value] || { name: 'Usuario', color: 'grey' };
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
          'Sidebar__MenuItem',
          item.title === 'MarIAno' && 'Sidebar__MarIAno',
          item.title === 'Mis Cursos' && 'Sidebar__MisCursos',
          item.color === 'orange' && 'Sidebar__MenuItem--profesor',
          item.color === 'red' && 'Sidebar__MenuItem--admin'
        ]"
      >
        <!-- Tooltip para modo colapsado -->
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
          :subtitle="rolInfo.name"
          to="/perfil"
          class="Sidebar__UserItem"
        >
          <template v-slot:prepend>
            <UserAvatar
              :usuario="usuarioActual"
              :size="40"
              class="mr-2"
            />
          </template>
          <template v-slot:append>
            <v-chip 
              :color="rolInfo.color" 
              size="x-small"
              variant="elevated"
            >
              {{ rolInfo.name.substring(0, 3) }}
            </v-chip>
          </template>
        </v-list-item>
      </v-list>
    </div>
    
    <!-- Avatar compacto cuando está colapsado -->
    <div v-else-if="!isExpanded && !isMobile && usuarioActual" class="text-center py-2">
      <v-tooltip location="end">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="cursor-pointer" @click="$router.push('/perfil')">
            <UserAvatar
              :usuario="usuarioActual"
              :size="32"
            />
          </div>
        </template>
        <span>{{ usuarioActual.nombre }} ({{ rolInfo.name }})</span>
      </v-tooltip>
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

/* ------------------ Mis Cursos personalizado ------------------ */
.Sidebar__MisCursos {
  background: rgba(255, 152, 0, 0.08) !important;
  color: #FF9800 !important;
  font-weight: 600;
  border-left: 4px solid #FF9800;
  margin: 2px 8px;
  border-radius: 8px;
}

.Sidebar__MisCursos:hover {
  background: rgba(255, 152, 0, 0.15) !important;
  transform: translateX(2px);
  transition: all 0.2s ease;
}

.Sidebar__MisCursos .v-icon {
  color: #FF9800 !important;
}

.Sidebar__MisCursos .v-list-item__content {
  color: #FF9800 !important;
}

/* Item de usuario */
.Sidebar__UserItem {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.Sidebar__UserItem:hover {
  background: rgba(255, 152, 0, 0.08);
}

.cursor-pointer {
  cursor: pointer;
}
</style>