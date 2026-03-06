<template>
  <div class="role-grid">
    <div
      v-for="role in roles"
      :key="role.id"
      :class="['role-card', selectedId === role.id ? 'active' : '']"
      @click="select(role.id)"
    >
      <img :src="role.icon" alt="" class="icon" />
      <h3>{{ role.name }}</h3>
      <p>{{ role.desc }}</p>
    </div>
    <button class="confirm-btn" :disabled="!selectedId" @click="confirm">确认</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const roles: Array<{ id: string; name: string; desc: string; icon: string }> = [
  { id: 'manager', name: '经理', desc: '负责决策与资源分配', icon: '/icons/manager.svg' },
  { id: 'engineer', name: '工程师', desc: '技术实现和风险把控', icon: '/icons/engineer.svg' },
  { id: 'tenant', name: '利益相关者', desc: '关注项目影响与伦理', icon: '/icons/tenant.svg' },
]

const selectedId = ref<string | null>(null)
const userStore = useUserStore()
const emit = defineEmits(['confirm'])

function select(id: string) {
  selectedId.value = id
  userStore.setRole(id)
}
function confirm() {
  if (selectedId.value) emit('confirm')
}
</script>

<style scoped>
.role-grid {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
.role-card {
  width: 160px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
}
.role-card.active {
  border-color: #3b82f6;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px);
}
.icon {
  width: 60px;
  height: 60px;
}
.confirm-btn {
  margin-top: 20px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.confirm-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
