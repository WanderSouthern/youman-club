<template>
  <div v-if="pack">
    <NuxtLink to="/admin/events" class="link-btn">返回上一级</NuxtLink>
    <h1>{{ pack.event.title }}</h1>
    <p class="muted">
      {{ kindLabel(pack.event.kind) }}
      <template v-if="pack.event.kind !== 'notice'"> · 报名 {{ pack.signups.length }} · 签到 {{ pack.signups.filter(s => s.checkedIn).length }}</template>
      <span v-if="pack.event.cancelledAt"> · 已取消</span>
    </p>
    <h2>编辑</h2>
    <EventEditor :depts="depts || []" :initial="pack.event" submit-label="保存" :submit-fn="saveEvent" @saved="refresh" />
    <div v-if="!pack.event.cancelledAt" style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0">
      <button class="btn btn-ghost btn-sm" @click="cancelEvent">取消活动</button>
    </div>
    <form v-if="pack.event.kind !== 'notice'" class="form card" style="padding:16px;margin:16px 0" @submit.prevent="broadcast">
      <h3 style="margin:0">给全部报名者发私信</h3>
      <label>内容<textarea v-model="cast" required></textarea></label>
      <button class="btn btn-ink btn-sm" :disabled="casting">一键发送</button>
      <p v-if="castMsg" class="alert alert-ok">{{ castMsg }}</p>
    </form>
    <div v-if="pack.event.kind !== 'notice'" class="cards" style="margin:16px 0">
      <article class="card">
        <div class="card-body">
          <h3>签到通道</h3>
          <p v-if="pack.checkinOpen">口令 <strong>{{ pack.checkinCode }}</strong></p>
          <button class="btn btn-teal btn-sm" @click="toggle(!pack.checkinOpen)">{{ pack.checkinOpen ? '关闭签到' : '开启签到' }}</button>
          <div v-if="qr" class="qr-box" style="margin-top:12px">
            <img :src="qr.qrDataUrl" alt="签到二维码" width="220" height="220">
          </div>
        </div>
      </article>
    </div>
    <p v-if="pack.event.kind !== 'notice'">
      <a :href="'/api/admin/events/' + id + '/export'" class="link-btn">导出名单</a>
    </p>
    <div v-if="pack.event.kind !== 'notice'" class="table-wrap" style="margin-top:16px">
      <table>
        <thead><tr><th>姓名</th><th>学号</th><th>学院</th><th>签到</th></tr></thead>
        <tbody>
          <tr v-for="s in pack.signups" :key="s.id">
            <td>{{ s.name }}</td>
            <td>{{ s.studentId }}</td>
            <td>{{ s.college }}</td>
            <td>{{ s.checkedIn ? '是' : '否' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const id = route.params.id
const { data: pack, refresh } = await useFetch(`/api/admin/events/${id}`)
const { data: depts } = await useFetch('/api/admin/departments')
useHead({ title: pack.value?.event?.title || '活动管理' })
const qr = ref(null)
const cast = ref('')
const casting = ref(false)
const castMsg = ref('')
let timer

async function saveEvent(payload) {
  await $fetch(`/api/admin/events/${id}`, { method: 'PATCH', body: payload })
}
async function cancelEvent() {
  if (!confirm('确认取消？已报名社员将收到系统通知。')) return
  await $fetch(`/api/admin/events/${id}/cancel`, { method: 'POST' })
  await refresh()
}
async function broadcast() {
  if (!confirm('确认发送给全部报名者？')) return
  casting.value = true
  castMsg.value = ''
  try {
    const r = await $fetch(`/api/admin/events/${id}/broadcast`, { method: 'POST', body: { body: cast.value } })
    castMsg.value = `已发送 ${r.notified} 人`
    cast.value = ''
  } finally {
    casting.value = false
  }
}
async function loadQr() {
  try {
    qr.value = await $fetch(`/api/admin/events/${id}/qr`)
  } catch {
    qr.value = null
  }
}
async function toggle(open) {
  await $fetch(`/api/admin/events/${id}/checkin`, { method: 'POST', body: { open } })
  await refresh()
  if (open) await loadQr()
  else qr.value = null
}
onMounted(async () => {
  if (pack.value?.checkinOpen) await loadQr()
  timer = setInterval(() => { if (pack.value?.checkinOpen) loadQr() }, 20000)
})
onUnmounted(() => clearInterval(timer))
</script>
