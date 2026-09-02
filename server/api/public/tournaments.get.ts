export default defineEventHandler(async () => {
  return prisma.tournament.findMany({
    where: { published: true },
    orderBy: { startsAt: 'desc' }
  })
})
