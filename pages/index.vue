<template>
  <div>
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="reveal">
          <div class="kicker">{{ config.heroKicker || '福建师范大学 · 旗山校区' }}</div>
          <h1 class="display">{{ config.heroTitle || '游漫社' }}</h1>
          <p class="lede">{{ config.heroLede || '福建师范大学旗山校区游戏协会。电竞训练与游戏创作并行，组织活动、沉淀作品、承办赛事。' }}</p>
          <figure v-if="quote" class="hitokoto">
            <blockquote>{{ quote.content }}</blockquote>
            <figcaption v-if="quote.source">—— {{ quote.source }}</figcaption>
          </figure>
          <div class="hero-actions">
            <NuxtLink to="/recruit" class="btn btn-coral">加入社团</NuxtLink>
            <NuxtLink to="/departments" class="btn btn-ghost">了解部门</NuxtLink>
            <NuxtLink to="/events" class="btn btn-ink">活动安排</NuxtLink>
          </div>
        </div>
        <div class="stamp reveal-2" aria-hidden="true">
          <div class="stamp-inner">
            <b>游漫</b>
            <span>旗山 · 游戏协会</span>
          </div>
        </div>
      </div>
    </section>

    <section v-if="config.homeExtra" class="section reveal-3">
      <div class="wrap prose prose-html" v-html="config.homeExtra" />
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-h">
          <h2>部门</h2>
          <NuxtLink to="/departments" class="link-btn">全部部门</NuxtLink>
        </div>
        <div class="cards">
          <NuxtLink v-for="d in data?.departments" :key="d.id" :to="'/departments/' + d.slug" class="card">
            <div class="hue-bar" :class="'hue-' + d.coverHue" />
            <div class="card-body">
              <span class="chip">{{ d.shortName || d.name }}</span>
              <h3>{{ d.name }}</h3>
              <p class="muted">{{ d.summary }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="wrap">
        <div class="section-h">
          <h2>近期安排</h2>
          <NuxtLink to="/events" class="link-btn">全部活动</NuxtLink>
        </div>
        <div class="cards cards-3">
          <EventCard v-for="e in data?.events" :key="e.id" :event="e" />
        </div>
        <p v-if="!data?.events?.length" class="empty">暂无已发布的活动。</p>
      </div>
    </section>
  </div>
</template>

<script setup>
useHead({ title: '首页' })
const { data } = await useFetch('/api/public/home')
const { data: site } = await useFetch('/api/public/config')
const config = computed(() => data.value?.config || {})
const quote = computed(() => site.value?.quote)
</script>
