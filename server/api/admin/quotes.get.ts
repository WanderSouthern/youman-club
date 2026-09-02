export default defineEventHandler(async (event) => {
  await requireStaff(event)
  return prisma.quote.findMany({ orderBy: { createdAt: 'desc' } })
})
