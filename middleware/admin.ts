export default defineNuxtRouteMiddleware(async () => {
  const { user, isStaff, refresh } = useAuth()
  if (!user.value) await refresh()
  if (!user.value) return navigateTo('/login')
  if (!isStaff.value) return navigateTo('/app')
})
