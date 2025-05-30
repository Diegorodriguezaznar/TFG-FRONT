<template>
    <div class="logo-container" @mouseover="isHovered = true" @mouseleave="isHovered = false">
      <svg viewBox="0 0 200 200">
        <!-- Parte 1: Base y sombra -->
        <g :transform="isHovered ? 'translate(0, 5) scale(1.05)' : 'translate(0, 0) scale(1)'">
          <!-- Sombra -->
          <rect x="40" y="60" width="120" height="140" rx="10" ry="10" fill="#A0522D" opacity="0.5"/>
          
          <!-- Base del bloc de notas -->
          <rect x="30" y="50" width="120" height="140" rx="10" ry="10" fill="#FF5500"/>
        </g>
        
        <!-- Parte 2: Papel -->
        <g :transform="isHovered ? 'translate(0, -3) scale(0.98)' : 'translate(0, 0) scale(1)'">
          <!-- Papel -->
          <rect x="35" y="55" width="110" height="110" rx="5" ry="5" fill="#EEEEEE" stroke="#FB7C3C" stroke-width="3"/>
          
          <!-- Líneas del texto -->
          <rect x="50" y="80" width="80" height="8" rx="3" ry="3" fill="#333"/>
          <rect x="50" y="100" width="80" height="8" rx="3" ry="3" fill="#333"/>
          <rect x="50" y="120" width="80" height="8" rx="3" ry="3" fill="#333"/>
        </g>
        
        <!-- Parte 3: Anillas -->
        <g :transform="isHovered ? 'translate(0, -8) scale(1.1)' : 'translate(0, 0) scale(1)'">
          <!-- Anillas -->
          <circle cx="50" cy="45" r="7" fill="#F7A277"/>
          <circle cx="80" cy="45" r="7" fill="#F7A277"/>
          <circle cx="110" cy="45" r="7" fill="#F7A277"/>
          <circle cx="140" cy="45" r="7" fill="#F7A277"/>
        </g>
      </svg>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotebookLogo',
    data() {
      return {
        isHovered: false
      }
    }
  }
  </script>
  
  <style scoped>
  .logo-container {
    width: 200px;
    height: 200px;
    cursor: pointer;
  }
  
  svg g {
    transition: all 0.3s ease;
  }
  </style>