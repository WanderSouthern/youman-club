export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const b = await readBody(event)
  const toUserId = String(b.toUserId || '')
  const body = String(b.body || '').trim()
  if (!toUserId || !body) throw createError({ statusCode: 400, statusMessage: '请选择收件人并填写内容' })
  if (toUserId === user.id) throw createError({ statusCode: 400, statusMessage: '不能给自己发私信' })
  const target = await prisma.user.findUnique({ where: { id: toUserId } })
  if (!target || target.status !== 'active' || target.role === 'pending') {
    throw createError({ statusCode: 404, statusMessage: '收件人不存在' })
  }
  const title = String(b.title || '').trim() || `来自 ${user.name}`
  await sendInbox([{
    userId: toUserId,
    fromUserId: user.id,
    kind: 'dm',
    title,
    body
  }])
  return { ok: true }
})
