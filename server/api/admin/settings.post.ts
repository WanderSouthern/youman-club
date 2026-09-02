export default defineEventHandler(async (event) => {
  const user = await requireManager(event)
  const body = await readBody(event)
  const entries = Object.entries(body || {})
  for (const [key, value] of entries) {
    await prisma.siteConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) }
    })
  }
  await audit(user.id, 'settings.update', entries.map(([k]) => k).join(','))
  return { ok: true }
})
