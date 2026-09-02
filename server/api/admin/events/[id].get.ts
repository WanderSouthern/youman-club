export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({
    where: { id },
    include: {
      signups: { include: { user: true }, orderBy: { createdAt: 'asc' } },
      checkins: true
    }
  })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  const checked = new Set(ev.checkins.map((c) => c.userId))
  return {
    event: shapeEvent({ ...ev, _count: { signups: ev.signups.length, checkins: ev.checkins.length } }),
    checkinOpen: ev.checkinOpen,
    checkinCode: ev.checkinCode,
    signups: ev.signups.map((s) => ({
      id: s.id,
      name: s.user.name,
      studentId: s.user.studentId,
      college: s.user.college,
      createdAt: s.createdAt,
      checkedIn: checked.has(s.userId)
    }))
  }
})
