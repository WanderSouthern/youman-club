export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const file = await prisma.fileAsset.findUnique({ where: { id } })
  if (!file) throw createError({ statusCode: 404, statusMessage: '文件不存在' })
  await prisma.fileAsset.delete({ where: { id } })
  await removeUpload(file.storedName)
  await audit(user.id, 'file.delete', file.title)
  return { ok: true }
})
