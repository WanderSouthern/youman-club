export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const rows = await prisma.siteConfig.findMany()
  return Object.fromEntries(rows.map((r) => [r.key, r.value]))
})
