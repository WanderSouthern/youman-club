import { mkdir, writeFile, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, extname } from 'node:path'
import { randomBytes } from 'node:crypto'

export const UPLOAD_DIR = join(process.cwd(), 'data', 'uploads')

export async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }
}

export function storedPath(storedName: string) {
  return join(UPLOAD_DIR, storedName)
}

function guessExt(file: { filename?: string; type?: string }) {
  const fromName = extname(file.filename || '').slice(0, 8)
  if (fromName) return fromName
  const mime = (file.type || '').split(';')[0].trim()
  const map: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif'
  }
  return map[mime] || '.bin'
}

export async function saveUpload(file: { filename?: string; type?: string; data: Buffer }) {
  await ensureUploadDir()
  const ext = guessExt(file)
  const storedName = `${Date.now()}-${randomBytes(6).toString('hex')}${ext}`
  await writeFile(join(UPLOAD_DIR, storedName), file.data)
  return {
    storedName,
    originalName: file.filename || storedName,
    mime: file.type || 'application/octet-stream',
    size: file.data.length
  }
}

export async function removeUpload(storedName: string) {
  const p = storedPath(storedName)
  if (existsSync(p)) await unlink(p)
}

export function canViewFile(visibility: string, user: { role: string; departmentId: string | null } | null, fileDept: string | null) {
  if (visibility === 'public') return true
  if (!user) return false
  if (user.role === 'pending') return false
  if (visibility === 'club') return true
  if (visibility === 'management') return ['president', 'management', 'minister'].includes(user.role)
  if (visibility === 'department') {
    if (['president', 'management', 'minister'].includes(user.role)) return true
    return !!fileDept && user.departmentId === fileDept
  }
  return false
}
