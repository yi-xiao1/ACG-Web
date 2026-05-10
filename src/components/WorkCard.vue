<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { typeLabels } from '@/composables/useWorks'

const props = defineProps({
  work: { type: Object, required: true },
  index: { type: Number, default: 0 }
})

const router = useRouter()

const coverStyle = computed(() => {
  return { background: 'var(--gradient-' + props.work.type + ')' }
})

function goDetail() {
  router.push(`/detail/${props.work.type}/${props.work.id}`)
}
</script>

<template>
  <div
    class="work-card"
    :style="{ '--card-delay': index * 0.06 + 's' }"
    @click="goDetail"
  >
    <div class="card-cover" :style="coverStyle">
      <img v-if="work.cover" :src="work.cover" :alt="work.title" class="card-img" />
      <div class="card-badge">{{ typeLabels[work.type] || work.type }}</div>
    </div>
    <div class="card-body">
      <div class="card-tags">
        <span v-for="tag in (work.tags || []).slice(0, 3)" :key="tag" class="card-tag">{{ tag }}</span>
      </div>
      <h3 class="card-title">{{ work.title }}</h3>
    </div>
  </div>
</template>

<style scoped>
.work-card {
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  background: var(--surface-elevated);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  animation: card-in 0.5s ease both;
  animation-delay: var(--card-delay);
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.work-card:hover {
  transform: translateY(-6px);
  border-color: rgba(244, 114, 182, 0.25);
  box-shadow: 0 12px 36px rgba(180, 160, 255, 0.12);
}

/* ─── Cover ─── */
.card-cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 3 / 4;
}

.card-img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
}

/* ─── Badge ─── */
.card-badge {
  position: absolute;
  top: 8px;
  right: 10px;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  z-index: 2;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

/* ─── Body ─── */
.card-body {
  padding: 1rem 1rem 0.875rem;
  position: relative;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.35rem;
}

.card-tag {
  font-size: 0.68rem;
  color: var(--text-tertiary);
  background: rgba(180, 160, 255, 0.08);
  padding: 0.125rem 0.45rem;
  border-radius: 4px;
  letter-spacing: 0.02em;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  letter-spacing: 0.03em;
}
</style>
