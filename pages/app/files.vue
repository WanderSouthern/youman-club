<template>
  <div>
    <h1>资料</h1>
    <div class="search-bar" style="grid-template-columns:1.4fr .7fr .7fr">
      <input v-model="q" placeholder="搜索标题 / 文件名 / 上传者 / 部门">
      <select v-model="category">
        <option value="">全部分类</option>
        <option v-for="c in FILE_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
      <select v-model="visibility">
        <option value="">全部范围</option>
        <option v-for="v in VISIBILITY" :key="v.value" :value="v.value">{{ v.label }}</option>
      </select>
    </div>
    <div v-if="isStaff && !showUpload" class="toolbar-row" style="margin-top:12px">
      <button class="btn btn-coral btn-sm" type="button" @click="showUpload = true">上传资料</button>
    </div>
    <form v-if="isStaff && showUpload" class="form card" style="padding:16px;margin:16px 0" @submit.prevent="upload">
      <label>标题<input v-model="meta.title" required></label>
      <div class="form-row">
        <label>分类
          <select v-model="meta.category">
            <option v-for="c in FILE_CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
          </select>
        </label>
        <label>可见范围
          <select v-model="meta.visibility">
            <option v-for="v in VISIBILITY" :key="v.value" :value="v.value">{{ v.label }}</option>
          </select>
        </label>
      </div>
      <label>所属部门
        <select v-model="meta.departmentId">
          <option value="">全社</option>
          <option v-for="d in depts" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
      </label>
      <label>文件<input type="file" @change="onFile"></label>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-coral btn-sm" :disabled="!file">上传（单文件不超过 20MB）</button>
        <button class="btn btn-ghost btn-sm" type="button" @click="showUpload = false">取消</button>
      </div>
    </form>
    <div class="table-wrap" style="margin-top:18px">
      <table>
        <thead>
          <tr><th>标题</th><th>分类</th><th>范围</th><th></th></tr>
        </thead>
        <tbody>
          <tr v-for="f in files" :key="f.id">
            <td>{{ f.title }}<br><span class="muted">{{ f.uploader }} · {{ f.originalName }}</span></td>
            <td>{{ labelCat(f.category) }}</td>
            <td>{{ labelVis(f.visibility) }}{{ f.department ? ' · ' + f.department.name : '' }}</td>
            <td>
              <a :href="'/api/files/' + f.id" class="btn btn-ghost btn-sm">下载</a>
              <button v-if="isStaff" class="btn btn-ghost btn-sm" @click="remove(f)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!files?.length" class="empty">暂无资料。</p>
  </div>
</template>

<script setup>
useHead({ title: '资料' })
const { isStaff } = useAuth()
const q = ref('')
const qDebounced = ref('')
const category = ref('')
const visibility = ref('')
let timer
watch(q, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => { qDebounced.value = v }, 280)
})
const query = computed(() => {
  const p = {}
  if (qDebounced.value.trim()) p.q = qDebounced.value.trim()
  if (category.value) p.category = category.value
  if (visibility.value) p.visibility = visibility.value
  return p
})
const { data: files, refresh } = await useFetch('/api/files', { query })
const { data: depts } = await useAsyncData('files-depts', async () => {
  if (!isStaff.value) return []
  try { return await $fetch('/api/admin/departments') } catch { return [] }
})
const showUpload = ref(false)
const meta = reactive({ title: '', category: 'tools', visibility: 'club', departmentId: '' })
const file = ref(null)
function onFile(e) { file.value = e.target.files?.[0] || null }
function labelCat(v) { return FILE_CATEGORIES.find(i => i.value === v)?.label || v }
function labelVis(v) { return VISIBILITY.find(i => i.value === v)?.label || v }
async function upload() {
  const fd = new FormData()
  fd.append('file', file.value)
  fd.append('title', meta.title)
  fd.append('category', meta.category)
  fd.append('visibility', meta.visibility)
  fd.append('departmentId', meta.departmentId)
  await postForm('/api/admin/files', fd)
  file.value = null
  meta.title = ''
  showUpload.value = false
  await refresh()
}
async function remove(f) {
  if (!confirm(`确认删除「${f.title}」？删除后不可恢复。`)) return
  await $fetch(`/api/admin/files/${f.id}`, { method: 'DELETE' })
  await refresh()
}
</script>
