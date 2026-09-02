<template>
  <div class="wrap page-hero" style="max-width:480px">
    <h1>现场签到</h1>
    <p v-if="!user" class="lede">请先登录。</p>
    <form v-else class="form" @submit.prevent="go">
      <p class="muted">扫码将自动带入活动。也可手动输入口令。</p>
      <label>现场口令<input v-model="code" placeholder="如 YMS-1842"></label>
      <p v-if="msg" :class="ok ? 'alert alert-ok' : 'alert'">{{ msg }}</p>
      <button class="btn btn-coral" :disabled="busy">签到</button>
    </form>
  </div>
</template>

<script setup>
useHead({ title: '签到' })
const route = useRoute()
const { user, refresh } = useAuth()
await refresh()
const code = ref('')
const busy = ref(false)
const ok = ref(false)
const msg = ref('')

onMounted(async () => {
  if (!user.value) {
    await navigateTo(`/login?redirect=${encodeURIComponent(route.fullPath)}`)
    return
  }
  if (route.query.e && route.query.n) {
    await doCheckin({ nonce: route.query.n })
  }
})

async function doCheckin(body) {
  const id = route.query.e
  if (!id) {
    msg.value = '缺少活动信息，请扫描现场二维码或从工作台进入。'
    return
  }
  busy.value = true
  try {
    const res = await $fetch(`/api/events/${id}/checkin`, { method: 'POST', body })
    ok.value = true
    msg.value = res.checked ? '已经签到过了。' : (res.method === 'qr' ? '扫码签到成功。' : '口令签到成功。')
  } catch (e) {
    ok.value = false
    msg.value = e.data?.statusMessage || '签到失败'
  } finally {
    busy.value = false
  }
}
function go() {
  return doCheckin({ code: code.value })
}
</script>
