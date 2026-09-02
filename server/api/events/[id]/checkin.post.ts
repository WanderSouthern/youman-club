export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const id = getRouterParam(event, 'id')!
  const body = await readBody(event).catch(() => ({}))
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  if (!ev.checkinOpen) throw createError({ statusCode: 400, statusMessage: '签到尚未开启' })

  const signed = await prisma.eventSignup.findUnique({
    where: { eventId_userId: { eventId: id, userId: user.id } }
  })
  if (!signed) throw createError({ statusCode: 400, statusMessage: '请先报名再签到' })

  const nonce = String(body?.nonce || '')
  const code = String(body?.code || '').trim()
  let method = ''
  if (code && ev.checkinCode && code.toUpperCase() === ev.checkinCode.toUpperCase()) {
    method = 'code'
  } else if (
    nonce &&
    ev.checkinNonce &&
    nonce === ev.checkinNonce &&
    ev.checkinNonceExp &&
    ev.checkinNonceExp > new Date()
  ) {
    method = 'qr'
  } else {
    throw createError({ statusCode: 400, statusMessage: '签到码或二维码已失效' })
  }

  await prisma.eventCheckin.upsert({
    where: { eventId_userId: { eventId: id, userId: user.id } },
    update: {},
    create: { eventId: id, userId: user.id, method }
  })
  return { ok: true, method, already: false, ...await eventWithMeta(id, user.id) }
})
