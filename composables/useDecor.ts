export function useDecor() {
  const enabled = useState('decor-on', () => true)

  onMounted(async () => {
    try {
      const cfg = await $fetch('/api/public/config')
      enabled.value = cfg.bgDecor !== 'off'
    } catch {
      enabled.value = true
    }
  })

  return { enabled }
}
