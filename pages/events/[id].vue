<template>
  <div v-if="event" class="wrap page-hero">
    <NuxtLink to="/events" class="link-btn">返回上一级</NuxtLink>
    <p class="kicker">{{ event.kind === 'notice' ? '通知' : (event.department?.name || '全社活动') }}</p>
    <h1>{{ event.title }}</h1>
    <p v-if="event.cancelledAt" class="alert">该活动已取消。</p>
    <p class="lede">{{ event.summary }}</p>
    <p class="muted">{{ fmtDate(event.startsAt) }} — {{ fmtDate(event.endsAt) }} · {{ event.location }}</p>
    <p v-if="event.kind !== 'notice'" class="muted">报名 {{ event.signupCount }}{{ event.capacity ? ' / ' + event.capacity : '' }} · 截止 {{ fmtDate(event.signupDeadline) }}</p>
    <img v-if="event.coverImage" class="event-cover" :src="'/api/media/' + event.coverImage" :alt="event.title">
    <div style="display:flex;gap:10px;flex-wrap:wrap;margin:18px 0 28px">
      <template v-if="event.kind !== 'notice' && !event.cancelledAt">
        <button v-if="user && !event.signed && user.role !== 'pending'" class="btn btn-coral" :disabled="busy" @click="signup">报名</button>
        <button v-else-if="user && event.signed" class="btn btn-ghost" :disabled="busy" @click="cancelSignup">取消报名</button>
        <NuxtLink v-else-if="!user" to="/login" class="btn btn-coral">登录后报名</NuxtLink>
        <NuxtLink v-if="event.signed && event.requireCheckin" to="/app/events" class="btn btn-teal">签到</NuxtLink>
      </template>
      <NuxtLink v-if="isStaff" :to="'/admin/events/' + event.id" class="link-btn">编辑活动</NuxtLink>
      <button v-if="isStaff && !event.cancelledAt" class="btn btn-ghost btn-sm" :disabled="busy" @click="cancelEvent">取消活动</button>
    </div>
    <p v-if="msg" class="alert">{{ msg }}</p>
    <div class="prose" style="margin-bottom:28px">
      <div v-if="isHtml(event.content)" class="prose-html" v-html="event.content" />
      <p v-else class="keep">{{ event.content }}</p>
    </div>
    <EventComments
      :event-id="event.id"
      :initial-comments="event.comments || []"
      :initial-liked="event.liked"
      :initial-like-count="event.likeCount || 0"
    />
  </div>
</template>

<script setup>
const route = useRoute()
const { user, isStaff, refresh } = useAuth()
await refresh()
const { data: event, refresh: reload } = await useFetch(() => `/api/public/events/${route.params.id}`)
useHead({ title: event.value?.title || '活动' })
const busy = ref(false)
const msg = ref('')
function isHtml(s) { return typeof s === 'string' && s.includes('<') }

async function signup() {
  busy.value = true
  msg.value = ''
  try {
    await $fetch(`/api/events/${route.params.id}/signup`, { method: 'POST' })
    await reload()
  } catch (e) {
    msg.value = e.data?.statusMessage || e.statusMessage || '报名未成功'
  } finally {
    busy.value = false
  }
}
async function cancelSignup() {
  busy.value = true
  msg.value = ''
  try {
    await $fetch(`/api/events/${route.params.id}/signup`, { method: 'DELETE' })
    await reload()
  } catch (e) {
    msg.value = e.data?.statusMessage || e.statusMessage || '无法取消'
  } finally {
    busy.value = false
  }
}
async function cancelEvent() {
  if (!confirm('确认取消该活动？已报名社员将收到通知。')) return
  busy.value = true
  try {
    await $fetch(`/api/admin/events/${route.params.id}/cancel`, { method: 'POST' })
    await reload()
  } catch (e) {
    msg.value = e.data?.statusMessage || '取消失败'
  } finally {
    busy.value = false
  }
}
</script>
