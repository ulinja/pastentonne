<script setup lang="ts">
import { FetchError } from "ofetch";

definePageMeta({
  middleware: ["logged-in-only"],
});

const pasteName = ref<string | undefined>(undefined);
const pasteContent = ref<string | undefined>(undefined);

const errorMessage = ref<string | null>(null);

async function initialFetchRandomName(): Promise<void> {
  const { data } = await useFetch("/api/paste/random-name");
  if (data.value) pasteName.value = data.value
}

async function onClickRandomizeName(): Promise<void> {
  pasteName.value = await $fetch("/api/paste/random-name");
}

async function onSubmit(): Promise<void> {
  errorMessage.value = null;
  try {
    const textPaste: DbTextPaste = await $fetch("/api/paste", {
      method: "POST",
      body: {
        name: pasteName.value,
        content: pasteContent.value,
      }
    });
  } catch (error) {
    if (error instanceof FetchError && error.statusMessage) {
      errorMessage.value = error.statusMessage;
    } else {
      errorMessage.value = "An unknown error occurred.";
    }
  }
}

await initialFetchRandomName();
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex max-w-6xl grow w-full flex-col justify-center self-center">
    <h1 class="w-full">New Textpaste</h1>
    <div class="flex items-end justify-center gap-2 max-w-xl">
      <div class="mt-8 flex grow flex-col justify-center gap-1">
        <Label for="paste-name">Paste Name</Label>
        <Input id="paste-name" type="text" required v-model="pasteName" />
      </div>
      <Button @click="onClickRandomizeName" type="button">
        <Icon name="mdi:dice-multiple" class="text-primary-foreground size-6" />
      </Button>
    </div>
    <div class="mt-4 flex grow flex-col justify-center gap-1">
      <Textarea v-model="pasteContent" required placeholder="Type your paste here..." class="grow" />
    </div>
    <div v-if="errorMessage" class="bg-danger-600/75 border-2 border-danger-700 text-white w-full flex flex-col items-center justify-center mt-8 p-4 rounded-lg">
      <p class="w-full">
        <span class="font-bold">Error:</span>
        {{ errorMessage }}
      </p>
    </div>
    <Button type="submit" :class="[ errorMessage ? 'mt-2' : 'mt-8' ]">Save</Button>
  </form>
</template>
