<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorksStore } from '@/stores/works'
import { typeLabels } from '@/composables/useWorks'
import { marked } from 'marked'

const route = useRoute()
const router = useRouter()
const worksStore = useWorksStore()

const work = computed(() => {
  return worksStore.getWorkById(route.params.type, route.params.id)
})

const bodyHtml = computed(() => {
  if (!work.value) return ''
  return marked.parse(work.value.body, { breaks: true })
})

const typeLabel = computed(() => typeLabels[route.params.type] || route.params.type)

const coverStyle = computed(() => {
  if (work.value?.cover) {
    return { background: `url(${work.value.cover}) center/cover no-repeat` }
  }
  return { background: 'var(--gradient-' + work.value?.type + ')' }
})
</script>

<template>
  <div class="detail">
    <div v-if="work" class="container">
      <button class="back-btn" @click="router.back()">
        <span class="back-arrow">←</span>
        <span>返回</span>
      </button>

      <div class="detail-hero">
        <div class="detail-cover" :class="{ 'detail-cover--noimg': !work.cover }" :style="!work.cover ? coverStyle : {}">
          <img v-if="work.cover" :src="work.cover" :alt="work.title" class="detail-cover-img" />
          <div class="cover-badge">{{ typeLabel }}</div>
          <div class="cover-corner cover-corner--tl"></div>
          <div class="cover-corner cover-corner--tr"></div>
          <div class="cover-corner cover-corner--bl"></div>
          <div class="cover-corner cover-corner--br"></div>
        </div>

        <div class="detail-info">
          <div class="info-meta">
            <time class="info-date">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              {{ work.publishDate }}
            </time>
          </div>

          <h1 class="detail-title">{{ work.title }}</h1>

          <div class="detail-tags">
            <span v-for="tag in (work.tags || [])" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <a v-if="work.url" :href="work.url" target="_blank" rel="noopener noreferrer" class="visit-btn">
            <span>前往观看</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7"/><path d="M7 7h10v10"/></svg>
          </a>
        </div>
      </div>

      <div class="detail-body">
        <div class="body-header">
          <span class="body-label">✦ 作者评论</span>
          <div class="body-line"></div>
        </div>
        <div class="body-content markdown-body" v-html="bodyHtml"></div>
      </div>
    </div>

    <div v-else class="not-found">
      <div class="nf-mark">◆</div>
      <h2>作品未找到</h2>
      <p>该作品可能已被移除或链接有误</p>
      <router-link to="/" class="visit-btn">返回首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: none;
  border: none;
  color: var(--text-tertiary);
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.back-btn:hover {
  color: var(--cyan);
  background: rgba(96, 165, 250, 0.06);
}

.back-arrow {
  display: inline-block;
  transition: transform 0.2s;
}

.back-btn:hover .back-arrow {
  transform: translateX(-3px);
}

.detail-hero {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 3rem;
}

.detail-cover {
  width: 260px;
  min-height: 160px;
  border-radius: 14px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.detail-cover--noimg {
  min-height: 200px;
}

.detail-cover-img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 340px;
  object-fit: cover;
}

.cover-badge {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  padding: 0.25rem 0.9rem;
  border-radius: 8px;
  color: rgba(42, 36, 56, 0.85);
  font-size: 0.78rem;
  letter-spacing: 0.05em;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.cover-corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: rgba(255,255,255,0.3);
  border-style: solid;
  z-index: 1;
}
.cover-corner--tl { top: 10px; left: 10px; border-width: 2px 0 0 2px; border-radius: 3px 0 0 0; }
.cover-corner--tr { top: 10px; right: 10px; border-width: 2px 2px 0 0; border-radius: 0 3px 0 0; }
.cover-corner--bl { bottom: 10px; left: 10px; border-width: 0 0 2px 2px; border-radius: 0 0 0 3px; }
.cover-corner--br { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; border-radius: 0 0 3px 0; }

.detail-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
}

.info-meta {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.info-date {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-tertiary);
  font-size: 0.8rem;
}

.detail-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: 0.04em;
  line-height: 1.2;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  padding: 0.2rem 0.75rem;
  border-radius: 20px;
  background: rgba(96, 165, 250, 0.08);
  color: var(--cyan);
  font-size: 0.78rem;
  border: 1px solid rgba(96, 165, 250, 0.15);
}

.visit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--pink);
  color: #fff;
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  align-self: flex-start;
}

.visit-btn:hover {
  background: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 114, 182, 0.25);
}

.detail-body {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 2rem;
}

.body-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.body-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--pink);
  letter-spacing: 0.08em;
  white-space: nowrap;
}

.body-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--border-color), transparent);
}

.markdown-body {
  color: var(--text-primary);
  line-height: 1.9;
  font-size: 0.95rem;
}

.markdown-body :deep(h2) {
  font-size: 1.25rem;
  margin: 1.5rem 0 0.75rem;
  color: var(--text-primary);
  font-weight: 700;
  letter-spacing: 0.03em;
}

.markdown-body :deep(h3) {
  font-size: 1.05rem;
  margin: 1.25rem 0 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.markdown-body :deep(p) { margin: 0.75rem 0; }

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 1.5rem;
  margin: 0.75rem 0;
}

.markdown-body :deep(li) { margin: 0.3rem 0; }

.markdown-body :deep(strong) {
  color: var(--pink);
  font-weight: 700;
}

.markdown-body :deep(blockquote) {
  border-left: 2px solid var(--cyan);
  padding: 0.5rem 1rem;
  margin: 1rem 0;
  background: rgba(96, 165, 250, 0.04);
  border-radius: 0 8px 8px 0;
  color: var(--text-secondary);
  font-style: italic;
}

.markdown-body :deep(code) {
  font-family: var(--font-mono);
  background: rgba(180, 160, 255, 0.08);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.85em;
}

.not-found {
  text-align: center;
  padding: 6rem 2rem;
}

.nf-mark {
  font-size: 3rem;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.not-found h2 {
  font-size: 1.35rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .detail-hero { flex-direction: column; gap: 1.5rem; }
  .detail-cover { width: 100%; aspect-ratio: 16 / 9; }
  .detail-title { font-size: 1.65rem; }
  .container { padding: 1rem; }
  .detail-body { padding: 1.25rem; }
}
</style>
