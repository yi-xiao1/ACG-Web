export async function onRequest(context) {
  const { request, env } = context

  if (request.method === 'GET') {
    const data = await env.MESSAGES.get('messages', 'json')
    return new Response(JSON.stringify(data || []), {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (request.method === 'POST') {
    const body = await request.json()
    const messages = (await env.MESSAGES.get('messages', 'json')) || []
    const newMsg = {
      id: Date.now(),
      username: body.username || '匿名',
      email: body.email || '',
      content: body.content || '',
      createdAt: new Date().toISOString()
    }
    messages.unshift(newMsg)
    await env.MESSAGES.put('messages', JSON.stringify(messages))
    return new Response(JSON.stringify(newMsg), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response('Method not allowed', { status: 405 })
}
