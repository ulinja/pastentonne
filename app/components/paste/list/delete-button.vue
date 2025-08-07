<script setup lang="ts">
interface Props {
  pasteId: string;
}
const props = defineProps<Props>();
const { pasteId } = toRefs(props);

async function onConfirmDelete() {
  await $fetch(`/api/paste/text/${pasteId.value}`, {
    method: "DELETE",
  });
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button type="button" variant="ghost" class="hover:bg-danger hover:text-white">
        <Icon name="mdi:trash-can" class="size-3" />
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
</template>
