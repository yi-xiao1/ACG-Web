<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorksStore } from '@/stores/works'
import { typeLabels } from '@/composables/useWorks'

const route = useRoute()
const router = useRouter()
const worksStore = useWorksStore()

const query = ref(route.query.q || '')

watch(() => route.query.q, (val) => {
  query.value = val || ''
})

const results = computed(() => {
  if (!query.value) return []
  return worksStore.searchWorks(query.value)
})

function goDetail(work) {
  router.push(`/detail/${work.type}/${work.id}`)
}
</script>

<template>
  <div class="search-page">
    <div class="container">
      <div class="search-header">
        <div class="search-kicker">✦ SEARCH</div>
        <h1 class="search-title">搜索结果</h1>
        <p v-if="query" class="search-query">
          关键词：<strong class="query-word">"{{ query }}"</strong>
          <span class="result-count">共 {{ results.length }} 项</span>
        </p>
      </div>

      <div v-if="results.length" class="result-list">
        <div v-for="work in results" :key="work.id" class="result-card" @click="goDetail(work)">
          <div class="result-cover" :style="{ background: 'var(--gradient-' + work.type + ')' }">
            <div class="result-badge">{{ typeLabels[work.type] || work.type }}</div>
          </div>
          <div class="result-info">
            <h3 class="result-title">{{ work.title }}</h3>
            <div class="result-tags">
              <span v-for="tag in (work.tags || [])" :key="tag" class="result-tag">{{ tag }}</span>
            </div>
          </div>
          <span class="result-arrow">→</span>
        </div>
      </div>

      <div v-else-if="query" class="empty-state">
        <div class="empty-icon">◆</div>
        <h2>未找到相关作品</h2>
        <p>试试其他关键词吧</p>
        <router-link to="/" class="back-link">返回首页 →</router-link>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">◇</div>
        <h2>输入关键词开始搜索</h2>
        <p>在导航栏中搜索作品名称</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  padding: 2rem 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.search-header {
  margin-bottom: 2.5rem;
}

.search-kicker {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--cyan);
  opacity: 0.5;
  margin-bottom: 0.5rem;
}

.search-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.75rem;
  letter-spacing: 0.04em;
}

.search-query {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.query-word {
  color: var(--pink);
  font-weight: 600;
}

.result-count {
  color: var(--text-tertiary);
  font-size: 0.8rem;
  font-family: var(--font-mono);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.result-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s;
}

.result-card:hover {
  border-color: rgba(96, 165, 250, 0.2);
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.85);
}

.result-cover {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.result-badge {
  font-size: 0.65rem;
  color: rgba(42, 36, 56, 0.8);
  background: rgba(255, 255, 255, 0.6);
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  letter-spacing: 0.05em;
}

.result-info {
  flex: 1;
  min-width: 0;
}

.result-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.375rem;
  letter-spacing: 0.02em;
}

.result-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.result-tag {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  background: rgba(180, 160, 255, 0.08);
  padding: 0.125rem 0.45rem;
  border-radius: 4px;
}

.result-arrow {
  color: var(--text-tertiary);
  font-size: 1.1rem;
  transition: all 0.2s;
  opacity: 0;
}

.result-card:hover .result-arrow {
  opacity: 1;
  color: var(--cyan);
  transform: translateX(3px);
}

.empty-state {
  text-align: center;
  padding: 5rem 2rem;
}

.empty-icon {
  font-size: 2.5rem;
  color: var(--text-tertiary);
  margin-bottom: 1rem;
}

.empty-state h2 {
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem;
}

.empty-state p {
  color: var(--text-tertiary);
  font-size: 0.85rem;
  margin: 0 0 1.5rem;
}

.back-link {
  display: inline-block;
  padding: 0.6rem 1.5rem;
  background: var(--pink);
  color: #fff;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.back-link:hover {
  background: var(--accent-hover);
  box-shadow: 0 4px 16px rgba(244, 114, 182, 0.2);
}

@media (max-width: 768px) {
  .container { padding: 0 1rem; }
  .search-title { font-size: 1.5rem; }
}
</style>
