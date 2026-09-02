export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')!
  const dept = await prisma.department.findUnique({ where: { slug } })
  if (!dept || !dept.published) {
    throw createError({ statusCode: 404, statusMessage: '部门不存在' })
  }
  const events = await prisma.event.findMany({
    where: { published: true, departmentId: dept.id },
    include: { department: true, _count: { select: { signups: true } } },
    orderBy: { startsAt: 'desc' },
    take: 6
  })
  return { department: dept, events: events.map((e) => shapeEvent(e)) }
})
