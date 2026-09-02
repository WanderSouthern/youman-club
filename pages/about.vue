<template>
  <div class="wrap page-hero">
    <h1 class="reveal">关于社团</h1>
    <p class="lede reveal-2">{{ config.aboutLede || '福建师范大学旗山校区游戏协会，简称游漫社。' }}</p>
    <section class="section prose">
      <h2>简介</h2>
      <div v-if="isHtml(config.about)" class="prose-html" v-html="config.about" />
      <p v-else>{{ config.about }}</p>
      <h2>沿革</h2>
      <div v-if="isHtml(config.history)" class="prose-html" v-html="config.history" />
      <p v-else>{{ config.history }}</p>
      <h2>组织</h2>
      <div v-if="isHtml(config.organization)" class="prose-html" v-html="config.organization" />
      <p v-else>{{ config.organization || '社长主持全社事务，管理层协助审批与发布。现设电竞部、游戏研发部，各部门设部长。' }}</p>
      <h2>联系</h2>
      <p class="keep">{{ config.contact }}</p>
    </section>
    <div class="cards" style="margin-bottom:48px">
      <NuxtLink v-for="d in depts" :key="d.id" :to="'/departments/' + d.slug" class="card">
        <div class="hue-bar" :class="'hue-' + d.coverHue" />
        <div class="card-body">
          <h3>{{ d.name }}</h3>
          <p class="muted">{{ d.summary }}</p>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
useHead({ title: '关于' })
const [{ data: depts }, { data: home }] = await Promise.all([
  useFetch('/api/public/departments'),
  useFetch('/api/public/home')
])
const config = computed(() => home.value?.config || {})
function isHtml(s) { return typeof s === 'string' && s.includes('<') }
</script>
