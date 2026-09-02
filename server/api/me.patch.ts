export default defineEventHandler(async (event) => {
  const user = await requireUser(event)
  const body = await readBody(event)
  const data: any = {
    phone: String(body?.phone ?? user.phone),
    qq: String(body?.qq ?? user.qq),
    gameDirection: String(body?.gameDirection ?? user.gameDirection),
    bio: String(body?.bio ?? user.bio)
  }
  if (isStaff(user.role) && user.role !== 'president' && body?.title !== undefined) {
    data.title = String(body.title)
  }
  const updated = await prisma.user.update({
    where: { id: user.id },
    data
  })
  return { user: publicUser(updated) }
})

