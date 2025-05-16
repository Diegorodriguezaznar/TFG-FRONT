// FRONTEND: TFG-FRONT/src/components/FormButton.vue
<template>
  <button 
    :type="type" 
    class="form-button"
    :class="{ 'primary': primary }"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FormButton',
  props: {
    type: {
      type: String,
      default: 'button'
    },
    primary: {
      type: Boolean,
      default: true
    }
  }
});
</script>

<style scoped>
.form-button {
  display: inline-block;
  width: 100%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
}

.form-button.primary {
  background-color: #6366f1;
  color: white;
}

.form-button.primary:hover {
  background-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-button.primary:active {
  transform: translateY(0);
}
</style>