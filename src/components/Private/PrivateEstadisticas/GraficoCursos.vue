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

interface CursoVideosDTO {
  nombreCurso: string
  totalVideos: number
}

const chartData = ref<any>(null)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Cursos con mayor número de vídeos',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 },
    },
  },
}

onMounted(async () => {
  try {
    const response = await fetch('http://34.198.50.70:3000/api/curso/top-cursos-videos')
    if (!response.ok) throw new Error('Error al obtener los datos de cursos')

    const datos: CursoVideosDTO[] = await response.json()

    chartData.value = {
      labels: datos.map(c => c.nombreCurso),
      datasets: [
        {
          label: 'Número de vídeos',
          backgroundColor: '#FB7C3C',
          data: datos.map(c => c.totalVideos),
        },
      ],
    }
  } catch (error) {
    console.error('Error cargando gráfico de cursos:', error)
  }
})
</script>

<template>
  <v-card class="pa-4 mt-6">
    <v-card-title>Top 4 Cursos por Número de Vídeos</v-card-title>
    <div style="position: relative; height: 300px;">
      <Bar :data="chartData" :options="chartOptions" v-if="chartData" />
    </div>
  </v-card>
</template>

