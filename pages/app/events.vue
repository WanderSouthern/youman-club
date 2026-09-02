<template>
  <div>
    <h1>我的活动</h1>
    <p class="muted">报名记录与现场签到。扫现场码，或在此输入口令。</p>
    <article v-for="e in mine?.events" :key="e.id" class="card" style="margin:16px 0">
      <div class="hue-bar" :class="'hue-' + e.coverHue" />
      <div class="card-body">
        <h3>{{ e.title }}</h3>
        <p class="muted">{{ fmtDate(e.startsAt) }} · {{ e.location }}</p>
        <p v-if="e.checked" class="alert alert-ok">已签到</p>
        <form v-else-if="e.checkinOpen && e.requireCheckin" class="form" style="margin-top:12px" @submit.prevent="checkin(e)">
          <label>现场口令
            <input v-model="codes[e.id]" placeholder="或直接扫描现场二维码">
          </label>
          <button class="btn btn-teal btn-sm">口令签到</button>
        </form>
        <p v-else class="muted">签到通道尚未开启。</p>
      </div>
    </article>
    <p v-if="!mine?.events?.length" class="empty">还没有报名。去活动页看看。</p>
  </div>
</template>

<script setup>
useHead({ title: '我的活动' })
const { data: mine, refresh } = await useFetch('/api/me/events')
const codes = reactive({})
async function checkin(e) {
  try {
    await $fetch(`/api/events/${e.id}/checkin`, { method: 'POST', body: { code: codes[e.id] } })
    await refresh()
  } catch (err) {
    alert(err.data?.statusMessage || '签到失败')
  }
}
</script>
