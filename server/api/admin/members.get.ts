export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const q = getQuery(event)
  const keyword = String(q.q || '').trim()
  const where: any = {}
  if (q.status) where.status = String(q.status)
  if (q.role === 'management') where.role = { in: ['management', 'minister'] }
  else if (q.role) where.role = String(q.role)
  if (q.departmentId) where.departmentId = String(q.departmentId)
  if (keyword) {
    where.OR = [
      { name: { contains: keyword } },
      { studentId: { contains: keyword } },
      { email: { contains: keyword } },
      { college: { contains: keyword } },
      { grade: { contains: keyword } },
      { phone: { contains: keyword } },
      { qq: { contains: keyword } },
      { gameDirection: { contains: keyword } },
      { title: { contains: keyword } }
    ]
  }
  const rows = await prisma.user.findMany({
    where,
    include: {
      department: true,
      _count: { select: { signups: true, checkins: true } }
    },
    orderBy: [{ role: 'asc' }, { createdAt: 'desc' }]
  })
  const order = ['president', 'management', 'minister', 'member', 'pending']
  rows.sort((a, b) => order.indexOf(a.role) - order.indexOf(b.role))
  return rows.map((u) => ({
    ...publicUser(u),
    department: u.department ? { id: u.department.id, name: u.department.name } : null,
    signupCount: u._count.signups,
    checkinCount: u._count.checkins
  }))
})
