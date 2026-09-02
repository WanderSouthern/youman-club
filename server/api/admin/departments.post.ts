export default defineEventHandler(async (event) => {
  const actor = await requireManager(event)
  const b = await readBody(event)
  const row = await prisma.department.create({
    data: {
      slug: slugify(b.name || 'dept'),
      name: String(b.name || '').trim() || '未命名部门',
      shortName: String(b.shortName || ''),
      summary: String(b.summary || ''),
      description: String(b.description || ''),
      duties: String(b.duties || ''),
      ministerNote: String(b.ministerNote || ''),
      coverHue: String(b.coverHue || 'coral'),
      sortOrder: Number(b.sortOrder || 9),
      published: b.published !== false
    }
  })
  await audit(actor.id, 'department.create', row.name)
  return row
})
