import { prisma } from './prisma'

export async function notifyBot(payload: Record<string, unknown>) {
  try {
    const rows = await prisma.siteConfig.findMany({
      where: { key: { in: ['botWebhookUrl', 'botSecret'] } }
    })
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
    const url = String(map.botWebhookUrl || '').trim()
    if (!url || !/^https?:\/\//i.test(url)) return
    await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-bot-secret': String(map.botSecret || '')
      },
      body: JSON.stringify({ at: new Date().toISOString(), ...payload })
    })
  } catch {
    /* webhook 未配置或网络失败时忽略 */
  }
}
