<template>
  <header class="site-header">
    <div class="wrap header-inner">
      <NuxtLink to="/" class="brand" @click="open = false">
        <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="4" y="4" width="56" height="56" rx="10" fill="#e24a3b" />
          <text x="32" y="42" text-anchor="middle" fill="#fffaf1" font-size="28" font-family="Noto Serif SC, serif">游</text>
        </svg>
        <span>游漫社<small>旗山校区游戏协会</small></span>
      </NuxtLink>
      <button class="btn btn-ghost btn-sm menu-btn" type="button" @click="open = !open">菜单</button>
      <nav class="nav" :class="{ open }">
        <NuxtLink to="/" class="nav-pill nav-home" @click="open = false">首页</NuxtLink>
        <NuxtLink to="/about" class="nav-pill nav-about" @click="open = false">关于</NuxtLink>
        <NuxtLink to="/departments" class="nav-pill nav-dept" @click="open = false">部门</NuxtLink>
        <NuxtLink to="/events" class="nav-pill nav-event" @click="open = false">活动</NuxtLink>
        <NuxtLink to="/recruit" class="nav-pill nav-recruit" @click="open = false">招新</NuxtLink>
        <NuxtLink v-if="user && user.role !== 'pending'" to="/app/files" class="nav-pill nav-files" @click="open = false">资料</NuxtLink>
        <NuxtLink v-if="isStaff" to="/admin" class="nav-pill nav-admin" @click="open = false">管理</NuxtLink>
        <NuxtLink v-if="!user" to="/login" class="nav-pill nav-login" @click="open = false">登录</NuxtLink>
        <div v-else class="account" @click="menu = !menu" @keydown.enter="menu = !menu" tabindex="0">
          <Avatar :name="user.name" :user-id="user.id" :avatar="user.avatar" :size="32" />
          <span class="account-name">
            {{ user.name }}
            <i v-if="unread > 0" class="unread-dot" />
          </span>
          <div v-if="menu" class="account-menu" @click.stop>
            <NuxtLink to="/app" @click="close">个人主页</NuxtLink>
            <NuxtLink to="/app/events" @click="close">我的活动</NuxtLink>
            <NuxtLink to="/app/messages" @click="close" class="menu-msg">
              消息
              <i v-if="unread > 0" class="unread-dot" />
            </NuxtLink>
            <NuxtLink to="/app/profile" @click="close">资料设置</NuxtLink>
            <button type="button" @click="logout">退出</button>
          </div>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup>
const { user, isStaff, logout } = useAuth()
const { count: unread, refreshUnread } = useUnread()
const open = ref(false)
const menu = ref(false)
function close() {
  open.value = false
  menu.value = false
}
if (import.meta.client) {
  onMounted(() => {
    document.addEventListener('click', (e) => {
      if (!e.target.closest?.('.account')) menu.value = false
    })
    refreshUnread()
    const t = setInterval(refreshUnread, 30000)
    onUnmounted(() => clearInterval(t))
  })
  watch(user, () => refreshUnread())
}
</script>
