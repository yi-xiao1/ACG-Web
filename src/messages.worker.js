// 部署到 Cloudflare Workers
// 名称：acgweb-api
// 路由：/api/messages 或自定义域名

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }

    try {
      if (request.method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM messages ORDER BY created_at DESC'
        ).all()
        return new Response(JSON.stringify(results), { headers })
      }

      if (request.method === 'POST') {
        const body = await request.json()
        const id = Date.now()
        const createdAt = new Date().toISOString()
        await env.DB.prepare(
          'INSERT INTO messages (id, username, email, content, created_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, body.username || '匿名', body.email || '', body.content || '', createdAt).run()

        const newMsg = { id, username: body.username || '匿名', email: body.email || '', content: body.content || '', createdAt }
        return new Response(JSON.stringify(newMsg), { status: 201, headers })
      }

      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers })
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers })
    }
  }
}
