export async function postForm(url: string, formData: FormData) {
  const res = await fetch(url, { method: 'POST', body: formData, credentials: 'include' })
  const data = await res.json().catch(() => ({} as any))
  if (!res.ok) {
    const err: any = new Error(data.statusMessage || '上传失败')
    err.data = data
    err.statusCode = res.status
    throw err
  }
  return data
}
