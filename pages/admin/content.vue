<template>
  <div>
    <h1>站点内容</h1>
    <form class="form" style="max-width:820px" @submit.prevent="save">
      <h2>首页</h2>
      <label>眉题<input v-model="form.heroKicker"></label>
      <label>主标题<input v-model="form.heroTitle"></label>
      <label>导语<textarea v-model="form.heroLede"></textarea></label>
      <label>首页补充
        <RichEditor v-model="form.homeExtra" />
      </label>
      <h2>关于</h2>
      <label>关于页导语<input v-model="form.aboutLede"></label>
      <label>简介
        <RichEditor v-model="form.about" />
      </label>
      <label>沿革
        <RichEditor v-model="form.history" />
      </label>
      <label>组织
        <RichEditor v-model="form.organization" />
      </label>
      <label>联系方式<textarea v-model="form.contact"></textarea></label>
      <label>QQ 群<input v-model="form.qqGroup"></label>
      <label class="check"><input type="checkbox" :checked="form.recruitOpen === 'true'" @change="form.recruitOpen = $event.target.checked ? 'true' : 'false'"> 开放招新登记</label>
      <label class="check"><input type="checkbox" :checked="form.bgDecor !== 'off'" @change="form.bgDecor = $event.target.checked ? 'on' : 'off'"> 装饰纹样</label>
      <h2>机器人预留</h2>
      <label>Webhook 地址<input v-model="form.botWebhookUrl" placeholder="https:// 未填写则不推送"></label>
      <label>Webhook 密钥<input v-model="form.botSecret" autocomplete="off"></label>
      <p v-if="msg" class="alert alert-ok">{{ msg }}</p>
      <button class="btn btn-coral">保存并发布</button>
    </form>
  </div>
</template>

<script setup>
useHead({ title: '站点内容' })
const { data } = await useFetch('/api/admin/settings')
const form = reactive({
  heroKicker: '福建师范大学 · 旗山校区',
  heroTitle: '游漫社',
  heroLede: '',
  homeExtra: '',
  aboutLede: '',
  about: '',
  history: '',
  organization: '',
  contact: '',
  qqGroup: '',
  recruitOpen: 'true',
  bgDecor: 'on',
  botWebhookUrl: '',
  botSecret: '',
  ...data.value
})
watch(data, (v) => { if (v) Object.assign(form, v) })
const msg = ref('')
async function save() {
  await $fetch('/api/admin/settings', { method: 'POST', body: form })
  msg.value = '已发布'
}
</script>
