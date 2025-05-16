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

    <v-chip color="primary" variant="elevated" @click="irA('/admin/cursos')">
      Cursos
    </v-chip>

    <v-chip color="blue-darken-4" class="salir" variant="elevated" @click="irA('/')">
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
