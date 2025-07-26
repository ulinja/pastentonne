<script setup lang="ts">
const year = ref(new Date().getFullYear());
</script>

<template>
  <div
    class="from-background-400 via-background-600 to-background-400 bg-gradient-to-b text-lg flex w-full items-center justify-start px-6 py-2"
  >
    <div class="flex items-center justify-center gap-1">
      <Icon name="mdi:copyright" />
      <p class="font-light font-decor">
        {{ year }}
        <a href="https://github.com/ulinja/pastentonne">
          Ulinja
        </a>
      </p>
    </div>
  </div>
</template>
