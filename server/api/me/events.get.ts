export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const signups = await prisma.eventSignup.findMany({
    where: { userId: user.id },
    include: { event: { include: { department: true, _count: { select: { signups: true, checkins: true } } } } },
    orderBy: { createdAt: 'desc' }
  })
  const checkins = await prisma.eventCheckin.findMany({ where: { userId: user.id } })
  const checkedIds = new Set(checkins.map((c) => c.eventId))
  return {
    events: signups.map((s) => ({
      ...shapeEvent(s.event, true, checkedIds.has(s.eventId)),
      signedAt: s.createdAt
    })),
    checkinCount: checkins.length
  }
})
