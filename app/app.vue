<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "de",
  },
  link: [
    { rel: "icon", type: "image/png", sizes: "96x96", href: "/images/favicon/favicon-96x96.png" },
    { rel: "icon", type: "image/svg+xml", href: "/images/favicon/favicon.svg" },
    { rel: "shortcut icon", href: "/images/favicon/favicon.ico" },
    { rel: "apple-touch-icon", sizes: "180x180", href: "/images/favicon/apple-touch-icon.png" },
    { rel: "manifest", href: "/site.webmanifest" },
  ],
  meta: [{ name: "apple-mobile-web-app-title", content: "Pastentonne" }],
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
