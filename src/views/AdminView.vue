<script setup>
import { ref, computed, watch } from 'vue'
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

// ── GitHub 配置 ──
const showSettings = ref(false)
const ghToken = ref(localStorage.getItem('gh_token') || '')
const ghOwner = ref(localStorage.getItem('gh_owner') || '')
const ghRepo = ref(localStorage.getItem('gh_repo') || '')
const ghBranch = ref(localStorage.getItem('gh_branch') || 'main')
const loading = ref(false)

function saveSettings() {
  localStorage.setItem('gh_token', ghToken.value)
  localStorage.setItem('gh_owner', ghOwner.value)
  localStorage.setItem('gh_repo', ghRepo.value)
  localStorage.setItem('gh_branch', ghBranch.value)
  showSettings.value = false
}

// ── 封面上传 ──
const coverFile = ref(null)
const coverPreview = ref('')
const bodyTextarea = ref(null)

// 选择封面图片
function onCoverSelected(e) {
  const file = e.target.files[0]
  if (!file) return
  coverFile.value = file
  const reader = new FileReader()
  reader.onload = () => { coverPreview.value = reader.result }
  reader.readAsDataURL(file)
  updateCoverPath(file)
}
function updateCoverPath(file) {
  if (!file || !form.value.id || !form.value.type) return
  const ext = file.name.split('.').pop()
  form.value.cover = `/covers/${form.value.type}/${form.value.id}.${ext}`
}
watch([() => form.value.id, () => form.value.type], () => {
  if (coverFile.value) updateCoverPath(coverFile.value)
})

// ── MD 语法工具栏 ──
function insertMarkdown(type) {
  const ta = bodyTextarea.value
  if (!ta) return
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const sel = form.value.body.substring(start, end)
  const ops = {
    bold: `**${sel || '粗体文字'}**`,
    italic: `*${sel || '斜体文字'}*`,
    h2: `\n## ${sel || '标题'}\n`,
    h3: `\n### ${sel || '标题'}\n`,
    link: `[${sel || '链接文字'}](url)`,
    ul: `\n- ${sel || '列表项'}\n`,
    ol: `\n1. ${sel || '列表项'}\n`,
    quote: `> ${sel || '引用文字'}\n`,
    code: sel ? `\`${sel}\`` : '`代码`',
    hr: `\n---\n`
  }
  const insert = ops[type] || ''
  form.value.body = form.value.body.substring(0, start) + insert + form.value.body.substring(end)
  ta.focus()
}

// ── 表单 ──
const showForm = ref(false)
const editing = ref(null)
const form = ref({})
function emptyForm() {
  return { title: '', cover: '', tags: '', publishDate: '', url: '', type: tab.value, id: '', body: '' }
}
function openAdd() {
  editing.value = null
  form.value = emptyForm()
  coverFile.value = null
  coverPreview.value = ''
  showForm.value = true
}
function openEdit(w) {
  editing.value = w
  coverFile.value = null
  coverPreview.value = ''
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
  coverFile.value = null
  coverPreview.value = ''
}

// ── GitHub API ──
const GH_API = 'https://api.github.com'

function buildContent(f) {
  const tags = f.tags
    ? '[' + f.tags.split(',').map(t => `"${t.trim()}"`).join(', ') + ']'
    : '[]'
  return `---
title: "${f.title}"
cover: "${f.cover}"
tags: ${tags}
publishDate: "${f.publishDate}"
url: "${f.url}"
type: "${f.type}"
id: "${f.id}"
---

${f.body}`
}

