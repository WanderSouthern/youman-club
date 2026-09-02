export default defineEventHandler(async (event) => {
  await requireStaff(event)
  return prisma.event.findMany({
    include: { department: true, _count: { select: { signups: true, checkins: true, comments: true, likes: true } } },
    orderBy: { startsAt: 'desc' }
  }).then((rows) => rows.map((e) => shapeEvent(e)))
})
