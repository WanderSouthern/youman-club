<template>
  <div v-if="pack">
    <NuxtLink to="/admin/members" class="link-btn">返回上一级</NuxtLink>
    <div class="member-row" style="margin:16px 0 24px;gap:16px">
      <Avatar :name="pack.user.name" :user-id="pack.user.id" :avatar="pack.user.avatar" :size="72" />
      <div>
        <h1 style="margin:0">{{ pack.user.name }}</h1>
        <p class="muted">{{ displayTitle(pack.user) }} · {{ pack.user.studentId }}</p>
      </div>
    </div>

    <form class="form card" style="padding:18px;margin-bottom:24px" @submit.prevent="save">
      <div class="form-row">
        <label>姓名<input v-model="form.name" required></label>
        <label>学号<input v-model="form.studentId" required></label>
      </div>
      <div class="form-row">
        <label>邮箱<input v-model="form.email" type="email"></label>
        <label>学院<input v-model="form.college"></label>
      </div>
      <div class="form-row">
        <label>年级<input v-model="form.grade"></label>
        <label>手机<input v-model="form.phone"></label>
      </div>
      <div class="form-row">
        <label>QQ<input v-model="form.qq"></label>
        <label>游戏方向<input v-model="form.gameDirection"></label>
      </div>
      <label>简介<textarea v-model="form.bio"></textarea></label>
      <div class="form-row">
        <label>身份
          <select v-model="form.role" :disabled="pack.user.role === 'president'">
            <option v-if="pack.user.role === 'president'" value="president">社长</option>
            <option v-for="r in IDENTITY_OPTIONS" :key="r.value" :value="r.value">{{ r.label }}</option>
          </select>
        </label>
        <label>称谓
          <input v-model="form.title" :placeholder="form.role === 'management' ? '如：部长、副社长' : ''" :disabled="pack.user.role === 'president'">
        </label>
      </div>
      <div class="form-row">
        <label>部门
          <select v-model="form.departmentId">
            <option value="">无</option>
            <option v-for="d in depts" :key="d.id" :value="d.id">{{ d.name }}</option>
          </select>
        </label>
        <label>状态
          <select v-model="form.status" :disabled="pack.user.role === 'president'">
            <option value="pending">待审</option>
            <option value="active">正常</option>
            <option value="disabled">停用</option>
          </select>
        </label>
      </div>
      <label>重置密码（留空则不改）<input v-model="form.resetPassword" type="password" autocomplete="new-password"></label>
      <label>更换头像
        <input type="file" accept="image/*" @change="onAvatar" @input="onAvatar">
      </label>
      <p v-if="msg" :class="ok ? 'alert alert-ok' : 'alert'">{{ msg }}</p>
      <button class="btn btn-coral" :disabled="busy">保存资料</button>
    </form>

    <h2>参与记录</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>活动</th><th>时间</th><th>报名</th><th>签到</th></tr></thead>
        <tbody>
          <tr v-for="a in pack.activities" :key="a.id">
            <td><NuxtLink :to="'/events/' + a.id">{{ a.title }}</NuxtLink></td>
            <td>{{ fmtDate(a.startsAt) }}</td>
            <td>{{ fmtDate(a.signedAt) }}</td>
            <td>{{ a.checkedIn ? '已签到' : '未签到' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!pack.activities.length" class="empty">尚无报名记录。</p>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: pack, refresh } = await useFetch(() => `/api/admin/members/${route.params.id}`)
const { data: depts } = await useFetch('/api/admin/departments')
useHead({ title: pack.value?.user?.name || '成员档案' })
const form = reactive({
  name: '', studentId: '', email: '', college: '', grade: '', phone: '', qq: '', gameDirection: '', bio: '',
  role: 'member', title: '', departmentId: '', status: 'active', resetPassword: ''
})
watch(pack, (v) => {
  if (!v?.user) return
  Object.assign(form, {
    name: v.user.name,
    studentId: v.user.studentId,
    email: v.user.email,
    college: v.user.college,
    grade: v.user.grade,
    phone: v.user.phone,
    qq: v.user.qq,
    gameDirection: v.user.gameDirection,
    bio: v.user.bio,
    role: v.user.role === 'minister' ? 'management' : v.user.role,
    title: v.user.title || '',
    departmentId: v.user.departmentId || '',
    status: v.user.status,
    resetPassword: ''
  })
}, { immediate: true })
const busy = ref(false)
const ok = ref(false)
const msg = ref('')

async function save() {
  busy.value = true
  msg.value = ''
  try {
    const body = { ...form }
    if (!body.resetPassword) delete body.resetPassword
    await $fetch(`/api/admin/members/${route.params.id}`, { method: 'PATCH', body })
    ok.value = true
    msg.value = '已保存'
    await refresh()
  } catch (e) {
    ok.value = false
    msg.value = e.data?.statusMessage || '保存失败'
  } finally {
    busy.value = false
  }
}
async function onAvatar(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  try {
    await postForm(`/api/admin/members/${route.params.id}/avatar`, fd)
    await refresh()
    const { refresh: authRefresh } = useAuth()
    await authRefresh()
    msg.value = '头像已更新'
    ok.value = true
  } catch (err) {
    ok.value = false
    msg.value = err.data?.statusMessage || '头像上传失败'
  }
}
</script>
