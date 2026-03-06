<template>
  <div class="canvas-container">
    <!-- placeholder graphic, could be HTML canvas later -->
    <div class="canvas-placeholder">场景画布区域</div>
  </div>
</template>

<script setup lang="ts">
// nothing for now
</script>

<style scoped>
.canvas-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e0e0;
}
.canvas-placeholder {
  font-size: 18px;
  color: #666;
}
</style>
