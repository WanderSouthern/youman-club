<template>
  <div class="wrap page-hero" style="max-width:640px">
    <h1>添加到主屏幕</h1>
    <p class="lede">使用系统浏览器打开本站，即可将游漫社加入主屏幕，便于日常访问。</p>
    <section class="prose">
      <h2>Android</h2>
      <p>Chrome 菜单中选择「安装应用」或「添加到主屏幕」。</p>
      <h2>iPhone / iPad</h2>
      <p>使用 Safari，点击分享后选择「添加到主屏幕」。请勿使用微信内置浏览器。</p>
    </section>
    <p v-if="canInstall" style="margin:24px 0 48px">
      <button class="btn btn-coral" @click="install">安装</button>
    </p>
  </div>
</template>

<script setup>
useHead({ title: '添加到主屏幕' })
const { $pwa } = useNuxtApp()
const canInstall = computed(() => $pwa?.showInstallPrompt)
async function install() {
  await $pwa?.install()
}
</script>
