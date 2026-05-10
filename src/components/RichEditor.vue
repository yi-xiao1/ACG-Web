<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)

function execCmd(cmd, val) {
  document.execCommand(cmd, false, val || null)
  editorRef.value?.focus()
  emitContent()
}

function emitContent() {
  emit('update:modelValue', editorRef.value?.innerHTML || '')
}

watch(() => props.modelValue, (val) => {
  if (editorRef.value && editorRef.value.innerHTML !== val) {
    editorRef.value.innerHTML = val
  }
})
</script>

<template>
  <div class="editor">
    <div class="editor-toolbar">
      <button type="button" @click="execCmd('bold')" title="加粗" class="tool-btn"><strong>B</strong></button>
      <button type="button" @click="execCmd('italic')" title="斜体" class="tool-btn"><em>I</em></button>
      <span class="tool-sep"></span>
      <button type="button" @click="execCmd('insertUnorderedList')" title="无序列表" class="tool-btn">≡</button>
      <button type="button" @click="execCmd('insertOrderedList')" title="有序列表" class="tool-btn">#</button>
      <span class="tool-sep"></span>
      <button type="button" @click="execCmd('createLink', prompt('请输入链接:'))" title="插入链接" class="tool-btn">🔗</button>
    </div>
    <div
      ref="editorRef"
      class="editor-area"
      contenteditable="true"
      :innerHTML="modelValue"
      @input="emitContent"
      @paste="emitContent"
      placeholder="写下你的留言…"
    ></div>
  </div>
</template>

<style scoped>
.editor {
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.2s;
}

.editor:focus-within {
  border-color: var(--cyan);
  box-shadow: 0 0 12px rgba(96, 165, 250, 0.08);
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 0.125rem;
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid var(--border-color);
  background: rgba(245, 240, 255, 0.5);
}

.tool-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: rgba(244, 114, 182, 0.06);
  color: var(--text-primary);
}

.tool-sep {
  width: 1px;
  height: 18px;
  background: var(--border-color);
  margin: 0 0.25rem;
}

.editor-area {
  min-height: 130px;
  padding: 0.75rem 0.875rem;
  outline: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  line-height: 1.7;
}

.editor-area:empty::before {
  content: attr(placeholder);
  color: var(--text-tertiary);
}

.editor-area :deep(ul),
.editor-area :deep(ol) {
  padding-left: 1.5rem;
}

.editor-area :deep(a) {
  color: var(--cyan);
  text-decoration: underline;
}
</style>
