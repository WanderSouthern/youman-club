export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const list = await prisma.tournament.findMany({ orderBy: { startsAt: 'desc' } })
  return list.map((t) => ({ ...t, projects: JSON.parse(t.projects || '[]') }))
})
