export default defineEventHandler(async (event) => {
  await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const b = await readBody(event)
  const row = await prisma.quote.update({
    where: { id },
    data: {
      content: b.content !== undefined ? String(b.content).trim() : undefined,
      source: b.source !== undefined ? String(b.source).trim() : undefined,
      enabled: b.enabled !== undefined ? !!b.enabled : undefined
    }
  })
  return row
})
