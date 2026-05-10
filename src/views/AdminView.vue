<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWorksStore } from '@/stores/works'

const PSW = '123'
const route = useRoute()
const store = useWorksStore()

const authed = ref(route.query.psw === PSW)
const pswInput = ref('')
function tryAuth() {
  if (pswInput.value === PSW) authed.value = true
}

const sections = [
  { key: 'anime', label: '番剧' },
  { key: 'manga', label: '漫画' },
  { key: 'novel', label: '小说' },
  { key: 'game', label: '游戏' }
]
const tab = ref('anime')
const works = computed(() => store[tab.value + 'Works'] || [])

const search = ref('')
const filtered = computed(() => {
  const q = search.value.toLowerCase()
  if (!q) return works.value
  return works.value.filter(w =>
    w.title.toLowerCase().includes(q) ||
    (w.tags || []).some(t => t.toLowerCase().includes(q))
  )
})

const showForm = ref(false)
const editing = ref(null)
const form = ref({})
function emptyForm() {
  return { title: '', cover: '', tags: '', publishDate: '', url: '', type: tab.value, id: '', body: '' }
}
function openAdd() {
  editing.value = null
  form.value = emptyForm()
  showForm.value = true
}
function openEdit(w) {
  editing.value = w
  form.value = {
    title: w.title || '',
    cover: w.cover || '',
    tags: (w.tags || []).join(', '),
    publishDate: w.publishDate || '',
    url: w.url || '',
    type: w.type || '',
    id: w.id || '',
    body: w.body || ''
  }
  showForm.value = true
}
function closeForm() {
  showForm.value = false
  editing.value = null
}

/* ===== 接口存根 ===== */
function save() {
  const action = editing.value ? '编辑' : '新增'
  console.log(`【${action}】`, form.value)
  alert(`已提交${action}请求：${form.value.title}\n（接口未实现，请对接后端保存到 Markdown 文件）`)
  closeForm()
}
function remove(w) {
  if (!confirm(`确定删除「${w.title}」？`)) return
  console.log('【删除】', { type: w.type, id: w.id })
  alert(`已提交删除请求：${w.title}\n（接口未实现，请对接后端删除 Markdown 文件）`)
}
</script>

