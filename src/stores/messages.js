import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([])

  async function fetchMessages() {
    const mock = [
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
    messages.value = mock
    return mock
  }

  async function postMessage(msg) {
    const newMsg = {
      id: Date.now(),
      username: msg.username,
      email: msg.email || '',
      content: msg.content,
      createdAt: new Date().toISOString()
    }
    messages.value.unshift(newMsg)
    console.log('[API] postMessage called with:', msg)
    return newMsg
  }

  return { messages, fetchMessages, postMessage }
})
