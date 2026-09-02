import { prisma } from './prisma'

export async function eventWithMeta(eventId: string, userId?: string, withComments = false) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      department: true,
      _count: { select: { signups: true, checkins: true, comments: true, likes: true } }
    }
  })
  if (!event) return null
  let signed = false
  let checked = false
  let liked = false
  if (userId) {
    const [s, c, like] = await Promise.all([
      prisma.eventSignup.findUnique({ where: { eventId_userId: { eventId, userId } } }),
      prisma.eventCheckin.findUnique({ where: { eventId_userId: { eventId, userId } } }),
      prisma.eventLike.findUnique({ where: { eventId_userId: { eventId, userId } } })
    ])
    signed = !!s
    checked = !!c
    liked = !!like
  }
  const shaped: any = shapeEvent(event, signed, checked)
  shaped.likeCount = event._count?.likes ?? 0
  shaped.liked = liked
  shaped.commentCount = event._count?.comments ?? 0
  if (withComments) {
    shaped.comments = await loadComments(eventId, userId)
  }
  return shaped
}

export async function loadComments(eventId: string, userId?: string) {
  const rows = await prisma.eventComment.findMany({
    where: { eventId },
    include: {
      user: true,
      _count: { select: { likes: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  let likedIds = new Set<string>()
  if (userId && rows.length) {
    const likes = await prisma.eventCommentLike.findMany({
      where: { userId, commentId: { in: rows.map((r) => r.id) } }
    })
    likedIds = new Set(likes.map((l) => l.commentId))
  }
  return rows.map((r) => ({
    id: r.id,
    content: r.content,
    createdAt: r.createdAt,
    likeCount: r._count.likes,
    liked: likedIds.has(r.id),
    user: {
      id: r.user.id,
      name: r.user.name,
      avatar: r.user.avatar
    }
  }))
}

export function shapeComment(row: any, liked = false, likeCount = 0) {
  return {
    id: row.id,
    content: row.content,
    createdAt: row.createdAt,
    likeCount,
    liked,
    user: row.user
      ? { id: row.user.id, name: row.user.name, avatar: row.user.avatar }
      : { id: '', name: '', avatar: '' }
  }
}

export function shapeEvent(event: any, signed = false, checked = false) {
  return {
    id: event.id,
    title: event.title,
    slug: event.slug,
    kind: event.kind || 'activity',
    coverHue: event.coverHue,
    coverImage: event.coverImage || '',
    summary: event.summary,
    content: event.content,
    location: event.location,
    startsAt: event.startsAt,
    endsAt: event.endsAt,
    signupDeadline: event.signupDeadline,
    capacity: event.capacity,
    requireCheckin: event.requireCheckin,
    checkinOpen: event.checkinOpen,
    published: event.published,
    cancelledAt: event.cancelledAt || null,
    departmentId: event.departmentId || null,
    department: event.department ? { id: event.department.id, name: event.department.name, slug: event.department.slug } : null,
    signupCount: event._count?.signups ?? event.signupCount ?? 0,
    checkinCount: event._count?.checkins ?? 0,
    likeCount: event._count?.likes ?? event.likeCount ?? 0,
    commentCount: event._count?.comments ?? event.commentCount ?? 0,
    signed,
    checked
  }
}

export async function rotateNonce(eventId: string) {
  const nonce = Math.random().toString(36).slice(2, 10)
  const exp = new Date(Date.now() + 45000)
  await prisma.event.update({
    where: { id: eventId },
    data: { checkinNonce: nonce, checkinNonceExp: exp }
  })
  return { nonce, exp }
}

export function slugify(title: string) {
  const base = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]+/g, '')
  return `${base || 'item'}-${Date.now().toString(36)}`
}
