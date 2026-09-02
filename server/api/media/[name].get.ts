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
  const name = getRouterParam(event, 'name') || ''
  if (!/^[A-Za-z0-9._-]+$/.test(name)) {
    throw createError({ statusCode: 400, statusMessage: '无效文件名' })
  }
  const path = storedPath(name)
  if (!existsSync(path)) {
    throw createError({ statusCode: 404, statusMessage: '文件不存在' })
  }
  setHeader(event, 'Content-Type', MIME[extname(name).toLowerCase()] || 'application/octet-stream')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  return sendStream(event, createReadStream(path))
})
