export default defineEventHandler(async (event) => {
  const user = await requireStaff(event)
  const b = await readBody(event)
  const content = String(b.content || '').trim()
  if (!content) throw createError({ statusCode: 400, statusMessage: '请填写格言' })
  const row = await prisma.quote.create({
    data: {
      content,
      source: String(b.source || '').trim(),
      enabled: b.enabled !== false
    }
  })
  await audit(user.id, 'quote.create', content.slice(0, 40))
  return row
})
