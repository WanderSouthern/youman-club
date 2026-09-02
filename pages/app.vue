<template>
  <NuxtPage />
</template>

<script setup>
definePageMeta({
  layout: 'app',
  middleware: 'auth'
})
</script>
