import { defineStore } from 'pinia'
import { ref } from 'vue'

// 部署 Worker 后把地址填在这里
const WORKER_URL = 'https://acgweb-api.your-account.workers.dev'

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

let useMock = false

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([])

  async function fetchMessages() {
    try {
      const res = await fetch(WORKER_URL)
      if (!res.ok) throw new Error('API 不可用')
      const text = await res.text()
      if (text.startsWith('<!DOCTYPE')) throw new Error('收到 HTML')
      messages.value = JSON.parse(text)
      useMock = false
    } catch {
      useMock = true
      messages.value = MOCK
    }
  }

  async function postMessage(msg) {
    if (useMock) {
      const newMsg = {
        id: Date.now(),
        username: msg.username || '匿名',
        email: msg.email || '',
        content: msg.content || '',
        createdAt: new Date().toISOString()
      }
      messages.value.unshift(newMsg)
      return newMsg
    }

    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg)
    })
    if (!res.ok) throw new Error('发布留言失败')
    const newMsg = await res.json()
    messages.value.unshift(newMsg)
    return newMsg
  }

  return { messages, fetchMessages, postMessage }
})
