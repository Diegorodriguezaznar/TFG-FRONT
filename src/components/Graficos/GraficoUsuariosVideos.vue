<template>
  <v-card class="pa-4 mt-6">
    <v-card-title>Usuarios con más vídeos subidos</v-card-title>
    <div style="position: relative; height: 400px;">
      <Bar :data="chartData" :options="chartOptions" v-if="chartData" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface UsuarioVideosDTO {
  nombreUsuario: string
  totalVideos: number
}

const chartData = ref<any>(null)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y' as const, // ← barras horizontales
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Top 10 usuarios por número de vídeos subidos',
    },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
    },
  },
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5000/api/usuario/top-usuarios-videos')
    if (!response.ok) throw new Error('Error al obtener los datos')

    const datos: UsuarioVideosDTO[] = await response.json()

    chartData.value = {
      labels: datos.map(u => u.nombreUsuario),
      datasets: [
        {
          label: 'Vídeos subidos',
          backgroundColor: '#F7A277',
          data: datos.map(u => u.totalVideos),
        },
      ],
    }
  } catch (error) {
    console.error('Error cargando gráfico de usuarios con más vídeos:', error)
  }
})
</script>