<template>
  <div class="admin">
    <div v-if="!authed" class="gate">
      <form class="gate-card" @submit.prevent="tryAuth">
        <h2>管理员验证</h2>
        <input v-model="pswInput" type="password" placeholder="输入密码" autofocus />
        <button type="submit">确认</button>
      </form>
    </div>

    <div v-else class="panel">
      <header>
        <h1>数据管理</h1>
        <span class="badge">Admin</span>
      </header>

      <nav class="tabs">
        <button v-for="s in sections" :key="s.key"
          :class="['tab', { active: tab === s.key }]"
          @click="tab = s.key">
          {{ s.label }}
          <span class="count">{{ (store[s.key + 'Works'] || []).length }}</span>
        </button>
      </nav>

      <div class="toolbar">
        <input v-model="search" placeholder="搜索标题或标签..." />
        <button class="btn primary" @click="openAdd">+ 新增</button>
      </div>

      <table v-if="filtered.length">
        <thead>
          <tr>
            <th>#</th>
            <th>标题</th>
            <th>标签</th>
            <th>日期</th>
            <th>ID</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(w, i) in filtered" :key="w.id">
            <td>{{ i + 1 }}</td>
            <td><strong>{{ w.title }}</strong></td>
            <td>
              <span v-for="t in (w.tags || []).slice(0, 3)" :key="t" class="tag">{{ t }}</span>
            </td>
            <td>{{ w.publishDate || '—' }}</td>
            <td><code>{{ w.id }}</code></td>
            <td class="actions">
              <button class="btn sm outline" @click="openEdit(w)">编辑</button>
              <button class="btn sm danger" @click="remove(w)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty">暂无作品</div>
    </div>

    <Teleport to="body">
      <div v-if="showForm" class="overlay" @click.self="closeForm">
        <div class="modal">
          <div class="modal-head">
            <h2>{{ editing ? '编辑' : '新增' }}作品</h2>
            <button class="close" @click="closeForm">✕</button>
          </div>
          <div class="modal-body">
            <label>标题 <input v-model="form.title" /></label>
            <div class="row">
              <label>分类
                <select v-model="form.type">
                  <option v-for="s in sections" :key="s.key" :value="s.key">{{ s.label }}</option>
                </select>
              </label>
              <label>ID <input v-model="form.id" placeholder="小写+连字符" /></label>
            </div>
            <label>封面路径 <input v-model="form.cover" placeholder="/covers/anime/xxx.jpg" /></label>
            <div class="row">
              <label>日期 <input v-model="form.publishDate" placeholder="2025-01-01" /></label>
              <label>链接 <input v-model="form.url" placeholder="https://" /></label>
            </div>
            <label>标签（逗号分隔） <input v-model="form.tags" placeholder="校园, 百合" /></label>
            <label>正文（Markdown）
              <textarea v-model="form.body" rows="6"></textarea>
            </label>
          </div>
          <div class="modal-foot">
            <button class="btn" @click="closeForm">取消</button>
            <button class="btn primary" @click="save">保存</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.gate {
  min-height: 80vh; display: flex; align-items: center; justify-content: center;
}
.gate-card {
  background: #fff; border-radius: 12px; padding: 2.5rem 2rem;
  text-align: center; box-shadow: 0 4px 24px rgba(0,0,0,0.06); width: 300px;
}
.gate-card h2 { font-size: 1.15rem; margin: 0 0 1rem; color: #2a2438; }
.gate-card input {
  display: block; width: 100%; padding: 0.55rem 0.75rem;
  border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem;
  outline: none; box-sizing: border-box; margin-bottom: 0.75rem;
}
.gate-card input:focus { border-color: #f472b6; }
.gate-card button {
  width: 100%; padding: 0.6rem; background: #f472b6; color: #fff;
  border: none; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer;
}
.gate-card button:hover { background: #e05da0; }

.panel { max-width: 1000px; margin: 0 auto; padding: 2rem; color: #2a2438; }
.panel header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
.panel h1 { font-size: 1.3rem; font-weight: 800; margin: 0; }
.badge {
  font-size: 0.65rem; background: #f472b6; color: #fff;
  padding: 0.15rem 0.5rem; border-radius: 4px; letter-spacing: 0.05em;
}

.tabs { display: flex; gap: 0; border-bottom: 1px solid #eee; margin-bottom: 1rem; }
.tab {
  padding: 0.5rem 1rem; background: none; border: none;
  border-bottom: 2px solid transparent; font-size: 0.85rem; font-weight: 600;
  color: #888; cursor: pointer; display: flex; align-items: center; gap: 0.35rem;
}
.tab:hover { color: #555; }
.tab.active { color: #f472b6; border-bottom-color: #f472b6; }
.count {
  font-size: 0.7rem; background: #f0f0f0; color: #888;
  padding: 0 0.4rem; border-radius: 10px; line-height: 1.4;
}
.tab.active .count { background: rgba(244,114,182,0.1); color: #f472b6; }

.toolbar { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem; }
.toolbar input {
  flex: 1; max-width: 260px; padding: 0.45rem 0.75rem;
  border: 1px solid #ddd; border-radius: 8px; font-size: 0.85rem; outline: none;
}
.toolbar input:focus { border-color: #f472b6; }

table { width: 100%; border-collapse: collapse; font-size: 0.85rem; background: #fff; border-radius: 10px; overflow: hidden; border: 1px solid #eee; }
th { text-align: left; padding: 0.55rem 0.75rem; background: #fafafa; color: #888; font-weight: 600; font-size: 0.75rem; border-bottom: 1px solid #eee; }
td { padding: 0.55rem 0.75rem; border-bottom: 1px solid #f5f5f5; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #fafaff; }
code { font-size: 0.75rem; background: #f0f0f0; padding: 0.1rem 0.35rem; border-radius: 3px; color: #888; }
.tag { display: inline-block; font-size: 0.7rem; background: rgba(96,165,250,0.08); color: #60a5fa; padding: 0.1rem 0.4rem; border-radius: 4px; margin-right: 0.2rem; }
.actions { white-space: nowrap; }
.empty { padding: 2.5rem; text-align: center; color: #bbb; font-size: 0.85rem; }

.btn {
  padding: 0.4rem 0.8rem; border-radius: 6px; font-size: 0.8rem; font-weight: 600;
  cursor: pointer; border: none; transition: 0.15s;
}
.btn.sm { padding: 0.25rem 0.55rem; font-size: 0.75rem; }
.btn.primary { background: #f472b6; color: #fff; }
.btn.primary:hover { background: #e05da0; }
.btn.outline { background: rgba(96,165,250,0.1); color: #60a5fa; }
.btn.outline:hover { background: rgba(96,165,250,0.2); }
.btn.danger { background: rgba(244,67,54,0.08); color: #e53935; }
.btn.danger:hover { background: rgba(244,67,54,0.18); }

.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.35);
  display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal {
  background: #fff; border-radius: 14px; width: 520px; max-width: 92vw;
  max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 16px 48px rgba(0,0,0,0.15);
}
.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1rem 1.25rem; border-bottom: 1px solid #eee;
}
.modal-head h2 { margin: 0; font-size: 1rem; font-weight: 700; }
.close { background: none; border: none; font-size: 1.2rem; color: #aaa; cursor: pointer; }
.close:hover { color: #666; }
.modal-body {
  padding: 1rem 1.25rem; overflow-y: auto; flex: 1;
  display: flex; flex-direction: column; gap: 0.7rem;
}
.modal-body label { display: flex; flex-direction: column; gap: 0.2rem; font-size: 0.78rem; font-weight: 600; color: #666; }
.modal-body input, .modal-body select, .modal-body textarea {
  padding: 0.45rem 0.7rem; border: 1px solid #ddd; border-radius: 6px;
  font-size: 0.85rem; outline: none; font-family: inherit;
}
.modal-body input:focus, .modal-body select:focus, .modal-body textarea:focus { border-color: #60a5fa; }
.modal-body textarea { resize: vertical; min-height: 70px; }
.row { display: flex; gap: 0.75rem; }
.row label { flex: 1; }
.modal-foot {
  display: flex; justify-content: flex-end; gap: 0.5rem;
  padding: 0.75rem 1.25rem; border-top: 1px solid #eee;
}
</style>
