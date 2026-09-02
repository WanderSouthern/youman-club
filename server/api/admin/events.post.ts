export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const b = await readBody(event)
  const kind = normalizeEventKind(b.kind)
  const row = await prisma.event.create({
    data: {
      title: String(b.title || '未命名活动'),
      slug: slugify(b.title || 'event'),
      coverHue: String(b.coverHue || (kind === 'notice' ? 'gold' : 'teal')),
      summary: String(b.summary || ''),
      content: String(b.content || ''),
      coverImage: String(b.coverImage || ''),
      location: String(b.location || ''),
      startsAt: new Date(b.startsAt || Date.now()),
      endsAt: new Date(b.endsAt || Date.now() + 7200000),
      signupDeadline: kind === 'notice' ? null : (b.signupDeadline ? new Date(b.signupDeadline) : null),
      capacity: kind === 'notice' ? 0 : Number(b.capacity || 0),
      departmentId: b.departmentId || null,
      kind,
      requireCheckin: kind === 'notice' ? false : b.requireCheckin !== false,
      published: b.published !== false
    }
  })
  await audit(user.id, 'event.create', row.title)
  return row
})
