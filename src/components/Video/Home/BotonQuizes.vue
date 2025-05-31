<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  cursoId?: number | null;
  show?: boolean;
}

interface Emits {
  (e: 'click'): void;
}

const props = withDefaults(defineProps<Props>(), {
  cursoId: null,
  show: true
});

const emit = defineEmits<Emits>();
const router = useRouter();

const navegarAQuizzes = () => {
  if (props.cursoId) {
    router.push(`/curso/${props.cursoId}`);
  } else {
    router.push('/cursos');
  }
  
  emit('click');
};

const tooltipText = computed(() => {
  return props.cursoId ? 'Quizzes' : 'Todos los Quizzes';
});
</script>

<template>
  <Transition name="QuizzesFloatingBtn__fade" appear>
    <v-btn
      v-if="show"
      @click="navegarAQuizzes"
      class="QuizzesFloatingBtn"
      color="deep-purple"
      size="large"
      elevation="8"
      rounded="xl"
    >
      <v-icon size="28">mdi-school</v-icon>
      
      <v-tooltip activator="parent" location="top">
        {{ tooltipText }}
      </v-tooltip>
    </v-btn>
  </Transition>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/components/Home/BotonQuizes";
</style>