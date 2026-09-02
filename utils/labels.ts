export function fmtDate(value: string | Date | null | undefined) {
  if (!value) return '待定'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '待定'
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function fmtDay(value: string | Date | null | undefined) {
  if (!value) return ''
  const d = new Date(value)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', weekday: 'short' })
}

export function toDatetimeLocal(value?: string | Date | null) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const IDENTITY_OPTIONS = [
  { value: 'pending', label: '待审核' },
  { value: 'member', label: '社员' },
  { value: 'management', label: '管理员' }
]

export const ROLE_OPTIONS = IDENTITY_OPTIONS

export function identityName(role?: string) {
  if (role === 'president') return '社长'
  if (role === 'management' || role === 'minister') return '管理员'
  if (role === 'pending') return '待审核'
  return '社员'
}

export function displayTitle(user?: { role?: string; title?: string } | null) {
  if (!user) return ''
  const t = (user.title || '').trim()
  if (t) return t
  return identityName(user.role)
}

export const FILE_CATEGORIES = [
  { value: 'rules', label: '社团制度' },
  { value: 'guides', label: '使用说明' },
  { value: 'events', label: '活动资料' },
  { value: 'tools', label: '开发工具' },
  { value: 'projects', label: '作品存档' },
  { value: 'gamedev', label: '研发文档' },
  { value: 'tutorials', label: '教程资源' }
]

export const EVENT_KINDS = [
  { value: 'activity', label: '活动' },
  { value: 'notice', label: '通知' }
]

export function kindLabel(kind?: string) {
  if (kind === 'notice') return '通知'
  return '活动'
}

export function normalizeEventKind(kind?: string) {
  return kind === 'notice' ? 'notice' : 'activity'
}

export function statusLabel(status?: string) {
  if (status === 'active') return '正常'
  if (status === 'pending') return '待审'
  if (status === 'disabled') return '停用'
  return status || ''
}

export const VISIBILITY = [
  { value: 'public', label: '公开' },
  { value: 'club', label: '全社' },
  { value: 'department', label: '本部门' },
  { value: 'management', label: '管理级' }
]
