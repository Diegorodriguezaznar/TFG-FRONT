<script setup lang="ts">
// No se requieren props o importaciones complejas para este componente simple
</script>

<template>
  <header class="admin-header">
    <div class="header-content">
      <h1>Panel de Administración</h1>
      <nav>
        <ul>
          <li><router-link to="/cursos">Volver a Cursos</router-link></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.admin-header {
  background-color: #ff7424;
  color: white;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  margin-left: 1.5rem;
}

nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

nav a:hover, nav a.router-link-active {
  text-decoration: underline;
  opacity: 0.9;
}
</style>