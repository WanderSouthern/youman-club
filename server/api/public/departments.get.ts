export default defineEventHandler(async () => {
  return prisma.department.findMany({
    where: { published: true },
    orderBy: { sortOrder: 'asc' }
  })
})
