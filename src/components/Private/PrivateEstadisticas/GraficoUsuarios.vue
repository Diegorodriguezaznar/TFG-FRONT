<template>
  <v-card class="pa-4">
    <v-card-title>Estadísticas de Usuarios por Rol</v-card-title>
    <Bar :data="chartData" :options="chartOptions" v-if="chartData" />
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

interface RolEstadisticaDTO {
  rol: string
  total: number
}

const chartData = ref<any>(null)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Distribución de Usuarios por Rol',
    },
  },
}

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:5190/api/usuario/estadisticas-roles')
    if (!response.ok) throw new Error('Error al obtener los datos')

    const datos: RolEstadisticaDTO[] = await response.json()

    chartData.value = {
      labels: datos.map(d => d.rol),
      datasets: [
        {
          label: 'Usuarios',
          backgroundColor: '#FF5500',
          data: datos.map(d => d.total),
        },
      ],
    }
  } catch (error) {
    console.error('Error cargando datos del gráfico:', error)
  }
})
</script>
