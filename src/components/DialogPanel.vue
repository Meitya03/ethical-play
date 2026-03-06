<template>
  <div class="dialog-panel">
    <div v-for="(m, idx) in messages" :key="idx">{{ m }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ messages: string[] }>()
</script>

<style scoped>
.dialog-panel {
  padding: 12px;
  font-size: 16px;
}
</style>
