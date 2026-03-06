<template>
  <div class="role-page">
    <h1>选择角色</h1>
    <RoleSelect @confirm="onConfirm" />
  </div>
</template>

<script setup lang="ts">
import RoleSelect from '@/components/RoleSelect.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function onConfirm() {
  router.push('/scenario')
}
</script>

<style scoped>
.role-page {
  padding: 40px;
  text-align: center;
}
</style>
