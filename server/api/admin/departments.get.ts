export default defineEventHandler(async (event) => {
  await requireStaff(event)
  return prisma.department.findMany({ orderBy: { sortOrder: 'asc' } })
})
