export default defineEventHandler(async () => {
  const bg = await prisma.siteConfig.findUnique({ where: { key: 'bgDecor' } })
  const total = await prisma.quote.count({ where: { enabled: true } })
  let quote = null
  if (total) {
    const skip = Math.floor(Math.random() * total)
    const rows = await prisma.quote.findMany({ where: { enabled: true }, skip, take: 1 })
    if (rows[0]) quote = { content: rows[0].content, source: rows[0].source }
  }
  return {
    bgDecor: bg?.value === 'off' ? 'off' : 'on',
    quote
  }
})
