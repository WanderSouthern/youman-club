export default defineEventHandler(async (event) => {
  const actor = await requireManager(event)
  const id = getRouterParam(event, 'id')!
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) throw createError({ statusCode: 404, statusMessage: '成员不存在' })
  const form = await readMultipartFormData(event)
  const filePart = form?.find((p) => p.name === 'file')
  if (!filePart?.data) throw createError({ statusCode: 400, statusMessage: '请选择图片' })
  if (filePart.data.length > 2 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: '头像不超过 2MB' })
  }
  const saved = await saveUpload({ filename: filePart.filename, type: filePart.type, data: filePart.data })
  if (target.avatar) await removeUpload(target.avatar).catch(() => null)
  const updated = await prisma.user.update({ where: { id }, data: { avatar: saved.storedName } })
  await audit(actor.id, 'member.avatar', updated.studentId)
  return { user: publicUser(updated) }
})
