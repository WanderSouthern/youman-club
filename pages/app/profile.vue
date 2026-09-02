<template>
  <div style="max-width:520px">
    <div class="member-row" style="margin-bottom:20px;gap:14px">
      <Avatar :name="user?.name" :user-id="user?.id" :avatar="user?.avatar" :size="64" />
      <div>
        <h1 style="margin:0">{{ user?.name }}</h1>
        <p class="muted">{{ user?.studentId }} · {{ user?.college }} {{ user?.grade }}</p>
      </div>
    </div>
    <form class="form" @submit.prevent="save">
      <label>更换头像<input type="file" accept="image/*" @change="onAvatar" @input="onAvatar"></label>
      <label v-if="user?.role === 'management' || user?.role === 'minister'">称谓<input v-model="form.title" placeholder="如：部长、副社长"></label>
      <label>手机<input v-model="form.phone"></label>
      <label>QQ<input v-model="form.qq"></label>
      <label>游戏方向<input v-model="form.gameDirection"></label>
      <label>简介<textarea v-model="form.bio"></textarea></label>
      <p v-if="msg" class="alert alert-ok">{{ msg }}</p>
      <button class="btn btn-coral">保存</button>
      <button class="btn btn-ghost" type="button" @click="logout">退出登录</button>
    </form>
  </div>
</template>

<script setup>
useHead({ title: '资料设置' })
const { user, refresh, logout } = useAuth()
const form = reactive({
  phone: user.value?.phone || '',
  qq: user.value?.qq || '',
  gameDirection: user.value?.gameDirection || '',
  bio: user.value?.bio || '',
  title: user.value?.title || ''
})
const msg = ref('')
async function save() {
  await $fetch('/api/me', { method: 'PATCH', body: form })
  await refresh()
  msg.value = '已保存'
}
async function onAvatar(e) {
  const file = e.target.files?.[0]
  if (!file) return
  const fd = new FormData()
  fd.append('file', file)
  try {
    await postForm('/api/me/avatar', fd)
    await refresh()
    msg.value = '头像已更新'
  } catch (e) {
    msg.value = e.data?.statusMessage || '头像上传失败'
  }
}
</script>
