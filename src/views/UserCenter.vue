<template>
  <div class="user-page">
    <h1>个人中心</h1>
    <div v-if="userStore.username">
      <p>用户名：{{ userStore.username }}</p>
      <p>角色：{{ userStore.role }}</p>
    </div>
    <h2>历史记录</h2>
    <ul>
      <li v-for="h in userStore.history" :key="h.id">
        [{{ h.timestamp }}] {{ h.sceneTitle }} - 选项 {{ h.choiceId }} (评分 {{ h.aiScore }})
      </li>
    </ul>
    <h2>徽章</h2>
    <ul>
      <li v-for="b in userStore.unlockedBadges" :key="b.id">{{ b.name }}：{{ b.description }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.user-page {
  padding: 40px;
}
</style>
