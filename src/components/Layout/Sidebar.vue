<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
import { useUsuarioLogeadoStore } from '@/stores/UsuarioLogeado';
import UserAvatar from '@/components/Common/UserAvatar.vue';

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
const router = useRouter();

const usuarioStore = useUsuarioLogeadoStore();
const usuarioActual = computed(() => usuarioStore.usuarioActual);
const idRol = computed(() => usuarioActual.value?.idRol ?? 1);

const esProfesor = computed(() => idRol.value === 2 || idRol.value === 3);
const esAdmin = computed(() => idRol.value === 3);

const menuItemsBase = [
  { title: 'Inicio', icon: 'mdi-home', route: '/home', hoverColor: 'orange' },
  { title: 'Cursos', icon: 'mdi-book', route: '/cursos', hoverColor: 'blue' },
  { title: 'Explorar', icon: 'mdi-compass', route: '/explorar', hoverColor: 'red' },
  { title: 'Mis Cursos', icon: 'mdi-bookmark-multiple', route: '/mis-cursos', hoverColor: 'blue' },
  { title: 'Favoritos', icon: 'mdi-heart', route: '/favoritos', hoverColor: 'pink'  },
  { title: 'MarIAno', icon: 'mdi-robot-outline', route: '/ia', hoverColor: 'light-blue' },
  { title: 'Profesores', icon: 'mdi-account-group', route: '/usuarios', hoverColor: 'orange' },
  { title: 'Ranking', icon: 'mdi-chart-bar', route: '/ranking', hoverColor: 'gold' },
    ...(esProfesor.value ? [
    { title: 'Crear Curso', icon: 'mdi-plus-box', route: '/crear-curso', hoverColor: 'blue' }
  ] : []),
  ...(idRol.value === 1 ? [
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

const logout = () => {
  usuarioStore.cerrarSesion();
  router.push('/login');
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
          item.color === 'red' && 'Sidebar__MenuItem--admin',
          item.color === 'primary' && 'Sidebar__MenuItem--crear-curso',
          item.hoverColor === 'orange' && 'Sidebar__MenuItem--hover-orange',
          item.hoverColor === 'blue' && 'Sidebar__MenuItem--hover-blue',
          item.hoverColor === 'red' && 'Sidebar__MenuItem--hover-red',
          item.hoverColor === 'light-blue' && 'Sidebar__MenuItem--hover-light-blue',
          item.hoverColor === 'pink' && 'Sidebar__MenuItem--hover-pink',
          item.hoverColor === 'gold' && 'Sidebar__MenuItem--hover-gold'
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
    
    <!-- Botón de logout -->
    <div v-if="usuarioActual" class="Sidebar__logout">
      <v-list density="compact">
        <v-list-item
          @click="logout"
          :title="isExpanded ? 'Cerrar Sesión' : ''"
          prepend-icon="mdi-logout"
          class="Sidebar__MenuItem Sidebar__MenuItem--logout"
        >
          <template v-if="!isExpanded && !isMobile">
            <v-tooltip activator="parent" location="end">
              Cerrar Sesión
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>
    </div>
    
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
  position: fixed !important;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
}

.Sidebar__MenuItem--admin {
  background: rgba(244, 67, 54, 0.05);
  border-radius: 8px;
  margin: 2px 8px;
}

.Sidebar__MenuItem--admin:hover {
  background: rgba(244, 67, 54, 0.1);
}

.Sidebar__MenuItem--crear-curso {
  background: rgba(25, 118, 210, 0.05);
  border-radius: 8px;
  margin: 2px 8px;
  font-weight: 500;
}

.Sidebar__MenuItem--crear-curso:hover {
  background: rgba(25, 118, 210, 0.1);
}

/* Hover para Inicio - Naranja más oscuro */
.Sidebar__MenuItem--hover-orange:hover {
  background: rgba(255, 111, 0, 0.1);
  color: #e65100;
}

.Sidebar__MenuItem--hover-orange:hover .v-icon {
  color: #e65100 !important;
}

/* Hover para Cursos y Mis Cursos - Azul */
.Sidebar__MenuItem--hover-blue:hover {
  background: rgba(33, 150, 243, 0.1);
  color: #1976d2;
}

.Sidebar__MenuItem--hover-blue:hover .v-icon {
  color: #1976d2 !important;
}

/* Hover para Explorar - Rojo */
.Sidebar__MenuItem--hover-red:hover {
  background: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.Sidebar__MenuItem--hover-red:hover .v-icon {
  color: #d32f2f !important;
}

/* Hover para MarIAno - Azul claro */
.Sidebar__MenuItem--hover-light-blue:hover {
  background: rgba(3, 169, 244, 0.1);
  color: #0288d1;
}

.Sidebar__MenuItem--hover-light-blue:hover .v-icon {
  color: #0288d1 !important;
}

/* Hover para Favoritos - Rosa */
.Sidebar__MenuItem--hover-pink:hover {
  background: rgba(233, 30, 99, 0.1);
  color: #c2185b;
}

.Sidebar__MenuItem--hover-pink:hover .v-icon {
  color: #c2185b !important;
}

/* Hover para Ranking - Dorado */
.Sidebar__MenuItem--hover-gold:hover {
  background: rgba(255, 193, 7, 0.1);
  color: #f57c00;
}

.Sidebar__MenuItem--hover-gold:hover .v-icon {
  color: #f57c00 !important;
}

.Sidebar__MenuItem {
  margin: 1px 4px;
  border-radius: 6px;
}

.Sidebar__MenuItem--logout {
  color: #f44336 !important;
  transition: all 0.2s ease;
}

.Sidebar__MenuItem--logout:hover {
  background: rgba(244, 67, 54, 0.05);
  color: #d32f2f !important;
}

.Sidebar__MenuItem--logout .v-icon {
  color: #f44336 !important;
}

.Sidebar__logout {
  margin-top: auto;
  padding: 8px 0;
}

/* Item de usuario */
.Sidebar__UserItem {
  border-radius: 8px;
  margin: 4px 0;
  transition: all 0.2s ease;
}

.Sidebar__UserItem:hover {
  background: rgba(0, 0, 0, 0.05);
}

.cursor-pointer {
  cursor: pointer;
}

.Sidebar__usuario-titulo {
  font-size: 0.75rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 8px 16px 4px;
  font-weight: 600;
}

.Sidebar__divider {
  margin: 8px 0;
}
</style>
