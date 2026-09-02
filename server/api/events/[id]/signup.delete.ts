export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  if (ev.signupDeadline && ev.signupDeadline < new Date()) {
    throw createError({ statusCode: 400, statusMessage: '报名已截止，无法取消' })
  }
  await prisma.eventSignup.deleteMany({ where: { eventId: id, userId: user.id } })
  return eventWithMeta(id, user.id)
})
