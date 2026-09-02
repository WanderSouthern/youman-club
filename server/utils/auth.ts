import { randomBytes, createHmac } from 'node:crypto'
import type { H3Event } from 'h3'
import { prisma } from './prisma'
import type { User } from '@prisma/client'

export const STAFF_ROLES = ['president', 'management', 'minister'] as const
export const MANAGE_ALL_ROLES = ['president', 'management', 'minister'] as const

export function isStaff(role: string) {
  return (STAFF_ROLES as readonly string[]).includes(role)
}

export function canManageAll(role: string) {
  return (MANAGE_ALL_ROLES as readonly string[]).includes(role)
}

export function roleLabel(role: string) {
  const map: Record<string, string> = {
    president: '社长',
    management: '管理员',
    minister: '管理员',
    member: '社员',
    pending: '待审核'
  }
  return map[role] || role
}

function secret() {
  return useRuntimeConfig().sessionSecret
}

export function signToken(raw: string) {
  return createHmac('sha256', secret()).update(raw).digest('hex')
}

export async function createSession(event: H3Event, userId: string) {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21)
  await prisma.session.create({ data: { token: signToken(token), userId, expiresAt } })
  setCookie(event, 'youman_sid', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 21
  })
}

export async function destroyAuthSession(event: H3Event) {
  const token = getCookie(event, 'youman_sid')
  if (token) {
    await prisma.session.deleteMany({ where: { token: signToken(token) } })
  }
  deleteCookie(event, 'youman_sid', { path: '/' })
}

export async function getAuthUser(event: H3Event): Promise<User | null> {
  const token = getCookie(event, 'youman_sid')
  if (!token) return null
  const session = await prisma.session.findUnique({
    where: { token: signToken(token) },
    include: { user: true }
  })
  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } })
    return null
  }
  if (session.user.status === 'disabled') return null
  return session.user
}

export async function requireUser(event: H3Event) {
  const user = await getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: '请先登录' })
  }
  if (user.status === 'pending' || user.role === 'pending') {
    throw createError({ statusCode: 403, statusMessage: '账号待审核' })
  }
  return user
}

export async function requireStaff(event: H3Event) {
  const user = await requireUser(event)
  if (!isStaff(user.role)) {
    throw createError({ statusCode: 403, statusMessage: '权限不足' })
  }
  return user
}

export async function requireManager(event: H3Event) {
  const user = await requireUser(event)
  if (!canManageAll(user.role)) {
    throw createError({ statusCode: 403, statusMessage: '仅管理层可操作' })
  }
  return user
}

export async function audit(userId: string | null, action: string, detail = '') {
  await prisma.auditLog.create({ data: { userId, action, detail } })
}

export function publicUser(user: User) {
  return {
    id: user.id,
    studentId: user.studentId,
    name: user.name,
    email: user.email,
    phone: user.phone,
    qq: user.qq,
    college: user.college,
    grade: user.grade,
    gameDirection: user.gameDirection,
    bio: user.bio,
    avatar: user.avatar,
    title: user.title || '',
    role: user.role,
    status: user.status,
    departmentId: user.departmentId,
    createdAt: user.createdAt
  }
}
