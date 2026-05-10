<script setup>
import CalendarWidget from '@/components/CalendarWidget.vue'
</script>

<template>
  <div class="page-layout">
    <aside class="page-sidebar">
      <CalendarWidget />
    </aside>
    <main class="page-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  max-width: 1280px;
  margin: 2rem auto;
  padding: 0 2rem;
  gap: 1.5rem;
  align-items: flex-start;
  flex: 1;
}

.page-sidebar {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 88px;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.page-main {
  flex: 1;
  min-width: 0;
}

@media (max-width: 900px) {
  .page-layout {
    flex-direction: column;
    padding: 0 1rem;
    margin: 1rem auto;
    gap: 1rem;
  }
  .page-sidebar {
    width: 100%;
    position: static;
    max-height: none;
  }
}
</style>
