<template>
  <div>
    <h1>成员</h1>
    <div class="search-bar">
      <input v-model="q" placeholder="姓名 / 学号 / 学院 / 年级 / 联系方式">
      <select v-model="role">
        <option value="">全部身份</option>
        <option value="president">社长</option>
        <option v-for="r in IDENTITY_OPTIONS" :key="r.value" :value="r.value">{{ r.label }}</option>
      </select>
      <select v-model="status">
        <option value="">全部状态</option>
        <option value="pending">待审</option>
        <option value="active">正常</option>
        <option value="disabled">停用</option>
      </select>
      <select v-model="departmentId">
        <option value="">全部部门</option>
        <option v-for="d in depts" :key="d.id" :value="d.id">{{ d.name }}</option>
      </select>
    </div>
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>成员</th><th>学号</th><th>身份</th><th>部门</th><th>活动</th><th>状态</th></tr>
        </thead>
        <tbody>
          <tr v-for="m in members" :key="m.id">
            <td>
              <NuxtLink :to="'/admin/members/' + m.id" class="member-row">
                <Avatar :name="m.name" :user-id="m.id" :avatar="m.avatar" :size="36" />
                <span>{{ m.name }}<br><span class="muted">{{ m.college }} {{ m.grade }}</span></span>
              </NuxtLink>
            </td>
            <td>{{ m.studentId }}</td>
            <td>{{ displayTitle(m) }}<span v-if="m.title && identityName(m.role) !== m.title" class="muted"> · {{ identityName(m.role) }}</span></td>
            <td>{{ m.department?.name || '—' }}</td>
            <td>{{ m.signupCount || 0 }}</td>
            <td>{{ statusLabel(m.status) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!members?.length" class="empty">没有符合条件的成员。</p>
  </div>
</template>

<script setup>
useHead({ title: '成员' })
const q = ref('')
const qDebounced = ref('')
const role = ref('')
const status = ref('')
const departmentId = ref('')
let timer
watch(q, (v) => {
  clearTimeout(timer)
  timer = setTimeout(() => { qDebounced.value = v }, 280)
})
const { data: depts } = await useFetch('/api/admin/departments')
const query = computed(() => {
  const p = {}
  if (qDebounced.value.trim()) p.q = qDebounced.value.trim()
  if (role.value) p.role = role.value
  if (status.value) p.status = status.value
  if (departmentId.value) p.departmentId = departmentId.value
  return p
})
const { data: members } = await useFetch('/api/admin/members', { query })
</script>
