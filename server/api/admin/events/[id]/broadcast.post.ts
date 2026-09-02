export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  const b = await readBody(event)
  const body = String(b.body || '').trim()
  if (!body) throw createError({ statusCode: 400, statusMessage: '请填写私信内容' })
  const n = await notifyEventSignups(id, {
    title: `来自组织者 · ${ev.title}`,
    body,
    kind: 'dm',
    fromUserId: user.id
  })
  await audit(user.id, 'event.broadcast', `${ev.title} ${n}`)
  return { ok: true, notified: n }
})
