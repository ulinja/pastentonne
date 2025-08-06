<script setup lang="ts">
const { loggedIn, user } = useUserSession();
</script>

<template>
  <div class="flex max-w-5xl grow flex-col justify-center self-center">
    <div v-if="loggedIn">
      <h1 class="text-center">Welcome, {{ user.name }}.</h1>
      <div class="mt-8 flex items-center justify-center gap-16">
        <NuxtLink to="/paste/text/new/" class="flex items-center justify-center">
          <Button>
            <Icon name="mdi:clipboard-edit" class="size-5" />
            <p class="text-center">New Text Paste</p>
          </Button>
        </NuxtLink>
        <NuxtLink to="/paste/file/new/" class="flex items-center justify-center">
          <Button>
            <Icon name="mdi:clipboard-file" class="size-5" />
            <p class="text-center">New File Paste</p>
          </Button>
        </NuxtLink>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-4">
      <h1 class="text-center">Welcome To Pastentonne.</h1>
      <p class="text-center">You are not logged in. Please sign in to continue.</p>
      <a class="flex items-center justify-center text-center" href="/auth/authentik">
        <Button class="flex items-center justify-center gap-2">
          <AppLogoAuthentik class="size-4 fill-current" />
          <p>Log In with Authentik</p>
        </Button>
      </a>
    </div>
  </div>
</template>
