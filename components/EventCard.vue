<template>
  <article v-if="event" class="card">
    <img v-if="event.coverImage" class="event-card-cover" :src="'/api/media/' + event.coverImage" :alt="event.title">
    <div v-else class="hue-bar" :class="'hue-' + event.coverHue" />
    <div class="card-body">
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
        <span class="chip" :class="event.kind === 'notice' ? 'chip-coral' : ''">{{ kindLabel(event.kind) }}</span>
        <span v-if="event.cancelledAt" class="chip chip-coral">已取消</span>
        <span class="chip">{{ fmtDay(event.startsAt) }}</span>
        <span v-if="event.department" class="chip chip-teal">{{ event.department.name }}</span>
        <span v-else class="chip">全社</span>
      </div>
      <h3>{{ event.title }}</h3>
      <p class="muted">{{ event.summary }}</p>
      <p v-if="event.kind !== 'notice'" class="muted">{{ event.location }} · 已报 {{ event.signupCount }}{{ event.capacity ? ' / ' + event.capacity : '' }}</p>
      <p v-else class="muted">{{ event.location }}</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
        <NuxtLink :to="'/events/' + event.id" class="btn btn-ghost btn-sm">详情</NuxtLink>
        <NuxtLink v-if="isStaff" :to="'/admin/events/' + event.id" class="link-btn">编辑活动</NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({ event: { type: Object, required: true } })
const { isStaff } = useAuth()
</script>