async function ghRequest(method, path, body) {
  const res = await fetch(`${GH_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${ghToken.value}`,
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

async function getFileSha(filePath) {
  try {
    const data = await ghRequest('GET', `/repos/${ghOwner.value}/${ghRepo.value}/contents/${filePath}?ref=${ghBranch.value}`)
    return data.sha
  } catch {
    return null
  }
}

async function uploadCover() {
  if (!coverFile.value) return form.value.cover
  const ext = coverFile.value.name.split('.').pop()
  const filePath = `public/covers/${form.value.type}/${form.value.id}.${ext}`
  const reader = new FileReader()
  const base64 = await new Promise((resolve, reject) => {
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(coverFile.value)
  })
  const sha = await getFileSha(filePath)
  await ghRequest('PUT', `/repos/${ghOwner.value}/${ghRepo.value}/contents/${filePath}`, {
    message: `上传封面：${form.value.title}`,
    content: base64,
    sha: sha || undefined,
    branch: ghBranch.value
  })
  return `/covers/${form.value.type}/${form.value.id}.${ext}`
}

async function save() {
  if (!ghToken.value || !ghOwner.value || !ghRepo.value) {
    alert('请先在设置中配置 GitHub 信息')
    showSettings.value = true
    return
  }
  if (!form.value.title || !form.value.id) {
    alert('标题和 ID 为必填项')
    return
  }

  const filePath = `src/data/${form.value.type}/${form.value.id}.md`
  const content = btoa(unescape(encodeURIComponent(buildContent(form.value))))
  const action = editing.value ? '编辑' : '新增'
  loading.value = true

  try {
    form.value.cover = await uploadCover()
    const sha = editing.value ? await getFileSha(filePath) : undefined
    await ghRequest('PUT', `/repos/${ghOwner.value}/${ghRepo.value}/contents/${filePath}`, {
      message: `${action}作品：${form.value.title}`,
      content,
      sha,
      branch: ghBranch.value
    })
    alert(`${action}成功！请刷新页面查看变更（Cloudflare Pages 部署可能需要几分钟）`)
    closeForm()
  } catch (e) {
    alert(`操作失败：${e.message}`)
  } finally {
    loading.value = false
  }
}

async function remove(w) {
  if (!confirm(`确定删除「${w.title}」？此操作不可撤销。`)) return
  if (!ghToken.value || !ghOwner.value || !ghRepo.value) {
    alert('请先在设置中配置 GitHub 信息')
    showSettings.value = true
    return
  }

  const filePath = `src/data/${w.type}/${w.id}.md`
  loading.value = true

  try {
    const sha = await getFileSha(filePath)
    if (!sha) throw new Error('文件不存在')
    await ghRequest('DELETE', `/repos/${ghOwner.value}/${ghRepo.value}/contents/${filePath}`, {
      message: `删除作品：${w.title}`,
      sha,
      branch: ghBranch.value
    })
    alert(`删除成功！请刷新页面查看变更（Cloudflare Pages 部署可能需要几分钟）`)
  } catch (e) {
    alert(`操作失败：${e.message}`)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="admin">
    <!-- 密码门 -->
    <div v-if="!authed" class="gate">
      <form class="gate-card" @submit.prevent="tryAuth">
        <h2>管理员验证</h2>
        <input v-model="pswInput" type="password" placeholder="输入密码" autofocus />
        <button type="submit">确认</button>
      </form>
    </div>

    <!-- 管理面板 -->
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
        <button class="btn primary" @click="openAdd" :disabled="loading">+ 新增</button>
        <button class="btn" @click="showSettings = true">⚙ 设置</button>
      </div>

      <div v-if="ghToken && ghOwner && ghRepo" class="gh-status">
        已连接到 <strong>{{ ghOwner }}/{{ ghRepo }}</strong> ({{ ghBranch }})
      </div>
      <div v-else class="gh-status warn">
        未配置 GitHub 连接，操作将模拟执行
      </div>

      <div v-if="loading" class="loading">操作中，请稍候...</div>

      <table v-if="!loading && filtered.length">
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
              <button class="btn sm outline" @click="openEdit(w)" :disabled="loading">编辑</button>
              <button class="btn sm danger" @click="remove(w)" :disabled="loading">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else-if="!loading" class="empty">暂无作品</div>
    </div>

    <!-- 设置弹窗 -->
    <Teleport to="body">
      <div v-if="showSettings" class="overlay" @click.self="showSettings = false">
        <div class="modal">
          <div class="modal-head">
            <h2>GitHub 设置</h2>
            <button class="close" @click="showSettings = false">✕</button>
          </div>
          <div class="modal-body">
            <p class="hint">填写 GitHub 信息使数据修改同步到仓库。</p>
            <label>Personal Access Token
              <input v-model="ghToken" type="password" placeholder="ghp_..." />
            </label>
            <div class="row">
              <label>仓库所有者
                <input v-model="ghOwner" placeholder="yi-xiao1" />
              </label>
              <label>仓库名
                <input v-model="ghRepo" placeholder="My-Own-ACG-Web" />
              </label>
            </div>
            <label>分支
              <input v-model="ghBranch" placeholder="main" />
            </label>
            <p class="hint">Token 需要 <code>repo</code> 权限。信息保存在浏览器本地。</p>
            <p class="hint">也可直接在 <a href="https://app.pagescms.org" target="_blank">app.pagescms.org</a> 使用 Pages CMS。</p>
          </div>
          <div class="modal-foot">
            <button class="btn" @click="showSettings = false">取消</button>
            <button class="btn primary" @click="saveSettings">保存设置</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 编辑弹窗 -->
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
            <label>封面图片
              <div class="cover-upload">
                <input type="file" accept="image/*" @change="onCoverSelected" />
                <div v-if="coverPreview" class="cover-preview">
                  <img :src="coverPreview" />
                </div>
                <div v-else-if="form.cover" class="cover-preview">
                  <img :src="form.cover" @error="$event.target.style.display='none'" />
                </div>
                <span v-if="form.cover" class="cover-path">{{ form.cover }}</span>
              </div>
            </label>
            <div class="row">
              <label>日期 <input v-model="form.publishDate" placeholder="2025-01-01" /></label>
              <label>链接 <input v-model="form.url" placeholder="https://" /></label>
            </div>
            <label>标签（逗号分隔） <input v-model="form.tags" placeholder="校园, 百合" /></label>
            <label>正文（Markdown）
              <div class="md-toolbar">
                <button type="button" class="md-btn" @click="insertMarkdown('bold')" title="加粗"><b>B</b></button>
                <button type="button" class="md-btn" @click="insertMarkdown('italic')" title="斜体"><i>I</i></button>
                <span class="md-sep"></span>
                <button type="button" class="md-btn" @click="insertMarkdown('h2')" title="二级标题">H2</button>
                <button type="button" class="md-btn" @click="insertMarkdown('h3')" title="三级标题">H3</button>
                <span class="md-sep"></span>
                <button type="button" class="md-btn" @click="insertMarkdown('ul')" title="无序列表"><svg viewBox="0 0 16 16" fill="currentColor" width="14"><circle cx="4" cy="8" r="1.5"/><rect x="7" y="7.25" width="8" height="1.5" rx=".75"/></svg></button>
                <button type="button" class="md-btn" @click="insertMarkdown('ol')" title="有序列表">1.</button>
                <span class="md-sep"></span>
                <button type="button" class="md-btn" @click="insertMarkdown('quote')" title="引用">❝</button>
                <button type="button" class="md-btn" @click="insertMarkdown('code')" title="行内代码">&lt;/&gt;</button>
                <button type="button" class="md-btn" @click="insertMarkdown('link')" title="链接">🔗</button>
                <span class="md-sep"></span>
                <button type="button" class="md-btn" @click="insertMarkdown('hr')" title="分割线">—</button>
              </div>
              <textarea ref="bodyTextarea" v-model="form.body" rows="6"></textarea>
            </label>
          </div>
          <div class="modal-foot">
            <button class="btn" @click="closeForm">取消</button>
            <button class="btn primary" @click="save" :disabled="loading">
              {{ loading ? '保存中...' : '保存' }}
            </button>
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

.toolbar { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem; }
.toolbar input {
  flex: 1; max-width: 260px; padding: 0.45rem 0.75rem;
  border: 1px solid #ddd; border-radius: 8px; font-size: 0.85rem; outline: none;
}
.toolbar input:focus { border-color: #f472b6; }

.gh-status {
  font-size: 0.78rem; color: #888; margin-bottom: 0.75rem; padding: 0.35rem 0.65rem;
  background: #f0f8f0; border-radius: 6px; display: inline-block;
}
.gh-status.warn { background: #fff8e6; }
.hint { font-size: 0.78rem; color: #999; margin: 0; }
.hint code { font-size: 0.75rem; }
.hint a { color: #60a5fa; }
.loading {
  padding: 2rem; text-align: center; color: #888; font-size: 0.85rem;
}

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
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn.sm { padding: 0.25rem 0.55rem; font-size: 0.75rem; }
.btn.primary { background: #f472b6; color: #fff; }
.btn.primary:hover:not(:disabled) { background: #e05da0; }
.btn.outline { background: rgba(96,165,250,0.1); color: #60a5fa; }
.btn.outline:hover:not(:disabled) { background: rgba(96,165,250,0.2); }
.btn.danger { background: rgba(244,67,54,0.08); color: #e53935; }
.btn.danger:hover:not(:disabled) { background: rgba(244,67,54,0.18); }

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
.md-toolbar {
  display: flex; flex-wrap: wrap; gap: 2px; align-items: center;
  padding: 0.35rem 0.5rem; background: #f8f8fc; border: 1px solid #ddd;
  border-bottom: none; border-radius: 6px 6px 0 0;
}
.md-btn {
  background: none; border: none; padding: 0.3rem 0.55rem;
  font-size: 0.78rem; border-radius: 4px; cursor: pointer;
  color: #555; line-height: 1; min-height: 28px;
}
.md-btn:hover { background: #e8e8f0; color: #2a2438; }
.md-btn b, .md-btn i { font-size: 0.85rem; }
.md-btn svg { vertical-align: middle; }
.md-sep { width: 1px; height: 18px; background: #ddd; margin: 0 2px; display: inline-block; }
.modal-body label:has(.md-toolbar) textarea {
  border-top-left-radius: 0; border-top-right-radius: 0; border-top: none;
}
.cover-upload { display: flex; flex-direction: column; gap: 0.4rem; }
.cover-upload input[type="file"] { font-size: 0.78rem; padding: 0.3rem 0; }
.cover-preview {
  width: 100%; max-height: 120px; overflow: hidden; border-radius: 6px;
  border: 1px solid #eee;
}
.cover-preview img { width: 100%; height: 100%; object-fit: cover; }
.cover-path { font-size: 0.72rem; color: #999; font-family: var(--font-mono, monospace); }
.row { display: flex; gap: 0.75rem; }
.row label { flex: 1; }
.modal-foot {
  display: flex; justify-content: flex-end; gap: 0.5rem;
  padding: 0.75rem 1.25rem; border-top: 1px solid #eee;
}
</style>
