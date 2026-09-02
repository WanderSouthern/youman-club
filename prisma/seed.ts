import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { ADMIN_GUIDE_TEXT } from '../server/utils/admin-guide'
import { SITE_QUOTES } from '../server/utils/quotes'

const prisma = new PrismaClient()

async function main() {
  await prisma.inboxMessage.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.eventCommentLike.deleteMany()
  await prisma.eventLike.deleteMany()
  await prisma.eventComment.deleteMany()
  await prisma.eventCheckin.deleteMany()
  await prisma.eventSignup.deleteMany()
  await prisma.tournamentFile.deleteMany()
  await prisma.fileAsset.deleteMany()
  await prisma.event.deleteMany()
  await prisma.recruitIntent.deleteMany()
  await prisma.session.deleteMany()
  await prisma.passwordReset.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.department.deleteMany()
  await prisma.siteConfig.deleteMany()

  const esports = await prisma.department.create({
    data: {
      slug: 'esports',
      name: '电竞部',
      shortName: '电竞',
      coverHue: 'coral',
      sortOrder: 1,
      summary: '竞技训练与赛事承办，组织校内同好形成可参赛队伍。',
      description:
        '电竞部面向旗山校区电子竞技爱好者，组织日常训练、校内杯赛与对外交流。部门承担社团主要赛事承办，注重规则意识、临场执行与团队协作。',
      duties: '日常训练与内部选拔\n校内杯赛与友谊赛组织\n赛事现场执行与解说支持\n对外交流与承办对接',
      ministerNote: '训练以进步为目标，欢迎认真对待每一次上场机会的同学。'
    }
  })

  const gamedev = await prisma.department.create({
    data: {
      slug: 'gamedev',
      name: '游戏研发部',
      shortName: '研发',
      coverHue: 'teal',
      sortOrder: 2,
      summary: '独立游戏与工具共创。程序、美术、策划与声音均可参与。',
      description:
        '游戏研发部承担社团创作事务。鼓励从最小可运行原型起步，并形成可交接的文档与作品存档。',
      duties: '独立游戏与小工具共创\n引擎与工具分享会\nGame Jam 与作品展\n研发文档与素材归档',
      ministerNote: '欢迎零基础同学加入。完成比完美更重要。'
    }
  })

  const passwordHash = await bcrypt.hash('Youman@2024', 10)

  const president = await prisma.user.create({
    data: {
      studentId: '20210001',
      name: '林屿',
      email: 'president@youman.local',
      passwordHash,
      phone: '13800000001',
      qq: '10000001',
      college: '软件学院',
      grade: '2021 级',
      gameDirection: '社团统筹 / 独立游戏',
      bio: '旗山校区游戏协会社长。',
      role: 'president',
      status: 'active'
    }
  })

  await prisma.user.create({
    data: {
      studentId: '20210002',
      name: '周宁',
      email: 'mgmt@youman.local',
      passwordHash,
      college: '传播学院',
      grade: '2022 级',
      role: 'management',
      status: 'active',
      qq: '10000002'
    }
  })

  await prisma.user.create({
    data: {
      studentId: '20210003',
      name: '陈柯',
      email: 'esports@youman.local',
      passwordHash,
      college: '体育科学学院',
      grade: '2023 级',
      role: 'management',
      title: '部长',
      status: 'active',
      departmentId: esports.id,
      gameDirection: 'MOBA / 战术射击'
    }
  })

  await prisma.user.create({
    data: {
      studentId: '20210004',
      name: '苏晚',
      email: 'gamedev@youman.local',
      passwordHash,
      college: '软件学院',
      grade: '2022 级',
      role: 'management',
      title: '部长',
      status: 'active',
      departmentId: gamedev.id,
      gameDirection: '像素美术 / Godot'
    }
  })

  const member = await prisma.user.create({
    data: {
      studentId: '20210005',
      name: '何夏',
      email: 'member@youman.local',
      passwordHash,
      college: '文学院',
      grade: '2024 级',
      role: 'member',
      status: 'active',
      departmentId: gamedev.id,
      gameDirection: '剧情策划'
    }
  })

  await prisma.user.create({
    data: {
      studentId: '20210006',
      name: '吴舟',
      email: 'pending@youman.local',
      passwordHash,
      college: '经济学院',
      grade: '2025 级',
      role: 'pending',
      status: 'pending',
      departmentId: esports.id
    }
  })

  const now = Date.now()
  const day = 86400000

  const e1 = await prisma.event.create({
    data: {
      title: '秋季招新见面会',
      slug: 'autumn-meetup',
      coverHue: 'coral',
      summary: '两部门介绍、作品与训练短片、现场答疑。尚未确定去向者亦可参加。',
      content:
        '时长约两小时，请携带学生证。现场设电竞试训位与研发作品试玩。结束后可提交招新登记。',
      location: '旗山校区学生活动中心 203',
      startsAt: new Date(now + 7 * day),
      endsAt: new Date(now + 7 * day + 2 * 3600000),
      signupDeadline: new Date(now + 6 * day),
      capacity: 80,
      requireCheckin: true,
      published: true
    }
  })

  await prisma.event.create({
    data: {
      title: 'Godot 最小原型工作坊',
      slug: 'godot-workshop',
      coverHue: 'teal',
      summary: '两个半小时完成可移动角色与一枚机关。请自备笔记本，引擎可现场安装。',
      content: '面向零基础。结束后源码存入研发部资料库，便于后续迭代。',
      location: '旗山校区教学楼 A-401',
      startsAt: new Date(now + 14 * day),
      endsAt: new Date(now + 14 * day + 3 * 3600000),
      signupDeadline: new Date(now + 13 * day),
      capacity: 30,
      departmentId: gamedev.id,
      requireCheckin: true,
      published: true
    }
  })

  await prisma.event.create({
    data: {
      title: '电竞部周常训练',
      slug: 'weekly-scrim',
      coverHue: 'plum',
      summary: '内部训练与录像复盘。已入部社员优先。',
      content: '请提前报名，便于安排机位。现场口令由主办方公布。',
      location: '旗山校区实训机房 B2',
      startsAt: new Date(now + 3 * day),
      endsAt: new Date(now + 3 * day + 4 * 3600000),
      signupDeadline: new Date(now + 2 * day),
      capacity: 20,
      departmentId: esports.id,
      requireCheckin: true,
      checkinOpen: true,
      checkinCode: 'YMS-1842',
      published: true
    }
  })

  await prisma.eventSignup.create({ data: { eventId: e1.id, userId: member.id } })

  await prisma.event.create({
    data: {
      title: '旗山杯 · 校园邀请赛',
      slug: 'qishan-cup',
      kind: 'activity',
      coverHue: 'gold',
      summary: '游漫社承办的校内邀请赛。项目以团队竞技为主，规程与成绩在此公示。',
      content:
        '本赛事面向旗山校区在读学生。报名以队伍为单位，由队长对接。现场执行由电竞部统筹，研发部提供计分页与物料。',
      location: '旗山校区体育馆辅厅',
      startsAt: new Date(now + 30 * day),
      endsAt: new Date(now + 32 * day),
      signupDeadline: new Date(now + 25 * day),
      capacity: 64,
      requireCheckin: true,
      published: true
    }
  })

  await prisma.fileAsset.create({
    data: {
      title: '管理端使用说明',
      originalName: '管理端使用说明.txt',
      storedName: 'seed-admin-guide.txt',
      mime: 'text/plain; charset=utf-8',
      size: Buffer.byteLength(ADMIN_GUIDE_TEXT),
      category: 'guides',
      visibility: 'management',
      uploaderId: president.id
    }
  })

  await prisma.fileAsset.create({
    data: {
      title: '游漫社章程（摘要）',
      originalName: 'charter.txt',
      storedName: 'seed-charter.txt',
      mime: 'text/plain',
      size: 256,
      category: 'rules',
      visibility: 'club',
      uploaderId: president.id
    }
  })

  await prisma.fileAsset.create({
    data: {
      title: '研发部 · 原型提交说明',
      originalName: 'gamedev-submit.txt',
      storedName: 'seed-gamedev.txt',
      mime: 'text/plain',
      size: 180,
      category: 'gamedev',
      visibility: 'department',
      departmentId: gamedev.id,
      uploaderId: president.id
    }
  })

  await prisma.siteConfig.createMany({
    data: [
      { key: 'heroKicker', value: '福建师范大学 · 旗山校区' },
      { key: 'heroTitle', value: '游漫社' },
      { key: 'heroLede', value: '福建师范大学旗山校区游戏协会。电竞训练与游戏创作并行，组织活动、沉淀作品、承办赛事。' },
      { key: 'homeExtra', value: '' },
      { key: 'aboutLede', value: '福建师范大学旗山校区游戏协会，简称游漫社。' },
      { key: 'about', value: '<p>福建师范大学旗山校区游戏协会（游漫社）面向旗山校区学生，现设电竞部与游戏研发部，统筹活动、训练、创作与赛事承办。</p>' },
      { key: 'history', value: '<p>协会于旗山校区学生社团体系内运行，历经数届交接，形成电竞与研发双线结构，持续组织招新、工作坊与校内邀请赛。</p>' },
      { key: 'organization', value: '<p>社长主持全社事务。管理员协助审批与发布，称谓可按职务填写。现设电竞部、游戏研发部。后续部门由管理端增设。</p>' },
      { key: 'contact', value: 'QQ群：待更新\n邮箱：youman@fjnu.local\n活动场地以当期通知为准' },
      { key: 'recruitOpen', value: 'true' },
      { key: 'qqGroup', value: '' },
      { key: 'bgDecor', value: 'on' },
      { key: 'botWebhookUrl', value: '' },
      { key: 'botSecret', value: '' }
    ]
  })

  await prisma.quote.createMany({
    data: SITE_QUOTES
  })

  console.log('种子数据已写入。演示账号学号 20210001–20210006，密码 Youman@2024')
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
