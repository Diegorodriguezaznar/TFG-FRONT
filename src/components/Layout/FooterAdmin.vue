<script setup lang="ts">
// No se requieren props o importaciones complejas para este componente simple
</script>

<template>
  <footer class="admin-footer">
    <div class="footer-content">
      <p>&copy; {{ new Date().getFullYear() }} - Panel de Administración</p>
      <div class="footer-links">
        <a href="#">Ayuda</a>
        <a href="#">Documentación</a>
        <a href="#">Contacto</a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/layout/FooterAdmin";
</style>