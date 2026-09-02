import { createReadStream, existsSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  const id = getRouterParam(event, 'id')!
  const file = await prisma.fileAsset.findUnique({ where: { id } })
  if (!file) throw createError({ statusCode: 404, statusMessage: '文件不存在' })
  if (!canViewFile(file.visibility, user, file.departmentId)) {
    throw createError({ statusCode: 403, statusMessage: '无权下载' })
  }
  const path = storedPath(file.storedName)
  if (!existsSync(path)) {
    if (file.storedName.startsWith('seed-')) {
      await ensureUploadDir()
      let text = '文件占位。请由管理员重新上传正式文本。'
      if (file.storedName.includes('admin-guide') || file.title.includes('使用说明')) text = ADMIN_GUIDE_TEXT
      else if (file.title.includes('章程')) text = '游漫社章程摘要（占位）。正式文本由管理层在文件库替换。\n组织原则：公开、可交接、对团委可说明。'
      else text = '研发部原型提交说明（占位）。请将可运行包与简短说明一并于活动截止前提交。'
      await writeFile(path, text, 'utf8')
    } else {
      throw createError({ statusCode: 404, statusMessage: '文件缺失' })
    }
  }
  setHeader(event, 'Content-Type', file.mime)
  setHeader(event, 'Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`)
  return sendStream(event, createReadStream(path))
})
