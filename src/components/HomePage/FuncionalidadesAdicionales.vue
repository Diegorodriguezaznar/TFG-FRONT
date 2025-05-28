<template>
  <section class="FuncionalidadesAdicionales">
    <v-container>
      <div class="FuncionalidadesAdicionales__Header">
        <h2 class="FuncionalidadesAdicionales__Title">Más Herramientas para Tu Éxito</h2>
        <p class="FuncionalidadesAdicionales__Subtitle">
          Funcionalidades adicionales que enriquecen tu experiencia de aprendizaje
        </p>
      </div>

      <v-row class="FuncionalidadesAdicionales__Grid" no-gutters>
        <!-- Profesores -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-account-group"
              color="orange"
              titulo="Conoce a los Profesores"
              descripcion="Explora los perfiles de nuestros educadores expertos y descubre su experiencia y especialidades."
              ruta="/usuarios"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- Mis Cursos -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-bookmark-multiple"
              color="green"
              titulo="Mis Cursos"
              descripcion="Accede rápidamente a los cursos en los que estás inscrito y continúa donde lo dejaste."
              ruta="/mis-cursos"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- IA Asistente -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-robot-outline"
              color="cyan"
              titulo="MarIAno IA"
              descripcion="Chatea con nuestro asistente de IA para resolver dudas y obtener ayuda personalizada."
              ruta="/ia"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>

        <!-- Hazte Profesor -->
        <v-col cols="12" sm="6" md="6" lg="3" xl="3">
          <div class="FuncionalidadesAdicionales__CardWrapper">
            <AdditionalCard
              icono="mdi-school"
              color="indigo"
              titulo="Hazte Profesor"
              descripcion="¿Tienes conocimientos que compartir? Solicita convertirte en profesor y crea tu propio contenido."
              ruta="/peticion-profesor"
              @navegar="$emit('navegar', $event)"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import AdditionalCard from '@/components/HomePage/AdditionalCard.vue';

// Emits
defineEmits<{
  navegar: [ruta: string];
}>();
</script>

<style scoped>
.FuncionalidadesAdicionales {
  padding: 80px 0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.FuncionalidadesAdicionales__Header {
  text-align: center;
  margin-bottom: 60px;
}

.FuncionalidadesAdicionales__Title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}

.FuncionalidadesAdicionales__Subtitle {
  font-size: 1.2rem;
  color: #666;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.FuncionalidadesAdicionales__Grid {
  margin: 0 -8px;
}

.FuncionalidadesAdicionales__CardWrapper {
  padding: 8px;
}

/* Forzar 4 cards en línea desde MD breakpoint */
@media (min-width: 960px) {
  .FuncionalidadesAdicionales__Grid {
    display: flex;
    flex-wrap: nowrap;
    margin: 0 -12px;
  }
  
  .FuncionalidadesAdicionales__Grid .v-col {
    flex: 1;
    min-width: 0;
    max-width: none;
  }
  
  .FuncionalidadesAdicionales__CardWrapper {
    padding: 12px;
  }
}

/* Responsive para pantallas menores */
@media (max-width: 959px) {
  .FuncionalidadesAdicionales {
    padding: 60px 0;
  }
  
  .FuncionalidadesAdicionales__Title {
    font-size: 2rem;
  }
  
  .FuncionalidadesAdicionales__Header {
    margin-bottom: 40px;
  }
}

@media (max-width: 599px) {
  .FuncionalidadesAdicionales__Grid {
    margin: 0;
  }
  
  .FuncionalidadesAdicionales__CardWrapper {
    padding: 8px 0;
  }
}
</style>