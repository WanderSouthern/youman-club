<template>
  <div>
    <h1>部门</h1>
    <form class="form card" style="padding:16px;margin:16px 0" @submit.prevent="create">
      <div class="form-row">
        <label>名称<input v-model="form.name" required placeholder="如：电竞部"></label>
        <label>一句话简介<input v-model="form.summary"></label>
      </div>
      <button class="btn btn-coral btn-sm">新增部门</button>
    </form>
    <article v-for="d in depts" :key="d.id" class="card" style="margin-bottom:12px">
      <div class="card-body">
        <form class="form" @submit.prevent="save(d)">
          <div class="form-row">
            <label>名称<input v-model="d.name"></label>
            <label>短名<input v-model="d.shortName"></label>
          </div>
          <label>简介<textarea v-model="d.description"></textarea></label>
          <label>职责<textarea v-model="d.duties"></textarea></label>
          <label>部长寄语<input v-model="d.ministerNote"></label>
          <label>色调
            <select v-model="d.coverHue">
              <option value="coral">珊瑚</option>
              <option value="teal">青绿</option>
              <option value="gold">金</option>
              <option value="plum">紫</option>
            </select>
          </label>
          <label class="check"><input type="checkbox" v-model="d.published"> 公开显示</label>
          <button class="btn btn-ink btn-sm">保存</button>
        </form>
      </div>
    </article>
  </div>
</template>

<script setup>
const { data: depts, refresh } = await useFetch('/api/admin/departments')
const form = reactive({ name: '', summary: '' })
async function create() {
  await $fetch('/api/admin/departments', { method: 'POST', body: form })
  form.name = form.summary = ''
  await refresh()
}
async function save(d) {
  await $fetch(`/api/admin/departments/${d.id}`, { method: 'PATCH', body: d })
  await refresh()
}
</script>
