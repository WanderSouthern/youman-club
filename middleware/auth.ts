export default defineNuxtRouteMiddleware(async () => {
  const { user, refresh } = useAuth()
  if (!user.value) await refresh()
  if (!user.value) {
    return navigateTo('/login')
  }
  if (user.value.status !== 'active' || user.value.role === 'pending') {
    return navigateTo('/pending')
  }
})
