export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const q = getQuery(event)
  const keyword = String(q.q || '').trim()
  const category = String(q.category || '').trim()
  const visibility = String(q.visibility || '').trim()
  const where: any = {}
  if (category) where.category = category
  if (visibility) where.visibility = visibility
  const list = await prisma.fileAsset.findMany({
    where,
    include: { department: true, uploader: true },
    orderBy: { createdAt: 'desc' }
  })
  const catMap: Record<string, string> = {
    rules: '社团制度',
    guides: '使用说明',
    events: '活动资料',
    tools: '开发工具',
    projects: '作品存档',
    gamedev: '研发文档',
    tutorials: '教程资源'
  }
  return list
    .filter((f) => canViewFile(f.visibility, user, f.departmentId))
    .filter((f) => {
      if (!keyword) return true
      const blob = [
        f.title,
        f.originalName,
        f.uploader.name,
        f.department?.name || '',
        catMap[f.category] || f.category,
        f.visibility
      ].join(' ')
      return blob.includes(keyword)
    })
    .map((f) => ({
      id: f.id,
      title: f.title,
      originalName: f.originalName,
      mime: f.mime,
      size: f.size,
      category: f.category,
      visibility: f.visibility,
      department: f.department ? { id: f.department.id, name: f.department.name } : null,
      uploader: f.uploader.name,
      createdAt: f.createdAt
    }))
})
