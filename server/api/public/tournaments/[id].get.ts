export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const item = await prisma.tournament.findFirst({
    where: { OR: [{ id }, { slug: id }], published: true },
    include: {
      files: { include: { file: true } }
    }
  })
  if (!item) throw createError({ statusCode: 404, statusMessage: '赛事不存在' })
  return {
    ...item,
    projects: JSON.parse(item.projects || '[]'),
    files: item.files.map((f) => ({
      id: f.file.id,
      title: f.file.title,
      visibility: f.file.visibility
    }))
  }
})
