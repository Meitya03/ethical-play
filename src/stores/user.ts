import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

type HistoryEntry = {
  id: number
  sceneId: string
  sceneTitle: string
  choiceId: string
  resultText: string
  aiScore: number
  timestamp: string
}

type Badge = {
  id: string
  name: string
  description: string
  unlocked: boolean
}

export const useUserStore = defineStore('user', () => {
  const username = ref<string | null>(null)
  const role = ref<string | null>(null)
  const history = ref<HistoryEntry[]>([])
  const badges = ref<Badge[]>([
    { id: 'first-decision', name: '第一步', description: '做出第一条决策', unlocked: false },
    { id: 'ten-decisions', name: '十次决策', description: '累积十次决策', unlocked: false },
    // 更多徽章可在此添加
  ])

  function setUsername(name: string) {
    username.value = name
  }
  function setRole(roleId: string) {
    role.value = roleId
  }
  function addHistory(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
    const newEntry: HistoryEntry = {
      ...entry,
      id: history.value.length + 1,
      timestamp: new Date().toISOString(),
    }
    history.value.push(newEntry)
    updateBadges()
  }
  function updateBadges() {
    const count = history.value.length
    badges.value.forEach((b) => {
      if (!b.unlocked) {
        if (b.id === 'first-decision' && count >= 1) b.unlocked = true
        if (b.id === 'ten-decisions' && count >= 10) b.unlocked = true
      }
    })
  }
  const unlockedBadges = computed(() => badges.value.filter((b) => b.unlocked))

  return { username, role, history, badges, unlockedBadges, setUsername, setRole, addHistory }
})
