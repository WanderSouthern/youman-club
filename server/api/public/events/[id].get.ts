export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  const id = getRouterParam(event, 'id')!
  const data = await eventWithMeta(id, user?.id, true)
  if (!data || !data.published) {
    throw createError({ statusCode: 404, statusMessage: '活动不存在' })
  }
  return data
})
