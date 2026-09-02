export default defineEventHandler(async (event) => {
  await requireStaff(event)
  return prisma.recruitIntent.findMany({
    include: { department: true },
    orderBy: { createdAt: 'desc' }
  })
})
