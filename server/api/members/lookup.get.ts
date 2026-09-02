export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const q = String(getQuery(event).q || '').trim()
  if (q.length < 1) return []
  const rows = await prisma.user.findMany({
    where: {
      status: 'active',
      role: { not: 'pending' },
      id: { not: user.id },
      OR: [
        { name: { contains: q } },
        { studentId: { contains: q } }
      ]
    },
    select: { id: true, name: true, studentId: true, avatar: true, title: true, role: true },
    take: 20
  })
  return rows
})
