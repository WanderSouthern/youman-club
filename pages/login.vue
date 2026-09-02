<template>
  <div class="wrap page-hero" style="max-width:480px">
    <h1>登录</h1>
    <p class="lede">使用学号与密码。新账号须经审核后方可报名与查阅资料。</p>
    <form class="form" style="margin: 24px 0 64px" @submit.prevent="onLogin">
      <label>学号<input v-model="studentId" autocomplete="username" required></label>
      <label>密码<input v-model="password" type="password" autocomplete="current-password" required></label>
      <p v-if="msg" class="alert">{{ msg }}</p>
      <button class="btn btn-coral" :disabled="busy">登录</button>
      <p class="muted">没有账号？<NuxtLink to="/register">注册</NuxtLink> · <NuxtLink to="/recruit">招新登记</NuxtLink></p>
    </form>
  </div>
</template>

<script setup>
useHead({ title: '登录' })
const { login } = useAuth()
const studentId = ref('')
const password = ref('')
const busy = ref(false)
const msg = ref('')
const route = useRoute()
async function onLogin() {
  busy.value = true
  msg.value = ''
  try {
    const data = await login(studentId.value, password.value)
    if (data.user.role === 'pending' || data.user.status !== 'active') {
      await navigateTo('/pending')
    } else {
      await navigateTo(route.query.redirect || '/')
    }
  } catch (e) {
    msg.value = e.data?.statusMessage || '学号或密码不正确'
  } finally {
    busy.value = false
  }
}
</script>
