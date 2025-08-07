<script setup lang="ts">
interface Props {
  pasteId: string;
  pasteName: string;
}
const props = defineProps<Props>();
const { pasteId, pasteName } = toRefs(props);
</script>

<template>
  <NuxtLink :to="`/paste/text/${pasteId}/`" class="underline">
    {{ pasteName }}
  </NuxtLink>
</template>
