import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const studentId = String(body?.studentId || '').trim()
  const password = String(body?.password || '')
  if (!studentId || !password) {
    throw createError({ statusCode: 400, statusMessage: '请填写学号与密码' })
  }
  const user = await prisma.user.findUnique({ where: { studentId } })
  if (!user || user.status === 'disabled') {
    throw createError({ statusCode: 401, statusMessage: '学号或密码不正确' })
  }
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    throw createError({ statusCode: 401, statusMessage: '学号或密码不正确' })
  }
  await createSession(event, user.id)
  await audit(user.id, 'login', studentId)
  return { user: publicUser(user) }
})
