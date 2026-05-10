<script setup>
import NavBar from '@/components/NavBar.vue'
</script>

<template>
  <div class="app-wrapper">
    <NavBar />
    <main class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-wave"></div>
        <div class="footer-content">
          <div class="footer-brand">
            <span class="footer-mark">◆</span>
            <span>ACG 档案馆</span>
          </div>
          <p class="footer-copy">用代码记录二次元的温度 · 2024</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 68px;
}

/* ─── Footer ─── */
.site-footer {
  margin-top: 6rem;
  position: relative;
}

.footer-inner {
  position: relative;
  padding-top: 3rem;
}

.footer-wave {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--pink), var(--cyan), var(--gold), transparent);
  opacity: 0.4;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.footer-mark {
  color: var(--pink);
  font-size: 0.75rem;
}

.footer-copy {
  color: var(--text-tertiary);
  font-size: 0.8rem;
}

/* ─── Page transitions ─── */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
    padding: 0 1rem 2rem;
  }
}
</style>
