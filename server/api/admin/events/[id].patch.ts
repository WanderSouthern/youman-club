export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const id = getRouterParam(event, 'id')!
  const ev = await prisma.event.findUnique({ where: { id } })
  if (!ev) throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  const b = await readBody(event)
  const kind = b.kind === undefined ? (ev.kind === 'notice' ? 'notice' : 'activity') : normalizeEventKind(b.kind)
  const row = await prisma.event.update({
    where: { id },
    data: {
      title: b.title ?? ev.title,
      summary: b.summary ?? ev.summary,
      content: b.content ?? ev.content,
      coverImage: b.coverImage === undefined ? ev.coverImage : String(b.coverImage || ''),
      location: b.location ?? ev.location,
      coverHue: b.coverHue ?? ev.coverHue,
      startsAt: b.startsAt ? new Date(b.startsAt) : ev.startsAt,
      endsAt: b.endsAt ? new Date(b.endsAt) : ev.endsAt,
      signupDeadline: kind === 'notice'
        ? null
        : (b.signupDeadline === undefined ? ev.signupDeadline : (b.signupDeadline ? new Date(b.signupDeadline) : null)),
      capacity: kind === 'notice' ? 0 : (b.capacity === undefined ? ev.capacity : Number(b.capacity)),
      requireCheckin: kind === 'notice' ? false : (b.requireCheckin ?? ev.requireCheckin),
      published: b.published ?? ev.published,
      kind,
      departmentId: b.departmentId === undefined ? ev.departmentId : (b.departmentId || null)
    }
  })
  await audit(user.id, 'event.update', row.title)
  return row
})
