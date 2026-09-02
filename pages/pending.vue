<template>
  <div class="wrap page-hero" style="max-width:560px">
    <h1>待审核</h1>
    <p class="lede">账号已提交，审核通过后方可报名、签到与下载资料。公开页面仍可浏览。</p>
    <p class="muted">{{ user?.name }} · {{ user?.studentId }}</p>
    <div class="hero-actions">
      <NuxtLink to="/" class="btn btn-ghost">返回首页</NuxtLink>
      <button class="btn btn-ink" @click="logout">退出</button>
    </div>
  </div>
</template>

<script setup>
useHead({ title: '待审核' })
const { user, logout, refresh } = useAuth()
await refresh()
if (user.value && user.value.status === 'active' && user.value.role !== 'pending') {
  await navigateTo('/')
}
</script>
