<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function irA(ruta: string) {
  router.push(ruta)
}
</script>

<template>
  <div class="admin-menu-chips">
    <v-chip color="primary" variant="elevated" @click="irA('/admin/usuarios')">
      Usuarios
    </v-chip>

    <v-chip color="green" variant="elevated" @click="irA('/admin/cursos')">
      Cursos
    </v-chip>

    <v-chip color="red lighten-4" variant="elevated" @click="irA('/admin/reportes')">
      Videos Reportados
    </v-chip>
    
    <v-chip color="red darken-2" variant="elevated" @click="irA('/admin/comentarios-reportados')">
      Comentarios Reportados
    </v-chip>

    <v-chip color="purple lighten-2" variant="elevated" @click="irA('/admin/peticiones-profesor')">
      Peticiones de Profesor
    </v-chip>

    <v-chip color="orange lighten-3" variant="elevated" @click="irA('/admin/estadisticas')">
      Estadisticas
    </v-chip>

    <v-chip color="franydiego" class="salir" variant="elevated" @click="irA('/')">
      Salir del panel
    </v-chip>
  </div>
</template>

<style scoped lang="scss">
.admin-menu-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  padding: 1rem;

  .salir {
    color: white;
  }

  @media (min-width: 768px) {
    justify-content: flex-start;
    padding-left: 2rem;
  }
}
</style>
