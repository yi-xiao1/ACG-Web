<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useWorksStore } from '@/stores/works'

const router = useRouter()
const route = useRoute()
const worksStore = useWorksStore()

const menuOpen = ref(false)
const searchQuery = ref('')
const showSuggestions = ref(false)

const suggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const q = searchQuery.value.toLowerCase()
  return worksStore.works.filter(w => w.title.toLowerCase().includes(q)).slice(0, 6)
})

function doSearch() {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
    showSuggestions.value = false
    searchQuery.value = ''
    menuOpen.value = false
  }
}

function selectSuggestion(work) {
  router.push(`/detail/${work.type}/${work.id}`)
  showSuggestions.value = false
  searchQuery.value = ''
}

watch(searchQuery, () => {
  showSuggestions.value = searchQuery.value.trim().length > 0
})

function handleBlur() {
  setTimeout(() => { showSuggestions.value = false }, 200)
}

function toggleMenu() { menuOpen.value = !menuOpen.value }
function closeMenu() { menuOpen.value = false }
</script>

<template>
  <nav class="navbar">
    <div class="navbar-inner">
      <router-link to="/" class="nav-logo" @click="closeMenu">
        <span class="logo-mark">
          <span class="logo-diamond">◆</span>
          <span class="logo-glow"></span>
        </span>
        <span class="logo-text">ACG_档案馆</span>
      </router-link>

      <button class="hamburger" :class="{ active: menuOpen }" @click="toggleMenu" aria-label="菜单">
        <span></span><span></span><span></span>
      </button>

      <div class="nav-right" :class="{ open: menuOpen }">
        <div class="nav-links">
          <router-link to="/" @click="closeMenu" :class="{ active: route.path === '/' }">
            <span class="link-label">首页</span>
            <span class="link-indicator"></span>
          </router-link>
          <router-link to="/message" @click="closeMenu" :class="{ active: route.path === '/message' }">
            <span class="link-label">留言</span>
            <span class="link-indicator"></span>
          </router-link>
          <router-link to="/about" @click="closeMenu" :class="{ active: route.path === '/about' }">
            <span class="link-label">关于</span>
            <span class="link-indicator"></span>
          </router-link>
        </div>

        <div class="search-box">
          <form @submit.prevent="doSearch">
            <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索作品…"
              class="search-input"
              @focus="showSuggestions = searchQuery.trim().length > 0"
              @blur="handleBlur"
            />
            <button type="submit" class="search-btn" aria-label="搜索">→</button>
          </form>

          <Transition name="suggest">
            <div v-if="showSuggestions && suggestions.length" class="suggestions">
              <div
                v-for="work in suggestions"
                :key="work.id"
                class="suggestion-item"
                @mousedown.prevent="selectSuggestion(work)"
              >
                <div class="suggestion-cover" :style="{ background: 'var(--gradient-' + work.type + ')' }"></div>
                <div class="suggestion-info">
                  <span class="suggestion-title">{{ work.title }}</span>
                  <span class="suggestion-type">{{ { anime: '番剧', manga: '漫画', novel: '小说', game: '游戏' }[work.type] }}</span>
                </div>
                <span class="suggestion-arrow">→</span>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(245, 240, 255, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-color);
}

.navbar-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  position: relative;
}

.logo-mark {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-diamond {
  font-size: 1.3rem;
  color: var(--pink);
  animation: logo-pulse 3s ease-in-out infinite;
}

.logo-glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(244, 114, 182, 0.2), transparent 70%);
  animation: logo-glow 3s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

@keyframes logo-glow {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.3); }
}

.logo-text {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-primary);
  letter-spacing: 0.08em;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 0.125rem;
}

.nav-links a {
  text-decoration: none;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  position: relative;
}

.link-label {
  color: var(--text-secondary);
  transition: color 0.2s;
}

.link-indicator {
  width: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--pink);
  transition: width 0.25s;
}

.nav-links a:hover .link-label,
.nav-links a.active .link-label {
  color: var(--text-primary);
}

.nav-links a:hover .link-indicator,
.nav-links a.active .link-indicator {
  width: 100%;
}

.search-box {
  position: relative;
}

.search-box form {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  padding: 0 0.375rem 0 0.75rem;
  transition: all 0.25s;
}

.search-box form:focus-within {
  border-color: var(--cyan);
  box-shadow: 0 0 16px rgba(96, 165, 250, 0.1);
}

.search-icon {
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.search-box form:focus-within .search-icon {
  color: var(--cyan);
}

.search-input {
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  padding: 0.5rem 0.375rem;
  width: 160px;
  font-size: 0.85rem;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-btn {
  background: none;
  border: none;
  color: var(--text-tertiary);
  padding: 0.375rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 1rem;
}

.search-box form:focus-within .search-btn {
  color: var(--cyan);
}

.suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--surface-elevated);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(100, 80, 160, 0.12);
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.75rem;
  cursor: pointer;
  transition: background 0.15s;
}

.suggestion-item:not(:last-child) {
  border-bottom: 1px solid rgba(200, 180, 255, 0.1);
}

.suggestion-item:hover {
  background: rgba(244, 114, 182, 0.04);
}

.suggestion-cover {
  width: 34px;
  height: 34px;
  border-radius: 6px;
  flex-shrink: 0;
}

.suggestion-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.suggestion-title {
  font-size: 0.85rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-type {
  font-size: 0.7rem;
  color: var(--text-tertiary);
}

.suggestion-arrow {
  color: var(--text-tertiary);
  font-size: 0.85rem;
  opacity: 0;
  transition: all 0.2s;
}

.suggestion-item:hover .suggestion-arrow {
  opacity: 1;
  color: var(--cyan);
  transform: translateX(3px);
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text-primary);
  transition: all 0.3s;
  border-radius: 2px;
}

.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.suggest-enter-active,
.suggest-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.suggest-enter-from,
.suggest-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 768px) {
  .navbar-inner { padding: 0 1rem; }
  .hamburger { display: flex; }

  .nav-right {
    position: fixed;
    top: 68px;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(245, 240, 255, 0.98);
    backdrop-filter: blur(24px);
    padding: 1.25rem;
    gap: 1.25rem;
    border-bottom: 1px solid var(--border-color);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
  }

  .nav-right.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
  }

  .nav-links a {
    padding: 0.7rem 1rem;
    flex-direction: row;
    justify-content: space-between;
  }

  .nav-links a .link-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    transition: all 0.2s;
  }

  .nav-links a.active .link-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--pink);
    box-shadow: 0 0 8px var(--pink);
  }

  .search-box { width: 100%; }
  .search-box form { width: 100%; }
  .search-input { flex: 1; width: auto; }
  .suggestions { position: static; margin-top: 4px; box-shadow: none; }
}
</style>
