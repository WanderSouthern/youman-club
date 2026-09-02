export default defineEventHandler(async () => {
  const [departments, events, configs] = await Promise.all([
    prisma.department.findMany({ where: { published: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.event.findMany({
      where: { published: true, startsAt: { gte: new Date(Date.now() - 86400000) } },
      include: { department: true, _count: { select: { signups: true } } },
      orderBy: { startsAt: 'asc' },
      take: 6
    }),
    prisma.siteConfig.findMany()
  ])
  const config = Object.fromEntries(configs.map((c) => [c.key, c.value]))
  return {
    departments,
    events: events.map((e) => shapeEvent(e)),
    config
  }
})
