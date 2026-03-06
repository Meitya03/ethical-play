<template>
  <div class="decision-buttons">
    <button v-for="opt in options" :key="opt.id" @click="choose(opt)">
      {{ opt.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ options: Array<{ id: string; text: string; weight: number }> }>()
const emit = defineEmits<{
  (e: 'choose', opt: { id: string; text; weight: number }): void
}>()

function choose(opt: { id: string; text: string; weight: number }) {
  emit('choose', opt)
}
</script>

<style scoped>
.decision-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}
.decision-buttons button {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
