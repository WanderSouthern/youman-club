export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  const query = getQuery(event)
  const where: any = { published: true }
  if (query.departmentId) where.departmentId = String(query.departmentId)
  const keyword = String(query.q || '').trim()
  if (keyword) {
    where.OR = [
      { title: { contains: keyword } },
      { summary: { contains: keyword } },
      { location: { contains: keyword } },
      { content: { contains: keyword } }
    ]
  }
  const list = await prisma.event.findMany({
    where,
    include: { department: true, _count: { select: { signups: true, checkins: true } } },
    orderBy: { startsAt: 'asc' }
  })
  const shaped = await Promise.all(list.map(async (e) => {
    const meta = await eventWithMeta(e.id, user?.id)
    return meta
  }))
  return shaped
})
