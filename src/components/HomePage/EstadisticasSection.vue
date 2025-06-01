<template>
  <section class="EstadisticasSection">
    <v-container>
      <v-row class="align-center justify-center">
        <!-- Imagen circular izquierda -->
        <v-col cols="10" md="2" class="text-center">
          <div class="EstadisticasSection__ProfileCard">
            <div class="EstadisticasSection__Avatar">
              <v-img
                src="../../images/Fran.PNG"
                alt="Francisco Rebollo"
                class="EstadisticasSection__ProfileImage"
              ></v-img>
            </div>
            <p class="EstadisticasSection__ProfileName">Francisco Rebollo</p>
          </div>
        </v-col>

        <!-- Imagen rectangular central -->
        <v-col cols="12" md="6" class="text-center">
          <div class="EstadisticasSection__CentralImage">
            <v-img
              src="@/assets/images/imagen-central.jpg"
              alt="Imagen Central"
              class="EstadisticasSection__MainImage"
            ></v-img>
          </div>
        </v-col>

        <!-- Imagen circular derecha -->
        <v-col cols="10" md="2" class="text-center">
          <div class="EstadisticasSection__ProfileCard">
            <div class="EstadisticasSection__Avatar">
              <v-img
                src="../../images/Diego.PNG"
                alt="Diego Rodríguez"
                class="EstadisticasSection__ProfileImage"
              ></v-img>
            </div>
            <p class="EstadisticasSection__ProfileName">Diego Rodríguez</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<style scoped lang="scss">
@import "@/assets/sass/components/HomePage/EstadisticasSection";
</style>