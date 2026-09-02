export default defineEventHandler(async (event) => {
  const actor = await requireManager(event)
  const id = getRouterParam(event, 'id')!
  const b = await readBody(event)
  const row = await prisma.department.update({
    where: { id },
    data: {
      name: b.name,
      shortName: b.shortName,
      summary: b.summary,
      description: b.description,
      duties: b.duties,
      ministerNote: b.ministerNote,
      coverHue: b.coverHue,
      sortOrder: b.sortOrder,
      published: b.published
    }
  })
  await audit(actor.id, 'department.update', row.name)
  return row
})
