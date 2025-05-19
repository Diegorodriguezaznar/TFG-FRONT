<template>
  <div class="logo-container">
    <div class="logo">
      <v-icon size="40" color="deep-orange darken-1">mdi-notebook</v-icon>
      <span class="logo-text">AcademIQ</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoteBookLogo'
}
</script>

<style scoped>
.logo-container {
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  background: linear-gradient(to right, #FF6F00, #FFA000);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>