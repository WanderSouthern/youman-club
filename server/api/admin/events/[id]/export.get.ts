export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({
    where: { id },
    include: {
      signups: { include: { user: true } },
      checkins: true
    }
  })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  const checked = new Set(ev.checkins.map((c) => c.userId))
  const header = '姓名,学号,学院,年级,报名时间,签到'
  const lines = ev.signups.map((s) =>
    [s.user.name, s.user.studentId, s.user.college, s.user.grade, s.createdAt.toISOString(), checked.has(s.userId) ? '是' : '否'].join(',')
  )
  const csv = `\uFEFF${header}\n${lines.join('\n')}`
  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', `attachment; filename=${encodeURIComponent(ev.title)}.csv`)
  return csv
})
