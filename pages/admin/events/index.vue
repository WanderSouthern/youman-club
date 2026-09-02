<template>
  <div>
    <h1>活动</h1>
    <EventEditor :depts="depts || []" :submit-fn="create" @saved="afterCreate" />
    <input v-model="q" placeholder="搜索活动" style="margin:16px 0;width:min(420px,100%)">
    <div class="table-wrap">
      <table>
        <thead><tr><th>标题</th><th>类型</th><th>时间</th><th>报名</th><th></th></tr></thead>
        <tbody>
          <tr v-for="e in shown" :key="e.id">
            <td>{{ e.title }}<br><span class="muted">{{ e.department?.name || '全社' }}</span></td>
            <td>{{ kindLabel(e.kind) }}</td>
            <td>{{ fmtDate(e.startsAt) }}</td>
            <td>{{ e.signupCount }}{{ e.capacity ? '/' + e.capacity : '' }}</td>
            <td><NuxtLink :to="'/admin/events/' + e.id" class="link-btn">编辑</NuxtLink></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
useHead({ title: '活动管理' })
const { data: events, refresh } = await useFetch('/api/admin/events')
const { data: depts } = await useFetch('/api/admin/departments')
const q = ref('')
const shown = computed(() => {
  const k = q.value.trim()
  return (events.value || []).filter((e) => !k || [e.title, e.summary, e.location, e.department?.name].join(' ').includes(k))
})
async function create(payload) {
  await $fetch('/api/admin/events', { method: 'POST', body: payload })
}
async function afterCreate() {
  await refresh()
}
</script>
