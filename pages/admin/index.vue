<template>
  <div>
    <h1>总览</h1>
    <div class="cards cards-3" style="margin: 18px 0 28px">
      <article class="card"><div class="card-body"><h3>{{ stats?.users }}</h3><p class="muted">成员 · 待审 {{ stats?.pending }}</p></div></article>
      <article class="card"><div class="card-body"><h3>{{ stats?.events }}</h3><p class="muted">活动</p></div></article>
      <article class="card"><div class="card-body"><h3>{{ stats?.intents }}</h3><p class="muted">招新意向</p></div></article>
    </div>
    <h2>近期操作</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>时间</th><th>人</th><th>动作</th><th>详情</th></tr></thead>
        <tbody>
          <tr v-for="l in stats?.logs" :key="l.id">
            <td>{{ fmtDate(l.createdAt) }}</td>
            <td>{{ l.name }}</td>
            <td>{{ l.action }}</td>
            <td>{{ l.detail }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
useHead({ title: '管理总览' })
const { data: stats } = await useFetch('/api/admin/stats')
</script>
