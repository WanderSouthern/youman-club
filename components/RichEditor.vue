<template>
  <div class="editor">
    <div class="editor-bar">
      <button type="button" title="粗体" @click="cmd('bold')"><b>B</b></button>
      <button type="button" title="斜体" @click="cmd('italic')"><i>I</i></button>
      <button type="button" title="下划线" @click="cmd('underline')"><u>U</u></button>
      <button type="button" title="删除线" @click="cmd('strikeThrough')"><s>S</s></button>
      <button type="button" @click="block('h2')">二级标题</button>
      <button type="button" @click="block('h3')">三级标题</button>
      <button type="button" @click="cmd('insertUnorderedList')">无序列表</button>
      <button type="button" @click="cmd('insertOrderedList')">有序列表</button>
      <button type="button" @click="block('blockquote')">引用</button>
      <button type="button" @click="addLink">链接</button>
      <button type="button" @click="addImage">插图</button>
      <button type="button" @click="cmd('undo')">撤销</button>
      <button type="button" @click="cmd('redo')">重做</button>
      <button type="button" @click="cmd('removeFormat')">清除格式</button>
    </div>
    <div
      ref="box"
      class="editor-body prose-html"
      contenteditable="true"
      @input="emitHtml"
    />
  </div>
</template>

<script setup>
const props = defineProps({ modelValue: { type: String, default: '' } })
const emit = defineEmits(['update:modelValue'])
const box = ref(null)

onMounted(() => {
  if (box.value) box.value.innerHTML = props.modelValue || '<p></p>'
})
watch(() => props.modelValue, (v) => {
  if (box.value && box.value.innerHTML !== v) box.value.innerHTML = v || '<p></p>'
})
function emitHtml() {
  emit('update:modelValue', box.value?.innerHTML || '')
}
function cmd(name, value) {
  document.execCommand(name, false, value)
  box.value?.focus()
  emitHtml()
}
function block(tag) {
  document.execCommand('formatBlock', false, tag)
  box.value?.focus()
  emitHtml()
}
function addLink() {
  const url = window.prompt('链接地址', 'https://')
  if (!url) return
  cmd('createLink', url)
}
async function addImage() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    try {
      const saved = await postForm('/api/uploads/image', fd)
      document.execCommand('insertHTML', false, `<img src="/api/media/${saved.storedName}" alt="">`)
      emitHtml()
    } catch (e) {
      window.alert(e.data?.statusMessage || e.message || '插图失败')
    }
  }
  input.click()
}
</script>
