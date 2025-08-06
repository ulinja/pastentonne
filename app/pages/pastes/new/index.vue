<script setup lang="ts">
definePageMeta({
  middleware: ["logged-in-only"],
});

const pasteName = ref<string | undefined>(undefined);
</script>

<template>
  <form class="flex max-w-6xl grow w-full flex-col justify-center self-center">
    <h1 class="w-full">New Textpaste</h1>
    <div class="flex items-end justify-center gap-2 max-w-xl">
      <div class="mt-8 flex grow flex-col justify-center gap-1">
        <Label for="paste-name">Paste Name</Label>
        <Input id="paste-name" type="text" v-model="pasteName" />
      </div>
      <Button @click="onClickRandomizeName" type="button">
        <Icon name="mdi:dice-multiple" class="text-primary-foreground size-6" />
      </Button>
    </div>
    <div class="mt-4 flex grow flex-col justify-center gap-1">
      <Textarea placeholder="Type your paste here..." class="grow" />
    </div>
    <Button type="submit" class="mt-8">Save</Button>
  </form>
</template>
