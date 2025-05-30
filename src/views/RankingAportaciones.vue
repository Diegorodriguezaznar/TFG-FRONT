<script setup lang="ts">
import { ref } from 'vue'
import HeaderRanking from '@/components/Layout/HeaderRanking.vue'
import Sidebar from '@/components/Layout/Sidebar.vue'
import GraficoUsuariosVideos from '@/components/Graficos/GraficoUsuariosVideos.vue'

const drawer = ref(false)
</script>

<template>
  <v-app>
    <HeaderRanking @toggle-sidebar="drawer = !drawer" />

    <v-main class="RankingPage">
      <Sidebar v-model="drawer" />

      <div class="RankingPage__Banner">
        <div class="RankingPage__BannerOverlay">
          <v-container class="RankingPage__BannerContent">
            <div class="RankingPage__BannerText">
              <v-icon size="48" class="RankingPage__BannerIcon">mdi-trophy</v-icon>
              <h1 class="RankingPage__BannerTitle">Ranking de Aportaciones</h1>
            </div>
          </v-container>
        </div>
      </div>

      <v-container class="RankingPage__Container">
        <v-card class="RankingPage__Card" elevation="3">
          <v-card-title class="RankingPage__CardHeader">
            <v-icon class="RankingPage__CardIcon">mdi-chart-bar</v-icon>
            <span class="RankingPage__CardTitle">Top Contribuidores</span>
            <v-spacer></v-spacer>
          </v-card-title>
          
          <v-card-text class="RankingPage__CardContent">
            <GraficoUsuariosVideos />
          </v-card-text>
        </v-card>


      </v-container>
    </v-main>
        <v-footer app height="64" class="AsignaturaCrear__Footer">
          <span>&copy; {{ new Date().getFullYear() }} AcademIQ</span>
        </v-footer>
  </v-app>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/pages/RankingPage";
</style>