export default defineEventHandler(async () => {
  const total = await prisma.quote.count({ where: { enabled: true } })
  if (!total) return { quote: null }
  const skip = Math.floor(Math.random() * total)
  const rows = await prisma.quote.findMany({ where: { enabled: true }, skip, take: 1 })
  const row = rows[0]
  return { quote: row ? { content: row.content, source: row.source } : null }
})
