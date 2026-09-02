import { PrismaClient } from '@prisma/client'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { existsSync, mkdirSync } from 'node:fs'
import { ADMIN_GUIDE_TEXT, ADMIN_GUIDE_STORED } from '../server/utils/admin-guide'
import { SITE_QUOTES } from '../server/utils/quotes'

const prisma = new PrismaClient()

async function main() {
  const cups = await prisma.tournament.findMany()
  for (const t of cups) {
    const exists = await prisma.event.findUnique({ where: { slug: t.slug } })
    if (!exists) {
      await prisma.event.create({
        data: {
          title: t.title,
          slug: t.slug,
          kind: 'activity',
          coverHue: t.coverHue,
          summary: t.summary,
          content: t.content,
          location: t.location,
          startsAt: t.startsAt,
          endsAt: t.endsAt,
          published: t.published,
          requireCheckin: true,
          capacity: 0
        }
      })
    }
  }

  await prisma.event.updateMany({
    where: { kind: 'tournament' },
    data: { kind: 'activity' }
  })

  await prisma.siteConfig.upsert({ where: { key: 'bgDecor' }, update: {}, create: { key: 'bgDecor', value: 'on' } })

  const quoteCount = await prisma.quote.count()
  if (!quoteCount) {
    await prisma.quote.createMany({ data: SITE_QUOTES })
  }

  await prisma.department.updateMany({
    where: { slug: 'esports' },
    data: { summary: '竞技训练与赛事承办，组织校内同好形成可参赛队伍。', shortName: '电竞' }
  })
  await prisma.department.updateMany({
    where: { slug: 'gamedev' },
    data: { summary: '独立游戏与工具共创。程序、美术、策划与声音均可参与。', shortName: '研发' }
  })

  await prisma.user.updateMany({
    where: { role: 'minister' },
    data: { role: 'management', title: '部长' }
  })

  const extras = {
    heroKicker: '福建师范大学 · 旗山校区',
    heroTitle: '游漫社',
    heroLede: '福建师范大学旗山校区游戏协会。电竞训练与游戏创作并行，组织活动、沉淀作品、承办赛事。',
    aboutLede: '福建师范大学旗山校区游戏协会，简称游漫社。',
    about: '<p>福建师范大学旗山校区游戏协会（游漫社）面向旗山校区学生，现设电竞部与游戏研发部，统筹活动、训练、创作与赛事承办。</p>',
    history: '<p>协会于旗山校区学生社团体系内运行，历经数届交接，形成电竞与研发双线结构，持续组织招新、工作坊与校内邀请赛。</p>',
    organization: '<p>社长主持全社事务。管理员协助审批与发布，称谓可按职务填写。现设电竞部、游戏研发部。后续部门由管理端增设。</p>'
  }
  for (const [key, value] of Object.entries(extras)) {
    await prisma.siteConfig.upsert({ where: { key }, update: { value }, create: { key, value } })
  }

  const president = await prisma.user.findFirst({ where: { role: 'president' } })
  if (president) {
    const exists = await prisma.fileAsset.findFirst({ where: { storedName: ADMIN_GUIDE_STORED } })
    if (!exists) {
      const dir = join(process.cwd(), 'data', 'uploads')
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
      await writeFile(join(dir, ADMIN_GUIDE_STORED), ADMIN_GUIDE_TEXT, 'utf8')
      await prisma.fileAsset.create({
        data: {
          title: '管理端使用说明',
          originalName: '管理端使用说明.txt',
          storedName: ADMIN_GUIDE_STORED,
          mime: 'text/plain; charset=utf-8',
          size: Buffer.byteLength(ADMIN_GUIDE_TEXT),
          category: 'guides',
          visibility: 'management',
          uploaderId: president.id
        }
      })
    }
  }
}

main().then(() => prisma.$disconnect()).catch((e) => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
