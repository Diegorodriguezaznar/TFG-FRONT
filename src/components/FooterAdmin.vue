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

<style scoped>
.admin-footer {
  background-color: #808080;
  color: white;
  padding: 1rem;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

p {
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.footer-links a:hover {
  opacity: 0.8;
  text-decoration: underline;
}
</style>