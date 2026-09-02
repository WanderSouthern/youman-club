export default defineEventHandler(async (event) => {
  const b = await readBody(event)
  const name = String(b?.name || '').trim()
  const studentId = String(b?.studentId || '').trim()
  const email = String(b?.email || '').trim()
  if (!name || !studentId || !email) {
    throw createError({ statusCode: 400, statusMessage: '姓名、学号、邮箱为必填' })
  }
  const row = await prisma.recruitIntent.create({
    data: {
      name,
      studentId,
      email,
      college: String(b?.college || ''),
      grade: String(b?.grade || ''),
      phone: String(b?.phone || ''),
      qq: String(b?.qq || ''),
      gameDirection: String(b?.gameDirection || ''),
      intro: String(b?.intro || ''),
      departmentId: b?.departmentId || null
    }
  })
  notifyBot({ type: 'recruit', name: row.name, studentId: row.studentId }).catch(() => null)
  return { ok: true, id: row.id }
})
