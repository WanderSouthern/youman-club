export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const form = await readMultipartFormData(event)
  const filePart = form?.find((p) => p.name === 'file')
  if (!filePart?.data) throw createError({ statusCode: 400, statusMessage: '请选择图片' })
  if (filePart.data.length > 2 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: '头像不超过 2MB' })
  }
  const saved = await saveUpload({ filename: filePart.filename, type: filePart.type, data: filePart.data })
  if (user.avatar) await removeUpload(user.avatar).catch(() => null)
  const updated = await prisma.user.update({ where: { id: user.id }, data: { avatar: saved.storedName } })
  return { user: publicUser(updated) }
})
