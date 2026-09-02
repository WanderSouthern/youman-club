<template>
  <div>
    <div class="toolbar-row">
      <h1>消息</h1>
      <button v-if="!showCompose" class="btn btn-coral btn-sm" type="button" @click="showCompose = true">发送私信</button>
    </div>
    <form v-if="showCompose" class="form card" style="padding:16px;margin-bottom:18px" @submit.prevent="send">
      <label>收件人
        <input v-model="q" placeholder="输入昵称或学号搜索" autocomplete="off">
      </label>
      <div v-if="q.trim() && hits.length" class="member-hits">
        <button
          v-for="h in hits"
          :key="h.id"
          type="button"
          class="member-hit"
          :class="{ picked: to?.id === h.id }"
          @click="pick(h)"
        >
          <Avatar :name="h.name" :user-id="h.id" :avatar="h.avatar" :size="36" />
          <span>
            <b>{{ h.name }}</b>
            <span class="muted">{{ h.studentId }}</span>
          </span>
        </button>
      </div>
      <p v-if="to" class="muted" style="display:flex;align-items:center;gap:8px;margin:0">
        <Avatar :name="to.name" :user-id="to.id" :avatar="to.avatar" :size="28" />
        发送给 {{ to.name }} · {{ to.studentId }}
      </p>
      <label>内容<textarea v-model="body" required></textarea></label>
      <p v-if="err" class="alert">{{ err }}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-coral btn-sm" :disabled="busy || !to">发送</button>
        <button class="btn btn-ghost btn-sm" type="button" @click="closeCompose">取消</button>
      </div>
    </form>
    <article
      v-for="m in list"
      :key="m.id"
      class="comment-item"
      :class="{ unread: !m.readAt }"
      style="margin-bottom:10px;cursor:pointer"
      @click="open(m)"
    >
      <div class="comment-head">
        <span class="chip" :class="m.kind === 'dm' ? 'chip-teal' : 'chip-coral'">{{ m.kind === 'dm' ? '私信' : '通知' }}</span>
        <strong>{{ m.title }}</strong>
        <span class="muted">{{ fmtDate(m.createdAt) }}</span>
        <span v-if="!m.readAt" class="chip chip-coral">未读</span>
      </div>
      <p v-if="m.from" class="muted" style="margin:0 0 6px;display:flex;align-items:center;gap:8px">
        <Avatar :name="m.from.name" :user-id="m.from.id" :avatar="m.from.avatar" :size="22" />
        {{ m.from.name }}
      </p>
      <p style="margin:0;white-space:pre-wrap">{{ m.body }}</p>
      <NuxtLink v-if="m.event" :to="'/events/' + m.event.id" class="link-btn" style="margin-top:8px" @click.stop>查看活动</NuxtLink>
    </article>
    <p v-if="!list.length" class="empty">暂无消息。</p>
  </div>
</template>

<script setup>
useHead({ title: '消息' })
const { refreshUnread } = useUnread()
const list = ref([])
const showCompose = ref(false)
const q = ref('')
const hits = ref([])
const to = ref(null)
const body = ref('')
const busy = ref(false)
const err = ref('')
let lookTimer
async function load() {
  list.value = await $fetch('/api/messages')
  await refreshUnread()
}
watch(q, (v) => {
  const k = v.trim()
  clearTimeout(lookTimer)
  if (to.value && k !== to.value.name && k !== to.value.studentId) to.value = null
  if (!k) {
    hits.value = []
    return
  }
  if (to.value && (k === to.value.name || k === to.value.studentId)) {
    hits.value = []
    return
  }
  lookTimer = setTimeout(lookup, 220)
})
async function lookup() {
  const k = q.value.trim()
  if (!k) { hits.value = []; return }
  hits.value = await $fetch('/api/members/lookup', { query: { q: k } })
}
function pick(h) {
  to.value = h
  q.value = h.name
  hits.value = []
}
function closeCompose() {
  showCompose.value = false
  q.value = ''
  hits.value = []
  to.value = null
  body.value = ''
  err.value = ''
}
async function send() {
  busy.value = true
  err.value = ''
  try {
    await $fetch('/api/messages', { method: 'POST', body: { toUserId: to.value.id, body: body.value } })
    closeCompose()
    await load()
  } catch (e) {
    err.value = e.data?.statusMessage || '发送失败'
  } finally {
    busy.value = false
  }
}
async function open(m) {
  if (!m.readAt) {
    await $fetch(`/api/messages/${m.id}/read`, { method: 'POST' })
    m.readAt = new Date().toISOString()
    await refreshUnread()
  }
}
onMounted(load)
</script>
