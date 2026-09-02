<template>
  <div v-if="enabled" class="bg-decor decor-seal" aria-hidden="true" />
</template>

<script setup>
const { enabled } = useDecor()
</script>
