<template>
  <div>
    <div class="member-row" style="margin-bottom:22px;gap:14px">
      <Avatar :name="user?.name" :user-id="user?.id" :avatar="user?.avatar" :size="56" />
      <div>
        <h1 style="margin:0">{{ user?.name }}</h1>
        <p class="muted">{{ displayTitle(user) }} · {{ user?.studentId }}</p>
      </div>
    </div>
    <div class="cards" style="margin: 8px 0 22px">
      <article class="card"><div class="card-body"><h3>{{ mine?.events?.length || 0 }}</h3><p class="muted">已报名</p></div></article>
      <article class="card"><div class="card-body"><h3>{{ mine?.checkinCount || 0 }}</h3><p class="muted">已签到</p></div></article>
    </div>
    <div class="section-h"><h2>近期报名</h2><NuxtLink to="/app/events" class="link-btn">全部</NuxtLink></div>
    <div class="cards">
      <article v-for="e in mine?.events?.slice(0,3)" :key="e.id" class="card">
        <div class="hue-bar" :class="'hue-' + e.coverHue" />
        <div class="card-body">
          <h3>{{ e.title }}</h3>
          <p class="muted">{{ fmtDate(e.startsAt) }} · {{ e.checked ? '已签到' : (e.checkinOpen ? '可签到' : '待开始') }}</p>
          <NuxtLink :to="'/events/' + e.id" class="btn btn-ghost btn-sm">查看</NuxtLink>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
useHead({ title: '个人主页' })
const { user } = useAuth()
const { data: mine } = await useFetch('/api/me/events')
</script>
