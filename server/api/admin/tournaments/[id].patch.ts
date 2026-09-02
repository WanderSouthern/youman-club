export default defineEventHandler(async (event) => {
  const user = await requireManager(event)
  const id = getRouterParam(event, 'id')!
  const b = await readBody(event)
  const projects = b.projects === undefined
    ? undefined
    : JSON.stringify(Array.isArray(b.projects) ? b.projects : String(b.projects).split('\n').filter(Boolean))
  const row = await prisma.tournament.update({
    where: { id },
    data: {
      title: b.title,
      summary: b.summary,
      content: b.content,
      location: b.location,
      coverHue: b.coverHue,
      startsAt: b.startsAt ? new Date(b.startsAt) : undefined,
      endsAt: b.endsAt ? new Date(b.endsAt) : undefined,
      signupNote: b.signupNote,
      resultNote: b.resultNote,
      published: b.published,
      ...(projects ? { projects } : {})
    }
  })
  await audit(user.id, 'tournament.update', row.title)
  return row
})
