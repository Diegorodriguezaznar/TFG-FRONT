<template>
    <div class="logo-container">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 120" width="360" height="120">
            <!-- Letras estáticas -->
            <text x="30" y="85" font-family="serif" font-style="italic" font-size="55" fill="white">Academ</text>
            
            <!-- Letra I animada (más cerca) -->
            <text x="215" y="85" font-family="serif" font-style="italic" font-size="55" fill="#4f46e5">
              I
              <animate 
                attributeName="y" 
                values="85; 50; 90; 70; 85" 
                dur="1.5s" 
                keyTimes="0; 0.3; 0.5; 0.8; 1"
                keySplines="0.5 0 0.5 1; 0.3 0 0.7 1; 0.25 0.1 0.25 1; 0.5 0 0.5 1"
                calcMode="spline"
                repeatCount="indefinite" />
            </text>
            
            <!-- Letra Q animada (más cerca) -->
            <text x="243" y="85" font-family="serif" font-style="italic" font-size="55" fill="#4f46e5">
              Q
              <animate 
                attributeName="y" 
                values="85; 50; 90; 70; 85" 
                dur="1.5s" 
                begin="0.2s"
                keyTimes="0; 0.3; 0.5; 0.8; 1"
                keySplines="0.5 0 0.5 1; 0.3 0 0.7 1; 0.25 0.1 0.25 1; 0.5 0 0.5 1"
                calcMode="spline"
                repeatCount="indefinite" />
            </text>
        </svg>
    </div>
</template>

<style scoped>
.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

svg {
  width: 100%;
  height: auto;
  max-width: 360px;
}
</style>