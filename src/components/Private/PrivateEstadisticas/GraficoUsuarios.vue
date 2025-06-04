<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

interface RolEstadisticaDTO {
  rol: string
  total: number
}

const chartData = ref<any>(null)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: 'Distribución porcentual de usuarios por rol',
    },
  },
}

onMounted(async () => {
  try {
    const response = await fetch('https://academiqapi.retocsv.es/api/usuario/estadisticas-roles')
    if (!response.ok) throw new Error('Error al obtener los datos')

    const datos: RolEstadisticaDTO[] = await response.json()

    chartData.value = {
      labels: datos.map(d => d.rol),
      datasets: [
        {
          label: 'Usuarios',
          data: datos.map(d => d.total),
          backgroundColor: ['#FF5500', '#FB7C3C', '#F7A277', '#EEEEEE'],
        },
      ],
    }
  } catch (error) {
    console.error('Error cargando datos del gráfico:', error)
  }
})
</script>

<template>
  <v-card class="pa-4">
    <v-card-title>Proporción de Usuarios por Rol</v-card-title>
    <div style="position: relative; height: 300px;">
      <Pie :data="chartData" :options="chartOptions" v-if="chartData" />
    </div>
  </v-card>
</template>
