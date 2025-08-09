<script setup lang="ts">
import { FetchError } from "ofetch";

// TODO: add file upload progress tracking

definePageMeta({
  middleware: ["logged-in-only"],
});

const pasteName = ref<string | undefined>(undefined);
const pasteFiles = ref<File[]>([]);

const errorMessage = ref<string | null>(null);

async function onClickRandomizeName(): Promise<void> {
  pasteName.value = await $fetch("/api/paste/random-name");
}

function _getFileInputElement(): HTMLInputElement {
  const fileInputElement = document.getElementById("files") as HTMLInputElement | null;
  if (fileInputElement === null) throw createError({
    statusCode: 500,
    statusMessage: "Failed to resolve files input element.",
  });
  return fileInputElement;
}

function onChangeFileInput(event: InputEvent): void {
  const fileInputElement = _getFileInputElement();
  const fileList = fileInputElement.files;
  if (fileList) {
    for (const file of fileList) {
      pasteFiles.value.push(file);
    }
  }
}

function onClickAdd(): void {
  _getFileInputElement().click();
}

async function onSubmit(): Promise<void> {
  errorMessage.value = null;
  if (pasteFiles.value.length < 1) {
    errorMessage.value = "Please add at least one file.";
    return;
  }
  if (!pasteName.value) {
    errorMessage.value = "Please specify a name for your paste.";
    return;
  }
  if (await checkIsPastenameTaken(pasteName.value)) {
    errorMessage.value = "This paste name is already taken.";
    return;
  }

  const formData = new FormData();
  formData.append("name", pasteName.value);
  pasteFiles.value.forEach(file => {
    formData.append("files", file, file.name);
  });

  try {
    const filePaste: DbFilePaste = await $fetch("/api/paste/file", {
      method: "POST",
      body: formData,
    });

    await navigateTo({ name: "paste-file-id", params: { id: filePaste.id } });
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
  <form class="flex max-w-3xl grow flex-col justify-center self-center" @submit.prevent="onSubmit">
    <h1 class="w-full">New Filepaste</h1>
    <div class="flex items-end justify-center gap-2">
      <div class="mt-8 flex grow flex-col justify-center gap-1">
        <Label for="paste-name">Paste Name</Label>
        <Input id="paste-name" v-model="pasteName" type="text" required />
      </div>
      <Button type="button" @click="onClickRandomizeName">
        <Icon name="mdi:dice-multiple" class="text-primary-foreground size-6" />
      </Button>
    </div>
    <div class="mt-4 flex flex-col items-center justify-center">
      <div class="flex w-full items-center justify-center">
        <Input id="files" type="file" multiple required @change="onChangeFileInput" class="hidden" />
        <Button @click="onClickAdd">Add File(s)</Button>
      </div>
      <div v-for="(file, index) in pasteFiles" :key="index">
        {{ file.name }} {{ file.size }} {{ file.type }}
      </div>
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
