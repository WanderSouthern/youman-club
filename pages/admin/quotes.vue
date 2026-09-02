<template>
  <div>
    <h1>一言</h1>
    <form class="form card" style="padding:16px;margin:16px 0" @submit.prevent="create">
      <label>格言<textarea v-model="form.content" required></textarea></label>
      <label>出处（选填）<input v-model="form.source"></label>
      <button class="btn btn-coral btn-sm">添加</button>
    </form>
    <article v-for="q in quotes" :key="q.id" class="card" style="margin-bottom:10px">
      <div class="card-body">
        <p style="font-family:var(--font-serif);margin:0 0 8px">{{ q.content }}</p>
        <p v-if="q.source" class="muted">{{ q.source }}</p>
        <div style="display:flex;gap:8px">
          <label class="check"><input type="checkbox" :checked="q.enabled" @change="toggle(q, $event.target.checked)"> 启用</label>
          <button class="link-btn" type="button" @click="remove(q)">删除</button>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
useHead({ title: '一言' })
const { data: quotes, refresh } = await useFetch('/api/admin/quotes')
const form = reactive({ content: '', source: '' })
async function create() {
  await $fetch('/api/admin/quotes', { method: 'POST', body: form })
  form.content = form.source = ''
  await refresh()
}
async function toggle(q, enabled) {
  await $fetch(`/api/admin/quotes/${q.id}`, { method: 'PATCH', body: { enabled } })
  await refresh()
}
async function remove(q) {
  if (!confirm('删除这条格言？')) return
  await $fetch(`/api/admin/quotes/${q.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
