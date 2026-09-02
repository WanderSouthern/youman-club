import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const b = await readBody(event)
  const studentId = String(b?.studentId || '').trim()
  const name = String(b?.name || '').trim()
  const email = String(b?.email || '').trim()
  const password = String(b?.password || '')
  if (!studentId || !name || !email || password.length < 8) {
    throw createError({ statusCode: 400, statusMessage: '请完整填写，密码不少于 8 位' })
  }
  const exists = await prisma.user.findFirst({
    where: { OR: [{ studentId }, { email }] }
  })
  if (exists) {
    throw createError({ statusCode: 409, statusMessage: '学号或邮箱已注册' })
  }
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      studentId,
      name,
      email,
      passwordHash,
      phone: String(b?.phone || ''),
      qq: String(b?.qq || ''),
      college: String(b?.college || ''),
      grade: String(b?.grade || ''),
      gameDirection: String(b?.gameDirection || ''),
      bio: String(b?.intro || b?.bio || ''),
      departmentId: b?.departmentId || null,
      role: 'pending',
      status: 'pending'
    }
  })
  await createSession(event, user.id)
  await audit(user.id, 'register', studentId)
  notifyBot({ type: 'member_pending', name: user.name, studentId }).catch(() => null)
  return { user: publicUser(user) }
})
