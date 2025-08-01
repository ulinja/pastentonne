<script setup lang="ts">
const year = ref(new Date().getFullYear());
</script>

<template>
  <div
    class="from-background-400 via-background-600 to-background-400 flex w-full items-center justify-start bg-gradient-to-b px-6 py-2 text-lg"
  >
    <div class="flex items-center justify-center gap-1">
      <Icon name="mdi:copyright" />
      <p class="font-decor font-light">
        {{ year }}
        <a href="https://github.com/ulinja/pastentonne"> Ulinja </a>
      </p>
    </div>
  </div>
</template>
