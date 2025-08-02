<script setup lang="ts"></script>

<template>
  <form class="flex max-w-3xl grow flex-col justify-center self-center">
    <h1 class="w-full">New Filepaste</h1>
    <div class="flex items-end justify-center gap-2">
      <div class="mt-8 flex grow flex-col justify-center gap-1">
        <Label for="paste-name">Paste Name</Label>
        <Input id="paste-name" type="text" />
      </div>
      <Button>
        <Icon name="mdi:dice-multiple" class="text-primary-foreground size-6" />
      </Button>
    </div>
    <div class="mt-4 flex flex-col justify-center gap-1">
      <Label for="files">Files</Label>
      <div class="relative w-full items-center">
        <Input id="files" type="file" multiple required placeholder="Select File(s)..." class="pl-10" />
        <span class="absolute inset-y-0 start-0 flex items-center justify-center px-2">
          <Icon name="mdi:file-multiple-outline" class="text-input size-6" />
        </span>
      </div>
    </div>
    <Button type="submit" class="mt-8">Save</Button>
  </form>
</template>
