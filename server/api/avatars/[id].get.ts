import { createReadStream, existsSync } from 'node:fs'
import { extname } from 'node:path'

const MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')!
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) throw createError({ statusCode: 404, statusMessage: '成员不存在' })
  if (user.avatar) {
    const path = storedPath(user.avatar)
    if (existsSync(path)) {
      setHeader(event, 'Content-Type', MIME[extname(user.avatar).toLowerCase()] || 'application/octet-stream')
      setHeader(event, 'Cache-Control', 'public, max-age=3600')
      return sendStream(event, createReadStream(path))
    }
  }
  throw createError({ statusCode: 404, statusMessage: '无头像文件' })
})
