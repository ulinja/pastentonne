<script setup lang="ts">
import { FetchError } from "ofetch";

definePageMeta({
  middleware: ["logged-in-only"],
});

const pasteName = ref<string | undefined>(undefined);
const pasteContent = ref<string | undefined>(undefined);

const errorMessage = ref<string | null>(null);

async function onClickRandomizeName(): Promise<void> {
  pasteName.value = await $fetch("/api/paste/random-name");
}

async function onSubmit(): Promise<void> {
  errorMessage.value = null;
  try {
    const textPaste: DbTextPaste = await $fetch("/api/paste/text", {
      method: "POST",
      body: {
        name: pasteName.value,
        content: pasteContent.value,
      },
    });
    await navigateTo({ name: "paste-text-id", params: { id: textPaste.id } });
  } catch (error) {
    if (error instanceof FetchError && error.statusMessage) {
      errorMessage.value = error.statusMessage;
    } else {
      errorMessage.value = "An unknown error occurred.";
    }
  }
}

onMounted(async () => {
  await onClickRandomizeName();
});
</script>

<template>
  <form class="flex w-full max-w-6xl grow flex-col justify-center self-center" @submit.prevent="onSubmit">
    <h1 class="w-full">New Textpaste</h1>
    <div class="flex max-w-xl items-end justify-center gap-2">
      <div class="mt-8 flex grow flex-col justify-center gap-1">
        <Label for="paste-name">Paste Name</Label>
        <Input id="paste-name" v-model="pasteName" type="text" required />
      </div>
      <Button type="button" @click="onClickRandomizeName">
        <Icon name="mdi:dice-multiple" class="text-primary-foreground size-6" />
      </Button>
    </div>
    <div class="mt-4 flex grow flex-col justify-center gap-1">
      <Textarea v-model="pasteContent" required placeholder="Type your paste here..." class="grow" />
    </div>
    <div
      v-if="errorMessage"
      class="bg-danger-600/75 border-danger-700 mt-8 flex w-full flex-col items-center justify-center rounded-lg border-2 p-4 text-white"
    >
      <p class="w-full">
        <span class="font-bold">Error:</span>
        {{ errorMessage }}
      </p>
    </div>
    <Button type="submit" :class="[errorMessage ? 'mt-2' : 'mt-8']">Save</Button>
  </form>
</template>
