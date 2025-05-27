<script setup lang="ts">
</script>

<template>
  <header class="AdminHeader">
    <div class="AdminHeader__contenido">
      <h1 class="AdminHeader__titulo">Panel de Administración</h1>
      <nav class="AdminHeader__nav">
        <ul class="AdminHeader__lista">
          <li class="AdminHeader__item">
            <router-link to="/cursos" class="AdminHeader__enlace">Volver a Cursos</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/HeaderAdmin";
</style>