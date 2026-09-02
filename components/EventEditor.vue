<template>
  <form class="form card" style="padding:16px" @submit.prevent="submit">
    <div class="form-row">
      <label>标题<input v-model="form.title" required></label>
      <label>类型
        <select v-model="form.kind">
          <option v-for="k in EVENT_KINDS" :key="k.value" :value="k.value">{{ k.label }}</option>
        </select>
      </label>
    </div>
    <div class="form-row">
      <label>地点<input v-model="form.location"></label>
      <label>所属部门
        <select v-model="form.departmentId">
          <option value="">全社</option>
          <option v-for="d in depts" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
      </label>
    </div>
    <div class="form-row">
      <label>开始<input v-model="form.startsAt" type="datetime-local" required></label>
      <label>结束<input v-model="form.endsAt" type="datetime-local" required></label>
    </div>
    <div v-if="form.kind !== 'notice'" class="form-row">
      <label>报名截止<input v-model="form.signupDeadline" type="datetime-local"></label>
      <label>人数上限（0 为不限）<input v-model.number="form.capacity" type="number" min="0"></label>
    </div>
    <label>摘要<textarea v-model="form.summary"></textarea></label>
    <label>正文
      <RichEditor v-model="form.content" />
    </label>
    <label>配图（选填）
      <input type="file" accept="image/*" @change="onCover">
    </label>
    <div v-if="form.coverImage" style="display:flex;align-items:center;gap:12px">
      <img :src="'/api/media/' + form.coverImage" alt="" style="width:160px;height:90px;object-fit:cover;border-radius:10px">
      <button class="link-btn" type="button" @click="form.coverImage = ''">移除配图</button>
    </div>
    <p v-if="msg" :class="ok ? 'alert alert-ok' : 'alert'">{{ msg }}</p>
    <button class="btn btn-coral btn-sm" :disabled="busy">{{ submitLabel }}</button>
  </form>
</template>

<script setup>
const props = defineProps({
  depts: { type: Array, default: () => [] },
  initial: { type: Object, default: null },
  submitLabel: { type: String, default: '发布' },
  submitFn: { type: Function, required: true }
})
const emit = defineEmits(['saved'])
const form = reactive({
  title: '',
  kind: 'activity',
  location: '',
  departmentId: '',
  startsAt: '',
  endsAt: '',
  signupDeadline: '',
  capacity: 0,
  summary: '',
  content: '',
  coverImage: ''
})
watch(() => props.initial, (v) => {
  if (!v) return
  Object.assign(form, {
    title: v.title || '',
    kind: v.kind === 'notice' ? 'notice' : 'activity',
    location: v.location || '',
    departmentId: v.departmentId || v.department?.id || '',
    startsAt: toDatetimeLocal(v.startsAt),
    endsAt: toDatetimeLocal(v.endsAt),
    signupDeadline: toDatetimeLocal(v.signupDeadline),
    capacity: v.capacity || 0,
    summary: v.summary || '',
    content: v.content || '',
    coverImage: v.coverImage || ''
  })
}, { immediate: true, deep: true })
const busy = ref(false)
const ok = ref(false)
const msg = ref('')
async function onCover(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  try {
    const saved = await postForm('/api/uploads/image', fd)
    form.coverImage = saved.storedName
  } catch (err) {
    msg.value = err.data?.statusMessage || '配图上传失败'
  }
}
async function submit() {
  busy.value = true
  msg.value = ''
  try {
    await props.submitFn({ ...form })
    ok.value = true
    msg.value = '已保存'
    emit('saved')
    if (!props.initial) {
      form.title = form.location = form.summary = form.content = form.coverImage = form.startsAt = form.endsAt = form.signupDeadline = ''
      form.kind = 'activity'
      form.departmentId = ''
      form.capacity = 0
    }
  } catch (err) {
    ok.value = false
    msg.value = err.data?.statusMessage || err.message || '保存失败'
  } finally {
    busy.value = false
  }
}
</script>
