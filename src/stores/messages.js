import { defineStore } from 'pinia'
import { ref } from 'vue'

const FILE_PATH = 'src/data/messages.json'

const MOCK = [
  {
    id: 1,
    username: '二次元旅人',
    email: 'traveler@example.com',
    content: '<p>这个网站太棒了！收集了好多我喜欢的作品。<strong>大赞！</strong></p>',
    createdAt: '2024-12-01T10:30:00Z'
  },
  {
    id: 2,
    username: '动漫爱好者',
    email: '',
    content: '<p>推荐大家都去看看<em>夏日重现</em>，真的是一部被低估的神作！</p><ul><li>剧情紧凑</li><li>角色丰满</li><li>音乐出色</li></ul>',
    createdAt: '2024-12-05T14:20:00Z'
  }
]

function getConfig() {
  return {
    token: localStorage.getItem('gh_token') || '',
    owner: localStorage.getItem('gh_owner') || 'yi-xiao1',
    repo: localStorage.getItem('gh_repo') || 'My-Own-ACG-Web',
    branch: localStorage.getItem('gh_branch') || 'main'
  }
}

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

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([])

  async function fetchMessages() {
    const { token, owner, repo, branch } = getConfig()
    if (!token) {
      messages.value = MOCK
      return
    }
    try {
      const data = await ghRequest('GET',
        `/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`, token)
      messages.value = JSON.parse(atob(data.content.replace(/\n/g, '')))
    } catch {
      messages.value = MOCK
    }
  }

  async function postMessage(msg) {
    const { token, owner, repo, branch } = getConfig()
    if (!token) throw new Error('请先在管理后台配置 GitHub 连接')

    // 先读当前文件
    let sha, existing
    try {
      const data = await ghRequest('GET',
        `/repos/${owner}/${repo}/contents/${FILE_PATH}?ref=${branch}`, token)
      sha = data.sha
      existing = JSON.parse(atob(data.content.replace(/\n/g, '')))
    } catch {
      sha = null
      existing = []
    }

    const newMsg = {
      id: Date.now(),
      username: msg.username || '匿名',
      email: msg.email || '',
      content: msg.content || '',
      createdAt: new Date().toISOString()
    }
    existing.unshift(newMsg)

    await ghRequest('PUT', `/repos/${owner}/${repo}/contents/${FILE_PATH}`, token, {
      message: '更新留言板',
      content: btoa(unescape(encodeURIComponent(JSON.stringify(existing, null, 2)))),
      sha: sha || undefined,
      branch
    })

    messages.value = existing
    return newMsg
  }

  return { messages, fetchMessages, postMessage }
})
