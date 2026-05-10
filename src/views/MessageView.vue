<script setup>
import { ref, onMounted } from 'vue'
import { useMessagesStore } from '@/stores/messages'
import RichEditor from '@/components/RichEditor.vue'
import SidebarLayout from '@/components/SidebarLayout.vue'

const messagesStore = useMessagesStore()

const username = ref('')
const email = ref('')
const content = ref('')
const submitting = ref(false)
const submitted = ref(false)

onMounted(() => {
  messagesStore.fetchMessages()
})

async function handleSubmit() {
  if (!username.value.trim() || !content.value.trim()) return
  submitting.value = true
  try {
    await messagesStore.postMessage({
      username: username.value.trim(),
      email: email.value.trim(),
      content: content.value
    })
    username.value = ''
    email.value = ''
    content.value = ''
    submitted.value = true
    setTimeout(() => { submitted.value = false }, 3000)
  } finally {
    submitting.value = false
  }
}

function formatTime(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
}
</script>

<template>
  <div class="message-page">
    <div class="page-header">
      <h1 class="page-title">留言板</h1>
      <p class="page-desc">
        欢迎来到留言板！在这里你可以留下任何想说的话，分享你的想法、建议或者只是打个招呼。（≧▽≦）
      </p>
    </div>

    <SidebarLayout>
      <div class="card">
        <h2 class="card-heading">
          <span class="heading-dot"></span>
          发布留言
        </h2>
        <form @submit.prevent="handleSubmit" class="msg-form">
          <div class="form-row">
            <div class="field">
              <label class="field-label">用户名 <span class="required">*</span></label>
              <input v-model="username" type="text" class="field-input" placeholder="你的昵称" required />
            </div>
            <div class="field">
              <label class="field-label">邮箱 <span class="optional">选填</span></label>
              <input v-model="email" type="email" class="field-input" placeholder="example@email.com" />
            </div>
          </div>
          <div class="field">
            <label class="field-label">留言内容 <span class="required">*</span></label>
            <RichEditor v-model="content" />
          </div>
          <button type="submit" class="submit-btn" :disabled="!username.trim() || !content.trim() || submitting">
            <span v-if="submitting">提交中…</span>
            <span v-else-if="submitted">✓ 已发布</span>
            <span v-else>发布留言</span>
          </button>
        </form>
      </div>

      <div class="card messages-card">
        <div class="messages-header">
          <h2 class="card-heading">
            <span class="heading-dot"></span>
            全部留言
          </h2>
          <span class="msg-count">{{ messagesStore.messages.length }} 条</span>
        </div>

        <TransitionGroup name="msg" tag="div" class="messages-list">
          <article v-for="msg in messagesStore.messages" :key="msg.id" class="message-card">
            <div class="msg-top">
              <div class="msg-avatar">{{ msg.username.charAt(0) }}</div>
              <div class="msg-author">
                <span class="msg-name">{{ msg.username }}</span>
                <span v-if="msg.email" class="msg-email">{{ msg.email }}</span>
              </div>
              <time class="msg-time">{{ formatTime(msg.createdAt) }}</time>
            </div>
            <div class="msg-body" v-html="msg.content"></div>
          </article>
        </TransitionGroup>

        <div v-if="!messagesStore.messages.length" class="empty-msg">
          <p>暂无留言，来发布第一条吧</p>
        </div>
      </div>
    </SidebarLayout>
  </div>
</template>

<style scoped>
.message-page {
  padding-top: 1rem;
}

.page-header {
  max-width: 760px;
  margin: 0 auto 2rem;
  padding: 0 2rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
  letter-spacing: 0.06em;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.7;
}

.card {
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.2s;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(180, 160, 255, 0.08);
}

.card-heading {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heading-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: var(--pink);
  border-radius: 50%;
}

.msg-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.required { color: var(--pink); margin-left: 2px; }
.optional { color: var(--text-tertiary); font-weight: 400; margin-left: 4px; font-size: 0.75rem; }

.field-input {
  padding: 0.6rem 0.875rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
  transition: all 0.2s;
}

.field-input:focus {
  border-color: var(--cyan);
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.1);
}

.submit-btn {
  padding: 0.7rem 1.5rem;
  background: var(--pink);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.04em;
  align-self: flex-start;
}

.submit-btn:hover:not(:disabled) {
  background: var(--accent-hover);
  box-shadow: 0 4px 16px rgba(244, 114, 182, 0.25);
}

.submit-btn:disabled { opacity: 0.35; cursor: not-allowed; }

.messages-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.messages-header .card-heading { margin: 0; }

.msg-count {
  color: var(--text-tertiary);
  font-size: 0.8rem;
  font-family: var(--font-mono);
}

.messages-list { display: flex; flex-direction: column; gap: 0.875rem; }

.message-card {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  transition: border-color 0.2s;
}

.message-card:hover { border-color: rgba(96, 165, 250, 0.2); }

.msg-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.msg-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--pink), var(--cyan));
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 0.8rem; flex-shrink: 0;
}

.msg-author { flex: 1; display: flex; flex-direction: column; }
.msg-name { font-weight: 600; font-size: 0.85rem; color: var(--text-primary); }
.msg-email { font-size: 0.7rem; color: var(--text-tertiary); }
.msg-time { font-size: 0.7rem; color: var(--text-tertiary); white-space: nowrap; }

.msg-body { font-size: 0.875rem; color: var(--text-primary); line-height: 1.7; }
.msg-body :deep(ul), .msg-body :deep(ol) { padding-left: 1.25rem; margin: 0.375rem 0; }
.msg-body :deep(a) { color: var(--cyan); }

.empty-msg { text-align: center; padding: 2.5rem; color: var(--text-tertiary); font-size: 0.85rem; }

.msg-enter-active { transition: all 0.3s ease; }
.msg-enter-from { opacity: 0; transform: translateY(12px); }

@media (max-width: 768px) {
  .page-header { padding: 0 1rem; }
  .page-title { font-size: 1.5rem; }
  .form-row { grid-template-columns: 1fr; }
  .card { padding: 1.25rem; }
}
</style>
