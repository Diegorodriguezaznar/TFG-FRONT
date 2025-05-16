// FRONTEND: TFG-FRONT/src/components/FormCard.vue
<template>
  <div class="form-card">
    <h2 class="card-title">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormCard',
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>
.form-card {
  width: 500px; /* Aumentado de 420px o max-width */
  margin: 40px auto;
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(5px);
}

.card-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 550px) {
  .form-card {
    width: 90%;
    padding: 20px;
  }
}
</style>