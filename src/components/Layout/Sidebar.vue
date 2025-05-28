<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useRouter } from 'vue-router';
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
const router = useRouter();

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
  { title: 'Favoritos', icon: 'mdi-star', route: '/favoritos' },
  { title: 'Profesores', icon: 'mdi-account-group', route: '/usuarios' },
  { title: 'MarIAno', icon: 'mdi-robot-outline', route: '/ia' },
  { title: 'Ranking', icon: 'mdi-chart-bar', route: '/ranking' },
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