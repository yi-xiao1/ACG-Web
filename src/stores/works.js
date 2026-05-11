import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { parseFrontmatter } from '@/composables/useWorks'

const modules = import.meta.glob('/src/data/**/*.md', { query: '?raw', import: 'default', eager: true })

export const useWorksStore = defineStore('works', () => {
  const works = ref([])
  const loaded = ref(false)

  function loadAllWorks() {
    if (loaded.value) return
    const result = []
    for (const [path, content] of Object.entries(modules)) {
      const parsed = parseFrontmatter(content)
      const typeMatch = path.match(/\/data\/(\w+)\//)
      if (parsed && typeMatch) {
        parsed.type = typeMatch[1]
        result.push(parsed)
      }
    }
    works.value = result
    loaded.value = true
  }

  const animeWorks = computed(() => works.value.filter(w => w.type === 'anime'))
  const mangaWorks = computed(() => works.value.filter(w => w.type === 'manga'))
  const novelWorks = computed(() => works.value.filter(w => w.type === 'novel'))
  const gameWorks = computed(() => works.value.filter(w => w.type === 'game'))

  const allTags = computed(() => {
    const tagSet = new Set()
    works.value.forEach(w => (w.tags || []).forEach(t => tagSet.add(t)))
    return [...tagSet]
  })

  function getWorkById(type, id) {
    return works.value.find(w => w.type === type && w.id === id) || null
  }

  function searchWorks(query) {
    if (!query) return []
    const q = query.toLowerCase()
    return works.value.filter(w =>
      w.title.toLowerCase().includes(q)
    )
  }

  loadAllWorks()

  return { works, loaded, animeWorks, mangaWorks, novelWorks, gameWorks, allTags, getWorkById, searchWorks }
})
