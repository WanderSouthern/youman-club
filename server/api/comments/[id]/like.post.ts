export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')!
  const comment = await prisma.eventComment.findUnique({ where: { id } })
  if (!comment) throw createError({ statusCode: 404, statusMessage: '评论不存在' })
  const existing = await prisma.eventCommentLike.findUnique({
    where: { commentId_userId: { commentId: id, userId: user.id } }
  })
  if (existing) {
    await prisma.eventCommentLike.delete({ where: { id: existing.id } })
  } else {
    await prisma.eventCommentLike.create({ data: { commentId: id, userId: user.id } })
  }
  const likeCount = await prisma.eventCommentLike.count({ where: { commentId: id } })
  return { liked: !existing, likeCount }
})
