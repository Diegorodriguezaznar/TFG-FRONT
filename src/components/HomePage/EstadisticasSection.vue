<template>
  <section class="banner-section">
    <v-container>
      <v-row class="align-center justify-center banner-container">
        <div class="images-row">
          <!-- Imagen circular izquierda -->
          <v-col cols="12" md="3" class="text-center">
            <div class="circular-image left">
              <div class="image-bg fran-image"></div>
              <p class="image-text">Fran Rebollo</p>
            </div>
          </v-col>

          <!-- Imagen rectangular central -->
          <v-col cols="12" md="6" class="text-center">
            <div class="rectangular-image center">
              <div class="image-bg banner-image"></div>
            </div>
          </v-col>

          <!-- Imagen circular derecha -->
          <v-col cols="12" md="3" class="text-center">
            <div class="circular-image right">
              <div class="image-bg diego-image"></div>
              <p class="image-text">Diego Rodriguez</p>
            </div>
          </v-col>
        </div>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  name: 'EstadisticasSection'
}
</script>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/EstadisticasSection";
</style>