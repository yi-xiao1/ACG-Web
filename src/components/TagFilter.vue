<script setup>
const props = defineProps({
  tags: { type: Array, default: () => [] },
  activeTag: { type: String, default: '' }
})

const emit = defineEmits(['select'])

function select(tag) {
  emit('select', props.activeTag === tag ? '' : tag)
}
</script>

<template>
  <div class="tag-filter">
    <button
      class="tag-btn"
      :class="{ active: activeTag === '' }"
      @click="select('')"
    >全部</button>
    <button
      v-for="tag in tags"
      :key="tag"
      class="tag-btn"
      :class="{ active: activeTag === tag }"
      @click="select(tag)"
    >{{ tag }}</button>
  </div>
</template>

<style scoped>
.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag-btn {
  padding: 0.3rem 1rem;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-tertiary);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.25s;
  letter-spacing: 0.03em;
}

.tag-btn:hover {
  border-color: var(--cyan);
  color: var(--cyan);
  box-shadow: 0 0 16px rgba(0, 240, 255, 0.05);
}

.tag-btn.active {
  background: transparent;
  border-color: var(--pink);
  color: var(--pink);
  box-shadow: 0 0 20px rgba(255, 42, 117, 0.08);
}
</style>
