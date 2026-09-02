<template>
  <div>
    <SiteHeader />
    <SiteDecor />
    <div class="admin-shell">
      <aside class="admin-side">
        <NuxtLink to="/admin">总览</NuxtLink>
        <NuxtLink to="/admin/members">成员</NuxtLink>
        <NuxtLink to="/admin/departments">部门</NuxtLink>
        <NuxtLink to="/admin/events">活动</NuxtLink>
        <NuxtLink to="/admin/files">资料库</NuxtLink>
        <NuxtLink to="/admin/quotes">一言</NuxtLink>
        <NuxtLink to="/admin/content">站点内容</NuxtLink>
        <NuxtLink to="/admin/recruit">招新意向</NuxtLink>
      </aside>
      <div class="admin-main">
        <slot />
      </div>
    </div>
  </div>
</template>
