<script setup lang="ts">
definePageMeta({
  middleware: ["logged-in-only"],
});

const route = useRoute();
const textPasteId = route.params.id;
if (!textPasteId)
  throw createError({
    statusCode: 400,
    statusMessage: "Must specify id.",
    fatal: true,
  });

const { data: textPaste, error } = await useLazyFetch(`/api/paste/text/${textPasteId}`, {
  transform: (data: unknown) => ({
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
  await $fetch(`/api/paste/text/${textPasteId}`, {
    method: "DELETE",
  });
  await navigateTo("/");
}
</script>

<template>
  <div class="flex w-full max-w-6xl grow flex-col items-center justify-center self-center">
    <template v-if="textPaste">
      <div class="flex w-full items-end justify-between">
        <div class="flex w-full flex-col items-center justify-center">
          <h1 class="w-full">{{ textPaste.name }}</h1>
          <p class="mt-2 w-full text-xs">Created on {{ formatDate(textPaste.createdAt) }}</p>
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
        {{ textPaste.content }}
      </code>
    </template>
  </div>
</template>
