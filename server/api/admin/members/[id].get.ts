export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      department: true,
      signups: {
        include: { event: true },
        orderBy: { createdAt: 'desc' }
      },
      checkins: true
    }
  })
  if (!user) throw createError({ statusCode: 404, statusMessage: '成员不存在' })
  const checked = new Set(user.checkins.map((c) => c.eventId))
  return {
    user: {
      ...publicUser(user),
      department: user.department ? { id: user.department.id, name: user.department.name } : null
    },
    activities: user.signups.map((s) => ({
      id: s.event.id,
      title: s.event.title,
      kind: s.event.kind,
      startsAt: s.event.startsAt,
      location: s.event.location,
      signedAt: s.createdAt,
      checkedIn: checked.has(s.eventId)
    }))
  }
})
