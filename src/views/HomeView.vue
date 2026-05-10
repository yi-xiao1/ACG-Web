<script setup>
import { ref } from 'vue'
import { useWorksStore } from '@/stores/works'
import WorkCard from '@/components/WorkCard.vue'
import TagFilter from '@/components/TagFilter.vue'
import SidebarLayout from '@/components/SidebarLayout.vue'

const worksStore = useWorksStore()

const sections = [
  { key: 'anime', label: '番剧' },
  { key: 'manga', label: '漫画' },
  { key: 'novel', label: '小说' },
  { key: 'game', label: '游戏' }
]

const activeTags = ref({})

function getWorks(key) {
  return worksStore[key + 'Works'] || []
}

function getTags(key) {
  const tagSet = new Set()
  getWorks(key).forEach(w => (w.tags || []).forEach(t => tagSet.add(t)))
  return [...tagSet]
}

function filteredWorks(key) {
  const list = getWorks(key)
  const active = activeTags.value[key]
  if (!active) return list
  return list.filter(w => (w.tags || []).includes(active))
}

function onTagSelect(key, tag) {
  activeTags.value[key] = tag
}
</script>

<template>
  <div class="home">
    <section class="hero-banner">
      <div class="hero-orb hero-orb--1"></div>
      <div class="hero-orb hero-orb--2"></div>
      <div class="hero-content">
        <span class="hero-kicker">✦ 二次元记忆档案馆 ✦</span>
        <h1 class="hero-title">
          <span class="hero-title-line">ACG</span>
          <span class="hero-title-line hero-title-line--sub">档案馆</span>
        </h1>
        <p class="hero-desc">记录那些触动我们的故事</p>
      </div>
    </section>

    <SidebarLayout>
      <section v-for="sec in sections" :key="sec.key" class="section">
        <div class="section-header">
          <div class="section-line"></div>
          <h2 class="section-title">{{ sec.label }}</h2>
          <div class="section-line section-line--right"></div>
        </div>
        <TagFilter
          :tags="getTags(sec.key)"
          :activeTag="activeTags[sec.key] || ''"
          @select="(t) => onTagSelect(sec.key, t)"
        />
        <div v-if="filteredWorks(sec.key).length" class="works-grid">
          <WorkCard v-for="(work, wi) in filteredWorks(sec.key)" :key="work.id" :work="work" :index="wi" />
        </div>
        <div v-else class="empty-state">
          <span class="empty-mark">—</span>
          <p>该分类下暂无作品</p>
        </div>
      </section>
    </SidebarLayout>
  </div>
</template>

<style scoped>
.hero-banner {
  position: relative;
  min-height: 38vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
}
.hero-orb--1 {
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.08), transparent 70%);
  top: -10%; left: -10%;
  animation: orb1 12s ease-in-out infinite alternate;
}
.hero-orb--2 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(96, 165, 250, 0.06), transparent 70%);
  bottom: -10%; right: -10%;
  animation: orb2 15s ease-in-out infinite alternate;
}
@keyframes orb1 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(60px, 40px) scale(1.2); }
}
@keyframes orb2 {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(-50px, -30px) scale(1.15); }
}

.hero-content {
  position: relative; z-index: 1; text-align: center; padding: 2rem;
  animation: hero-in 1s ease both;
}
@keyframes hero-in {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
.hero-kicker {
  display: inline-block; font-size: 0.75rem; letter-spacing: 0.25em;
  color: var(--cyan); margin-bottom: 1.25rem; opacity: 0.7;
}
.hero-title { display: flex; flex-direction: column; gap: 0.125rem; margin-bottom: 1rem; }
.hero-title-line {
  font-size: 4rem; font-weight: 900; line-height: 1; letter-spacing: 0.08em;
  background: linear-gradient(135deg, #f472b6, #fda4c8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-title-line--sub {
  font-size: 2rem;
  font-weight: 700;
}
.hero-desc { color: var(--text-secondary); font-size: 0.95rem; letter-spacing: 0.1em; }

.section { margin-bottom: 2.5rem; }
.section-header { display: flex; align-items: center; justify-content: center; gap: 0.75rem; margin-bottom: 1rem; }
.section-line { width: 40px; height: 2px; background: var(--pink); border-radius: 2px; opacity: 0.4; }
.section-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); letter-spacing: 0.08em; white-space: nowrap; }
.works-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; }
.empty-state { padding: 3rem; text-align: center; background: rgba(255, 255, 255, 0.4); border-radius: 14px; border: 1px dashed var(--border-color); }
.empty-mark { color: var(--text-tertiary); font-size: 1.5rem; }
.empty-state p { color: var(--text-tertiary); font-size: 0.85rem; margin-top: 0.5rem; }

@media (max-width: 768px) {
  .hero-banner { min-height: 30vh; }
  .hero-title-line { font-size: 2.75rem; }
  .hero-title-line--sub { font-size: 1.5rem; }
  .works-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.875rem; }
}
</style>
