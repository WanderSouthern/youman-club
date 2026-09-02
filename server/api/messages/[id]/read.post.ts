export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')!
  const row = await prisma.inboxMessage.findUnique({ where: { id } })
  if (!row || row.userId !== user.id) throw createError({ statusCode: 404, statusMessage: '消息不存在' })
  if (!row.readAt) {
    await prisma.inboxMessage.update({ where: { id }, data: { readAt: new Date() } })
  }
  return { ok: true }
})
