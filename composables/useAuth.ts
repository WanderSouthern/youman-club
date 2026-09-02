export function useAuth() {
  const user = useState('auth-user', () => null)

  const isStaff = computed(() => ['president', 'management', 'minister'].includes(user.value?.role || ''))
  const isManager = computed(() => ['president', 'management', 'minister'].includes(user.value?.role || ''))

  async function refresh() {
    try {
      const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
      const data = await $fetch('/api/auth/me', { headers })
      user.value = data.user
    } catch {
      user.value = null
    }
    return user.value
  }

  async function login(studentId, password) {
    const data = await $fetch('/api/auth/login', { method: 'POST', body: { studentId, password } })
    user.value = data.user
    return data
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/')
  }

  return { user, isStaff, isManager, refresh, login, logout }
}
