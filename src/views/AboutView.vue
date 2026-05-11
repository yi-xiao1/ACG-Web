<script setup>
import { useWorksStore } from '@/stores/works'
import { useMessagesStore } from '@/stores/messages'
import SidebarLayout from '@/components/SidebarLayout.vue'

const worksStore = useWorksStore()
const messagesStore = useMessagesStore()
</script>

<template>
  <div class="about-page">
    <div class="page-header">
      <h1 class="page-title">关于本站</h1>
      <div class="header-bar">
        <span class="bar-segment bar-segment--pink"></span>
        <span class="bar-segment bar-segment--cyan"></span>
        <span class="bar-segment bar-segment--gold"></span>
      </div>
    </div>

    <SidebarLayout>
      <!-- 个人信息卡片 -->
      <div class="card profile-card">
        <div class="profile-top">
          <div class="profile-avatar">ACG</div>
          <div class="profile-info">
            <h2 class="profile-name">ACG 档案馆</h2>
            <p class="profile-bio">一个专注于二次元作品记录的个人网站</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-num">{{ worksStore.works.length }}</span>
                <span class="stat-label">作品</span>
              </div>
              <div class="stat">
                <span class="stat-num">{{ worksStore.allTags.length }}</span>
                <span class="stat-label">标签</span>
              </div>
              <div class="stat">
                <span class="stat-num">{{ messagesStore.messages.length }}</span>
                <span class="stat-label">留言</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 关于本站 -->
      <div class="card">
        <h2 class="card-heading">
          <span class="heading-dot"></span>
          关于本站
        </h2>
        <p class="about-text">
          欢迎来到 <strong>ACG 档案馆</strong>，这是一个专注于记录本人看过的二次元文化的个人网站。在这里，你可以找到部分我看过的番剧、漫画、小说、游戏等各种 ACG 相关内容的记录和评论。
        </p>
        <p class="about-text">
          本站创建于 2026 年，用于为本人记录已观看/游玩的作品。网站不定时更新。我相信每一部作品都值得被记录，每一份感动都值得被分享。
        </p>
      </div>

      <!-- 分类特色 -->
      <div class="card">
        <h2 class="card-heading">
          <span class="heading-dot"></span>
          收录分类
        </h2>
        <ul class="feature-list">
          <li>
            <span class="feature-icon" style="background: var(--gradient-anime)">◈</span>
            <span><strong>番剧</strong> — 动画作品记录和评论，涵盖各类题材</span>
          </li>
          <li>
            <span class="feature-icon" style="background: var(--gradient-manga)">◈</span>
            <span><strong>漫画</strong> — 漫画作品记录和评论，涵盖各类题材</span>
          </li>
          <li>
            <span class="feature-icon" style="background: var(--gradient-novel)">◈</span>
            <span><strong>小说</strong> — 轻小说/小说记录和评论，涵盖各类题材</span>
          </li>
          <li>
            <span class="feature-icon" style="background: var(--gradient-game)">◈</span>
            <span><strong>游戏</strong> — 游戏记录和评论，涵盖各类题材</span>
          </li>
        </ul>
      </div>

      <!-- 技术架构 -->
      <div class="card">
        <h2 class="card-heading">
          <span class="heading-dot"></span>
          技术架构
        </h2>
        <p class="about-text">本站采用纯前端 + Serverless 技术构建，数据存储在 Markdown 文件和 Cloudflare KV 中，无需传统后端。</p>
        <div class="tech-items">
          <a href="https://vuejs.org/guide/quick-start.html" target="_blank" rel="noopener" class="tech-item">Vue 3</a>
          <a href="https://router.vuejs.org/guide/" target="_blank" rel="noopener" class="tech-item">Vue Router</a>
          <a href="https://pinia.vuejs.org/getting-started.html" target="_blank" rel="noopener" class="tech-item">Pinia</a>
          <a href="https://vitejs.dev/guide/" target="_blank" rel="noopener" class="tech-item">Vite</a>
          <a href="https://marked.js.org/getting-started/" target="_blank" rel="noopener" class="tech-item">marked</a>
          <a href="https://developers.cloudflare.com/pages/get-started/" target="_blank" rel="noopener" class="tech-item">Cloudflare Pages</a>
          <a href="https://developers.cloudflare.com/kv/get-started/" target="_blank" rel="noopener" class="tech-item">Cloudflare KV</a>
          <a href="https://pagescms.org/docs/quickstart/" target="_blank" rel="noopener" class="tech-item">Pages CMS</a>
        </div>
      </div>

      <!-- 联系方式 -->
      <div class="card">
        <h2 class="card-heading">
          <span class="heading-dot"></span>
          联系方式
        </h2>
        <p class="about-text">如果你有任何建议或想法，欢迎通过以下方式联系我：</p>
        <div class="contact-links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="contact-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub</span>
          </a>
          <a href="2874509544a@gmail.com" class="contact-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            <span>邮箱</span>
          </a>
        </div>
      </div>
    </SidebarLayout>
  </div>
</template>

<style scoped>
.about-page {
  padding-top: 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: 0.06em;
  margin: 0 0 1rem;
}

.header-bar { display: flex; justify-content: center; gap: 4px; }
.bar-segment { width: 32px; height: 3px; border-radius: 3px; }
.bar-segment--pink { background: var(--pink); }
.bar-segment--cyan { background: var(--cyan); }
.bar-segment--gold { background: var(--gold); }

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
  margin: 0 0 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.heading-dot {
  display: inline-block;
  width: 6px; height: 6px;
  background: var(--pink);
  border-radius: 50%;
}

/* ─── Profile ─── */
.profile-card {
  padding: 2rem;
}

.profile-top {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 80px; height: 80px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--pink), var(--cyan));
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; font-weight: 800; letter-spacing: 0.05em;
  flex-shrink: 0;
}

.profile-info { flex: 1; }

.profile-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem;
}

.profile-bio {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 0 0 1rem;
}

.profile-stats {
  display: flex;
  gap: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--pink);
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-tertiary);
}

/* ─── About text ─── */
.about-text {
  font-size: 0.88rem;
  color: var(--text-primary);
  line-height: 1.8;
  margin: 0 0 0.75rem;
}

.about-text:last-child { margin-bottom: 0; }
.about-text strong { color: var(--pink); }

/* ─── Feature list ─── */
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.88rem;
  color: var(--text-primary);
  line-height: 1.6;
}

.feature-icon {
  width: 28px; height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.7rem;
  flex-shrink: 0;
}

/* ─── Tech ─── */
.tech-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.tech-item {
  padding: 0.3rem 1rem;
  border-radius: 20px;
  background: rgba(96, 165, 250, 0.08);
  color: var(--cyan);
  font-size: 0.78rem;
  border: 1px solid rgba(96, 165, 250, 0.12);
  font-family: var(--font-mono);
  letter-spacing: 0.03em;
  text-decoration: none;
  transition: all 0.2s;
}
.tech-item:hover {
  background: rgba(96, 165, 250, 0.16);
  border-color: var(--cyan);
  transform: translateY(-1px);
}

/* ─── Contact ─── */
.contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  margin-top: 0.75rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.85rem;
  padding: 0.6rem 0.875rem;
  border-radius: 10px;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.4);
}

.contact-link:hover {
  color: var(--cyan);
  background: rgba(96, 165, 250, 0.06);
}

@media (max-width: 768px) {
  .page-header { padding: 0 1rem; }
  .page-title { font-size: 1.5rem; }
  .card { padding: 1.25rem; }
  .profile-top { flex-direction: column; text-align: center; }
  .profile-stats { justify-content: center; }
}
</style>
