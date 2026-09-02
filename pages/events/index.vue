<template>
  <div class="wrap page-hero">
    <h1>活动</h1>
    <p class="lede">社团活动与通知均在此发布。活动需登录并通过审核后报名。</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin: 12px 0 16px;align-items:center">
      <button class="btn btn-sm" :class="filter ? 'btn-ghost' : 'btn-ink'" @click="filter = ''">全部</button>
      <button class="btn btn-sm" :class="filter === 'activity' ? 'btn-ink' : 'btn-ghost'" @click="filter = 'activity'">活动</button>
      <button class="btn btn-sm" :class="filter === 'notice' ? 'btn-ink' : 'btn-ghost'" @click="filter = 'notice'">通知</button>
      <input v-model="q" placeholder="搜索活动" style="flex:1;min-width:160px;max-width:280px">
      <button v-if="isStaff" class="btn btn-coral btn-sm" type="button" @click="showPublish = !showPublish">{{ showPublish ? '收起发布' : '发布活动' }}</button>
    </div>
    <EventEditor v-if="isStaff && showPublish" :depts="depts || []" :submit-fn="create" @saved="afterCreate" />
    <div class="cards cards-3" style="margin: 22px 0 56px">
      <EventCard v-for="e in shown" :key="e.id" :event="e" />
    </div>
    <p v-if="!shown.length" class="empty">暂无内容。</p>
  </div>
</template>

<script setup>
useHead({ title: '活动' })
const { isStaff, refresh } = useAuth()
await refresh()
const q = ref('')
const filter = ref('')
const showPublish = ref(false)
const { data: events, refresh: reload } = await useFetch('/api/public/events')
const { data: depts } = await useAsyncData('events-admin-depts', async () => {
  if (!isStaff.value) return []
  try { return await $fetch('/api/admin/departments') } catch { return [] }
})
const shown = computed(() => {
  const k = q.value.trim()
  return (events.value || []).filter((e) => {
    if (filter.value === 'notice' && e.kind !== 'notice') return false
    if (filter.value === 'activity' && e.kind === 'notice') return false
    if (!k) return true
    return [e.title, e.summary, e.location, e.department?.name].join(' ').includes(k)
  })
})
async function create(payload) {
  await $fetch('/api/admin/events', { method: 'POST', body: payload })
}
async function afterCreate() {
  showPublish.value = false
  await reload()
}
</script>
