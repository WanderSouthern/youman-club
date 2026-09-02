import QRCode from 'qrcode'

export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev || !ev.checkinOpen) {
    throw createError({ statusCode: 400, statusMessage: '签到未开启' })
  }
  let nonce = ev.checkinNonce
  let exp = ev.checkinNonceExp
  if (!nonce || !exp || exp < new Date()) {
    const rotated = await rotateNonce(id)
    nonce = rotated.nonce
    exp = rotated.exp
  }
  const origin = getRequestURL(event).origin
  const url = `${origin}/checkin?e=${id}&n=${nonce}`
  const qrDataUrl = await QRCode.toDataURL(url, { margin: 1, width: 280, color: { dark: '#1c1410', light: '#ffffff' } })
  return { qrDataUrl, url, checkinCode: ev.checkinCode, expiresAt: exp }
})
