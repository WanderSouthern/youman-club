export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const form = await readMultipartFormData(event)
  if (!form) throw createError({ statusCode: 400, statusMessage: '请选择文件' })
  const filePart = form.find((p) => p.name === 'file')
  if (!filePart?.data) throw createError({ statusCode: 400, statusMessage: '请选择文件' })
  if (filePart.data.length > 20 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: '单文件不超过 20MB' })
  }
  const field = (name: string) => form.find((p) => p.name === name)?.data?.toString('utf8') || ''
  const saved = await saveUpload({ filename: filePart.filename, type: filePart.type, data: filePart.data })
  const visibility = field('visibility') || 'club'
  const departmentId = field('departmentId') || null
  const row = await prisma.fileAsset.create({
    data: {
      title: field('title') || saved.originalName,
      originalName: saved.originalName,
      storedName: saved.storedName,
      mime: saved.mime,
      size: saved.size,
      category: field('category') || 'docs',
      visibility,
      departmentId,
      uploaderId: user.id
    }
  })
  await audit(user.id, 'file.upload', row.title)
  return row
})
