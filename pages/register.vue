<template>
  <div class="wrap page-hero" style="max-width:640px">
    <h1>注册</h1>
    <p class="lede">提交后进入待审核。通过后使用同一学号登录。</p>
    <form class="form" style="margin:24px 0 64px" @submit.prevent="submit">
      <div class="form-row">
        <label>姓名<input v-model="form.name" required></label>
        <label>学号<input v-model="form.studentId" required></label>
      </div>
      <label>邮箱<input v-model="form.email" type="email" required></label>
      <div class="form-row">
        <label>密码（不少于 8 位）<input v-model="form.password" type="password" minlength="8" required></label>
        <label>学院<input v-model="form.college" required></label>
      </div>
      <div class="form-row">
        <label>年级<input v-model="form.grade" required></label>
        <label>手机号<input v-model="form.phone" required></label>
      </div>
      <div class="form-row">
        <label>QQ<input v-model="form.qq" required></label>
        <label>意向部门
          <select v-model="form.departmentId">
            <option value="">尚未确定</option>
            <option v-for="d in depts" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </label>
      </div>
      <label>游戏方向<input v-model="form.gameDirection"></label>
      <p v-if="msg" class="alert">{{ msg }}</p>
      <button class="btn btn-coral" :disabled="busy">提交注册</button>
    </form>
  </div>
</template>

<script setup>
useHead({ title: '注册' })
const { data: depts } = await useFetch('/api/public/departments')
const { refresh } = useAuth()
const form = reactive({
  name: '', studentId: '', email: '', password: '', college: '', grade: '', phone: '', qq: '', departmentId: '', gameDirection: ''
})
const busy = ref(false)
const msg = ref('')
async function submit() {
  busy.value = true
  msg.value = ''
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: form })
    await refresh()
    await navigateTo('/pending')
  } catch (e) {
    msg.value = e.data?.statusMessage || '注册未成功'
  } finally {
    busy.value = false
  }
}
</script>
