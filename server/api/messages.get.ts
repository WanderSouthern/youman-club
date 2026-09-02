export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  await flushEventNotices()
  const kind = String(getQuery(event).kind || '')
  const where: any = { userId: user.id }
  if (kind === 'system' || kind === 'dm') where.kind = kind
  const rows = await prisma.inboxMessage.findMany({
    where,
    include: {
      fromUser: { select: { id: true, name: true, avatar: true, studentId: true } },
      event: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 200
  })
  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    systemType: r.systemType,
    title: r.title,
    body: r.body,
    readAt: r.readAt,
    createdAt: r.createdAt,
    event: r.event,
    from: r.fromUser
  }))
})
