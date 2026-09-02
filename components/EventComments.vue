<template>
  <section style="margin: 36px 0 56px">
    <div class="section-h">
      <h2>评论</h2>
      <button class="like-btn" :class="{ on: liked }" type="button" :disabled="!user || user.role === 'pending'" @click="toggleLike">
        {{ liked ? '已点赞' : '点赞' }} {{ likeCount }}
      </button>
    </div>
    <form v-if="user && user.role !== 'pending'" class="form" style="margin-bottom:18px" @submit.prevent="send">
      <label>发表评论
        <textarea v-model="text" maxlength="800" placeholder="写下想法"></textarea>
      </label>
      <p v-if="err" class="alert">{{ err }}</p>
      <button class="btn btn-coral btn-sm" :disabled="busy || !text.trim()">发送</button>
    </form>
    <p v-else-if="!user" class="muted">登录后可评论、点赞。</p>
    <div class="comment-list">
      <article v-for="c in comments" :key="c.id" class="comment-item">
        <div class="comment-head">
          <Avatar :name="c.user.name" :user-id="c.user.id" :avatar="c.user.avatar" :size="28" />
          <strong>{{ c.user.name }}</strong>
          <span class="muted">{{ fmtDate(c.createdAt) }}</span>
          <button class="like-btn" :class="{ on: c.liked }" type="button" :disabled="!user || user.role === 'pending'" @click="toggleComment(c)">
            {{ c.liked ? '已赞' : '赞' }} {{ c.likeCount }}
          </button>
        </div>
        <p style="margin:0;white-space:pre-wrap">{{ c.content }}</p>
      </article>
    </div>
    <p v-if="!comments.length" class="empty">还没有评论。</p>
  </section>
</template>

<script setup>
const props = defineProps({
  eventId: { type: String, required: true },
  initialComments: { type: Array, default: () => [] },
  initialLiked: { type: Boolean, default: false },
  initialLikeCount: { type: Number, default: 0 }
})
const { user } = useAuth()
const comments = ref([...(props.initialComments || [])])
const liked = ref(!!props.initialLiked)
const likeCount = ref(props.initialLikeCount || 0)
watch(() => props.initialComments, (v) => { comments.value = [...(v || [])] })
watch(() => props.initialLiked, (v) => { liked.value = !!v })
watch(() => props.initialLikeCount, (v) => { likeCount.value = v || 0 })
const text = ref('')
const busy = ref(false)
const err = ref('')

async function send() {
  busy.value = true
  err.value = ''
  try {
    const row = await $fetch(`/api/events/${props.eventId}/comments`, { method: 'POST', body: { content: text.value } })
    comments.value = [row, ...comments.value]
    text.value = ''
  } catch (e) {
    err.value = e.data?.statusMessage || '发送失败'
  } finally {
    busy.value = false
  }
}
async function toggleLike() {
  try {
    const r = await $fetch(`/api/events/${props.eventId}/like`, { method: 'POST' })
    liked.value = r.liked
    likeCount.value = r.likeCount
  } catch (e) {
    err.value = e.data?.statusMessage || '操作失败'
  }
}
async function toggleComment(c) {
  try {
    const r = await $fetch(`/api/comments/${c.id}/like`, { method: 'POST' })
    c.liked = r.liked
    c.likeCount = r.likeCount
  } catch (e) {
    err.value = e.data?.statusMessage || '操作失败'
  }
}
</script>
