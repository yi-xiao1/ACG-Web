export function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return null
  const frontmatter = {}
  const lines = match[1].split('\n')
  for (const line of lines) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) {
      let value = kv[2].trim()
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      } else if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/"/g, '')).filter(Boolean)
      }
      if (kv[1] === 'tags' && !Array.isArray(value)) {
        value = [value]
      }
      frontmatter[kv[1]] = value
    }
  }
  return {
    ...frontmatter,
    body: match[2].trim()
  }
}

export const typeLabels = {
  anime: '番剧',
  manga: '漫画',
  novel: '小说',
  game: '游戏'
}

export const typeColors = {
  anime: '#f472b6',
  manga: '#fb923c',
  novel: '#60a5fa',
  game: '#a78bfa'
}
