<template>
  <div class="wrap page-hero" style="max-width:720px">
    <h1>招新</h1>
    <p class="lede">填写登记表后，由管理层审核并开通账号。也可直接注册，提交后进入待审核状态。</p>
    <ol class="prose">
      <li>阅览部门介绍，确定意向。</li>
      <li>提交本表或完成注册。</li>
      <li>审核通过后，使用学号登录，即可报名活动与查阅资料。</li>
    </ol>
    <form class="form card" style="padding:22px;margin:24px 0 48px" @submit.prevent="submit">
      <div class="card-body" style="padding:0">
        <div class="form-row">
          <label>姓名<input v-model="form.name" required></label>
          <label>学号<input v-model="form.studentId" required></label>
        </div>
        <div class="form-row">
          <label>学院<input v-model="form.college" required></label>
          <label>年级<input v-model="form.grade" placeholder="2024 级" required></label>
        </div>
        <div class="form-row">
          <label>手机号<input v-model="form.phone" required></label>
          <label>QQ<input v-model="form.qq" required></label>
        </div>
        <label>邮箱<input v-model="form.email" type="email" required></label>
        <label>意向部门
          <select v-model="form.departmentId">
            <option value="">尚未确定</option>
            <option v-for="d in depts" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </label>
        <label>游戏方向（选填）<input v-model="form.gameDirection" placeholder="如：MOBA、Godot、像素美术"></label>
        <label>自我介绍（选填）<textarea v-model="form.intro" maxlength="200"></textarea></label>
        <p v-if="msg" :class="ok ? 'alert-ok alert' : 'alert'">{{ msg }}</p>
        <button class="btn btn-coral" :disabled="busy">提交登记</button>
        <p class="muted">已有账号请<NuxtLink to="/login">登录</NuxtLink>。需要立即开户请<NuxtLink to="/register">注册</NuxtLink>。</p>
      </div>
    </form>
  </div>
</template>

<script setup>
useHead({ title: '招新' })
const { data: depts } = await useFetch('/api/public/departments')
const form = reactive({
  name: '', studentId: '', college: '', grade: '', phone: '', qq: '', email: '', departmentId: '', gameDirection: '', intro: ''
})
const busy = ref(false)
const ok = ref(false)
const msg = ref('')
async function submit() {
  busy.value = true
  ok.value = false
  msg.value = ''
  try {
    await $fetch('/api/public/recruit', { method: 'POST', body: form })
    ok.value = true
    msg.value = '登记已提交。请同步完成注册，或等待审核通知。'
  } catch (e) {
    msg.value = e.data?.statusMessage || '提交未成功'
  } finally {
    busy.value = false
  }
}
</script>
