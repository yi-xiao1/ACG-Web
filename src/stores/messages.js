import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMessagesStore = defineStore('messages', () => {
  const messages = ref([])

  async function fetchMessages() {
    try {
      const res = await fetch('/api/messages')
      if (res.ok) messages.value = await res.json()
    } catch (e) {
      console.error('获取留言失败:', e)
    }
  }

  async function postMessage(msg) {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: msg.username,
        email: msg.email || '',
        content: msg.content
      })
    })
    if (!res.ok) throw new Error('发布留言失败')
    const newMsg = await res.json()
    messages.value.unshift(newMsg)
    return newMsg
  }

  return { messages, fetchMessages, postMessage }
})
