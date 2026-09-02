<template>
  <div class="wrap page-hero">
    <h1>部门</h1>
    <p class="lede">现设电竞部与游戏研发部。后续增设部门由管理层在后台完成。</p>
    <div class="cards" style="margin: 24px 0 56px">
      <NuxtLink v-for="d in depts" :key="d.id" :to="'/departments/' + d.slug" class="card">
        <div class="hue-bar" :class="'hue-' + d.coverHue" />
        <div class="card-body">
          <span class="chip">{{ d.shortName }}</span>
          <h3>{{ d.name }}</h3>
          <p class="muted">{{ d.summary }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({ title: '部门' })
const { data: depts } = await useFetch('/api/public/departments')
</script>
