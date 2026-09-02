export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)
  return { user: user ? publicUser(user) : null }
})
