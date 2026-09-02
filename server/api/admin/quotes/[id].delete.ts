export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  await prisma.quote.delete({ where: { id } })
  return { ok: true }
})
