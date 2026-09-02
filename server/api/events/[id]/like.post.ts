export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({ where: { id }, include: { _count: { select: { likes: true } } } })
  if (!ev || !ev.published) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  const existing = await prisma.eventLike.findUnique({
    where: { eventId_userId: { eventId: id, userId: user.id } }
  })
  if (existing) {
    await prisma.eventLike.delete({ where: { id: existing.id } })
  } else {
    await prisma.eventLike.create({ data: { eventId: id, userId: user.id } })
  }
  const likeCount = await prisma.eventLike.count({ where: { eventId: id } })
  return { liked: !existing, likeCount }
})
