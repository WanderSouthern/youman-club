import bcrypt from 'bcryptjs'

const EDITABLE = ['name', 'email', 'phone', 'qq', 'college', 'grade', 'gameDirection', 'bio', 'title']

export default defineEventHandler(async (event) => {
  const actor = await requireManager(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event)
  const target = await prisma.user.findUnique({ where: { id } })
  if (!target) throw createError({ statusCode: 404, statusMessage: '成员不存在' })

  if (body.role === 'president' && target.role !== 'president') {
    throw createError({ statusCode: 400, statusMessage: '社长席位不可另行分配。换届请直接修改现任社长账号资料。' })
  }
  if (target.role === 'president') {
    if (body.role && body.role !== 'president') {
      throw createError({ statusCode: 400, statusMessage: '社长身份不可更改。' })
    }
    if (body.status === 'disabled') {
      throw createError({ statusCode: 400, statusMessage: '社长账号不可停用。' })
    }
  }

  const data: any = {}
  for (const key of EDITABLE) {
    if (body[key] !== undefined) data[key] = String(body[key])
  }
  if (body.studentId && body.studentId !== target.studentId) {
    data.studentId = String(body.studentId).trim()
  }
  if (body.role && target.role !== 'president') {
    const allowed = ['pending', 'member', 'management']
    if (!allowed.includes(body.role)) {
      throw createError({ statusCode: 400, statusMessage: '身份仅可为待审核、社员或管理员' })
    }
    data.role = body.role
  }
  if (body.status && target.role !== 'president') data.status = body.status
  if (body.departmentId !== undefined) data.departmentId = body.departmentId || null
  if (body.resetPassword) {
    data.passwordHash = await bcrypt.hash(String(body.resetPassword), 10)
  }
  if (data.role && data.role !== 'pending' && !body.status) data.status = 'active'

  try {
    const updated = await prisma.user.update({ where: { id }, data })
    await audit(actor.id, 'member.update', `${updated.studentId} ${updated.role}`)
    return { user: publicUser(updated) }
  } catch (e: any) {
    if (String(e.message || '').includes('Unique')) {
      throw createError({ statusCode: 409, statusMessage: '学号或邮箱已被占用' })
    }
    throw e
  }
})
