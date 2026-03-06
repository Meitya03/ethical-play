<template>
  <div class="feedback-page">
    <h1>决策反馈</h1>
    <p>{{ resultText }}</p>
    <p>AI 评分：{{ aiScore }} 分</p>
    <button @click="toScenario">返回情景</button>
    <button @click="toUser">查看个人中心</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const resultText = ref('')
const aiScore = ref(0)

onMounted(() => {
  const current = router.currentRoute.value as any
  const state = current.state
  if (state) {
    resultText.value = state.resultText || ''
    aiScore.value = state.aiScore || 0
  }
})

function toScenario() {
  router.push('/scenario')
}
function toUser() {
  router.push('/user')
}
</script>

<style scoped>
.feedback-page {
  padding: 40px;
  text-align: center;
}
button {
  margin: 8px;
  padding: 8px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
