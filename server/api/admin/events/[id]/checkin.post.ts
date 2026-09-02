export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  const body = await readBody(event).catch(() => ({}))
  const open = body.open !== false
  let code = ev.checkinCode
  if (open && !code) {
    code = `YMS-${Math.floor(1000 + Math.random() * 9000)}`
  }
  await prisma.event.update({
    where: { id },
    data: { checkinOpen: open, checkinCode: code }
  })
  if (open) await rotateNonce(id)
  await audit(user.id, open ? 'checkin.open' : 'checkin.close', ev.title)
  return { ok: true, checkinOpen: open, checkinCode: code }
})
