<template>
  <span class="avatar" :style="{ width: size + 'px', height: size + 'px', fontSize: size * 0.42 + 'px' }" :title="name">
    <img v-if="src && !broken" :src="src" :alt="name" @error="broken = true">
    <span v-else :style="{ background: bg }">{{ initial }}</span>
  </span>
</template>

<script setup>
const props = defineProps({
  name: { type: String, default: '' },
  userId: { type: String, default: '' },
  avatar: { type: String, default: '' },
  size: { type: Number, default: 36 }
})
const palettes = ['#e24a3b', '#1b7f73', '#c9a227', '#5c3d5e', '#c4372b', '#2a9d8f']
function hash(s) {
  let h = 0
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}
const initial = computed(() => (props.name || '?').trim().slice(-1))
const bg = computed(() => palettes[hash(props.userId || props.name) % palettes.length])
const src = computed(() => props.avatar ? `/api/avatars/${props.userId}?v=${encodeURIComponent(props.avatar)}` : '')
const broken = ref(false)
watch(() => props.avatar, () => { broken.value = false })
</script>
