<script setup>
const route = useRoute()
await navigateTo('/events/' + route.params.id, { redirectCode: 301 })
</script>
