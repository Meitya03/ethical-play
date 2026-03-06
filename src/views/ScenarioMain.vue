<template>
  <div class="scenario-page">
    <div class="left">
      <ScenarioCanvas />
    </div>
    <div class="right">
      <DialogPanel :messages="messages" />
    </div>
    <div class="bottom">
      <DecisionButtons :options="options" @choose="onChoose" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScenarioCanvas from '@/components/ScenarioCanvas.vue'
import DialogPanel from '@/components/DialogPanel.vue'
import DecisionButtons from '@/components/DecisionButtons.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// mock messages and options
const messages = ref<string[]>([
  '场景介绍：你是一名工程师，面临伦理困境。',
  '上司：你怎么处理这个问题？',
])
const options = ref([
  { id: 'a', text: '遵循规章', weight: 80 },
  { id: 'b', text: '寻求妥协', weight: 60 },
  { id: 'c', text: '忽视风险', weight: 20 },
])

function onChoose(option: { id: string; text: string; weight: number }) {
  // calculate result
  const score = Math.round(option.weight * (0.8 + Math.random() * 0.4))
  const resultText = `你选择了\"${option.text}\"，系统给出的反馈。`
  userStore.addHistory({
    sceneId: 'default',
    sceneTitle: '示例场景',
    choiceId: option.id,
    resultText,
    aiScore: score,
  })
  router.push({ name: 'feedback', state: { resultText, aiScore: score } })
}
</script>

<style scoped>
.scenario-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.left,
.right {
  flex: 1;
  padding: 16px;
}
.left {
  background: #f5f5f5;
}
.right {
  background: #fff;
  overflow: auto;
}
.bottom {
  padding: 12px;
  border-top: 1px solid #ddd;
}
</style>
