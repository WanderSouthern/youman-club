export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({
    where: { id },
    include: { _count: { select: { signups: true } } }
  })
  if (!ev || !ev.published) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  if (ev.kind === 'notice') throw createError({ statusCode: 400, statusMessage: '通知无需报名' })
  if (ev.cancelledAt) throw createError({ statusCode: 400, statusMessage: '活动已取消' })
  if (ev.signupDeadline && ev.signupDeadline < new Date()) {
    throw createError({ statusCode: 400, statusMessage: '报名已截止' })
  }
  if (ev.capacity > 0 && ev._count.signups >= ev.capacity) {
    throw createError({ statusCode: 400, statusMessage: '名额已满' })
  }
  await prisma.eventSignup.upsert({
    where: { eventId_userId: { eventId: id, userId: user.id } },
    update: {},
    create: { eventId: id, userId: user.id }
  })
  return eventWithMeta(id, user.id)
})
