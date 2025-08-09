<script setup lang="ts">
definePageMeta({
  middleware: ["logged-in-only"],
});

const route = useRoute();
const filePasteId = route.params.id;
if (!filePasteId)
  throw createError({
    statusCode: 400,
    statusMessage: "Must specify id.",
    fatal: true,
  });

const { data: filePaste, error } = await useFetch(`/api/paste/file/${filePasteId}`, {
  transform: (data) => ({
    ...data,
    createdAt: new Date(data?.createdAt),
  }),
});

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode,
    statusMessage: error.value.statusMessage,
    fatal: true,
  });
}

async function onConfirmDelete() {
  await $fetch(`/api/paste/file/${filePasteId}`, {
    method: "DELETE",
  });
  await navigateTo("/");
}
</script>

<template>
  <div class="flex w-full max-w-6xl grow flex-col items-center justify-center self-center">
    <template v-if="filePaste">
      <div class="flex w-full items-end justify-between">
        <div class="flex w-full flex-col items-center justify-center">
          <h1 class="w-full">{{ filePaste.name }}</h1>
          <p class="mt-2 w-full text-xs">Created on {{ formatDate(filePaste.createdAt) }}</p>
        </div>
        <Dialog>
          <DialogTrigger as-child>
            <Button type="button" class="flex items-center justify-center">
              <Icon name="mdi:trash-can" class="size-4" />
              <p>Delete Paste</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle class="text-danger">Delete Paste</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this Paste?
                <span class="font-semibold"> This action cannot be undone! </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter @click="onConfirmDelete">
              <DialogClose as-child>
                <Button class="bg-danger flex items-center justify-center"> Delete Paste </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <code class="bg-foreground-100 mt-4 w-full grow overflow-x-auto rounded-lg p-4 whitespace-pre text-white">
        <p v-for="file in filePaste.files">
          {{ file.name }}
        </p>
      </code>
    </template>
  </div>
</template>
