export default defineEventHandler(async (event) => {
  const user = await requireManager(event)
  const b = await readBody(event)
  const projects = Array.isArray(b.projects) ? b.projects : String(b.projects || '').split('\n').filter(Boolean)
  const row = await prisma.tournament.create({
    data: {
      title: String(b.title || '未命名赛事'),
      slug: slugify(b.title || 'cup'),
      coverHue: String(b.coverHue || 'gold'),
      summary: String(b.summary || ''),
      content: String(b.content || ''),
      location: String(b.location || ''),
      startsAt: new Date(b.startsAt || Date.now()),
      endsAt: new Date(b.endsAt || Date.now() + 86400000),
      signupNote: String(b.signupNote || ''),
      projects: JSON.stringify(projects),
      resultNote: String(b.resultNote || ''),
      published: b.published !== false
    }
  })
  await audit(user.id, 'tournament.create', row.title)
  return row
})
