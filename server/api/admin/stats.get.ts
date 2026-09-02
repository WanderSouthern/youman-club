export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const [users, events, intents, files] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.recruitIntent.count(),
    prisma.fileAsset.count()
  ])
  const pending = await prisma.user.count({ where: { status: 'pending' } })
  const recentLogs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 8,
    include: { user: true }
  })
  return {
    users,
    pending,
    events,
    intents,
    files,
    logs: recentLogs.map((l) => ({
      id: l.id,
      action: l.action,
      detail: l.detail,
      name: l.user?.name || '系统',
      createdAt: l.createdAt
    }))
  }
})
