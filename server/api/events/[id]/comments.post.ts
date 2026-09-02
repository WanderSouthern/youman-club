export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')!
  const b = await readBody(event)
  const content = String(b.content || '').trim()
  if (!content) throw createError({ statusCode: 400, statusMessage: '请填写评论' })
  if (content.length > 800) throw createError({ statusCode: 400, statusMessage: '评论不超过 800 字' })
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev || !ev.published) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  const row = await prisma.eventComment.create({
    data: { eventId: id, userId: user.id, content },
    include: { user: true }
  })
  return shapeComment(row, false, 0)
})
