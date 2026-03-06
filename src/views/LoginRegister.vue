<template>
  <div class="login-page">
    <h1>登录 / 注册</h1>
    <div class="form-container">
      <label>用户名</label>
      <input v-model="name" placeholder="请输入用户名" />
      <label>密码</label>
      <input type="password" v-model="password" placeholder="请输入密码" />
      <button @click="proceed">继续</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const name = ref('')
const password = ref('')
const router = useRouter()
const userStore = useUserStore()

function proceed() {
  if (name.value.trim()) {
    userStore.setUsername(name.value.trim())
    router.push('/role')
  } else {
    alert('请输入用户名')
  }
}
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 80px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
input {
  padding: 6px 8px;
  border: 1px solid #bbb;
  border-radius: 4px;
}
button {
  padding: 8px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
