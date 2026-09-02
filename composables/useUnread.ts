export function useUnread() {
  const count = useState('unread-count', () => 0)
  const { user } = useAuth()

  async function refreshUnread() {
    if (!user.value || user.value.role === 'pending') {
      count.value = 0
      return 0
    }
    try {
      const r = await $fetch('/api/me/unread')
      count.value = r.count || 0
    } catch {
      count.value = 0
    }
    return count.value
  }

  return { count, refreshUnread }
}
