import { prisma } from './prisma'

export async function sendInbox(
  rows: Array<{
    userId: string
    fromUserId?: string | null
    kind?: string
    systemType?: string
    eventId?: string | null
    title: string
    body?: string
  }>
) {
  if (!rows.length) return
  await prisma.inboxMessage.createMany({
    data: rows.map((r) => ({
      userId: r.userId,
      fromUserId: r.fromUserId || null,
      kind: r.kind || 'dm',
      systemType: r.systemType || '',
      eventId: r.eventId || null,
      title: r.title,
      body: r.body || ''
    }))
  })
}

export async function notifyEventSignups(
  eventId: string,
  payload: { title: string; body: string; systemType?: string; fromUserId?: string | null; kind?: string }
) {
  const signups = await prisma.eventSignup.findMany({
    where: {
      eventId,
      user: { status: 'active', role: { not: 'pending' } }
    },
    select: { userId: true }
  })
  await sendInbox(
    signups.map((s) => ({
      userId: s.userId,
      fromUserId: payload.fromUserId || null,
      kind: payload.kind || (payload.fromUserId ? 'dm' : 'system'),
      systemType: payload.systemType || '',
      eventId,
      title: payload.title,
      body: payload.body
    }))
  )
  return signups.length
}

export async function flushEventNotices() {
  const now = new Date()
  const starting = await prisma.event.findMany({
    where: {
      published: true,
      cancelledAt: null,
      notifiedStart: false,
      kind: { not: 'notice' },
      startsAt: { lte: now }
    }
  })
  for (const ev of starting) {
    await notifyEventSignups(ev.id, {
      title: '活动开始',
      body: `「${ev.title}」已开始。`,
      systemType: 'event_start'
    })
    await prisma.event.update({ where: { id: ev.id }, data: { notifiedStart: true } })
  }
  const ending = await prisma.event.findMany({
    where: {
      published: true,
      cancelledAt: null,
      notifiedEnd: false,
      kind: { not: 'notice' },
      endsAt: { lte: now }
    }
  })
  for (const ev of ending) {
    await notifyEventSignups(ev.id, {
      title: '活动结束',
      body: `「${ev.title}」已结束。`,
      systemType: 'event_end'
    })
    await prisma.event.update({ where: { id: ev.id }, data: { notifiedEnd: true } })
  }
}

export async function unreadCount(userId: string) {
  return prisma.inboxMessage.count({ where: { userId, readAt: null } })
}
