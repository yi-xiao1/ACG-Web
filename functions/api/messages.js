const OWNER = 'yi-xiao1'
const REPO = 'My-Own-ACG-Web'
const BRANCH = 'main'
const FILE_PATH = 'src/data/messages.json'

async function ghRequest(method, path, token, body) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `HTTP ${res.status}`)
  }
  return res.json()
}

async function getFile(token) {
  try {
    const data = await ghRequest('GET', `/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`, token)
    const content = JSON.parse(atob(data.content.replace(/\n/g, '')))
    return { content, sha: data.sha }
  } catch {
    return { content: [], sha: null }
  }
}

async function putFile(token, sha, messages) {
  await ghRequest('PUT', `/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, token, {
    message: '更新留言板',
    content: btoa(JSON.stringify(messages, null, 2)),
    sha: sha || undefined,
    branch: BRANCH
  })
}

export async function onRequest(context) {
  const { request } = context
  const token = context.env.GITHUB_TOKEN

  if (!token) {
    return new Response(JSON.stringify({ error: '服务器未配置 GITHUB_TOKEN' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    if (request.method === 'GET') {
      const { content } = await getFile(token)
      return new Response(JSON.stringify(content), {
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (request.method === 'POST') {
      const body = await request.json()
      const { content: messages, sha } = await getFile(token)
      const newMsg = {
        id: Date.now(),
        username: body.username || '匿名',
        email: body.email || '',
        content: body.content || '',
        createdAt: new Date().toISOString()
      }
      messages.unshift(newMsg)
      await putFile(token, sha, messages)
      return new Response(JSON.stringify(newMsg), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response('Method not allowed', { status: 405 })
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
