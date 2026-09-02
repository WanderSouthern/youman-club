export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  if (ev.cancelledAt) return { ok: true, cancelledAt: ev.cancelledAt }
  const row = await prisma.event.update({
    where: { id },
    data: { cancelledAt: new Date(), checkinOpen: false, published: true }
  })
  const n = await notifyEventSignups(id, {
    title: '活动取消',
    body: `「${ev.title}」已取消。`,
    systemType: 'event_cancel'
  })
  await audit(user.id, 'event.cancel', ev.title)
  notifyBot({ type: 'event_cancel', title: ev.title, eventId: id, notified: n }).catch(() => null)
  return { ok: true, cancelledAt: row.cancelledAt, notified: n }
})
