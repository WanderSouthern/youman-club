export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  await flushEventNotices()
  return { count: await unreadCount(user.id) }
})
