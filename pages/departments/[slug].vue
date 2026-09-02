<template>
  <div v-if="data" class="wrap page-hero">
    <NuxtLink to="/departments" class="link-btn">返回上一级</NuxtLink>
    <p class="kicker">部门</p>
    <h1>{{ data.department.name }}</h1>
    <p class="lede">{{ data.department.summary }}</p>
    <section class="section prose">
      <p>{{ data.department.description }}</p>
      <h2>职责</h2>
      <p class="keep">{{ data.department.duties }}</p>
      <h2 v-if="data.department.ministerNote">部长寄语</h2>
      <p v-if="data.department.ministerNote">{{ data.department.ministerNote }}</p>
    </section>
    <section class="section">
      <div class="section-h"><h2>近期动态</h2></div>
      <div class="cards">
        <EventCard v-for="e in data.events" :key="e.id" :event="e" />
      </div>
      <p v-if="!data.events.length" class="empty">该部门暂无已发布活动。</p>
    </section>
  </div>
</template>

<script setup>
const route = useRoute()
const { data } = await useFetch(() => `/api/public/departments/${route.params.slug}`)
useHead({ title: data.value?.department?.name || '部门' })
</script>
