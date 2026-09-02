export default defineNitroPlugin(() => {
  const tick = () => {
    flushEventNotices().catch(() => null)
  }
  tick()
  setInterval(tick, 60_000)
})
