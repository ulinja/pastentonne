<script setup lang="ts">
const { loggedIn, user } = useUserSession();
</script>

<template>
  <div class="flex max-w-5xl grow flex-col justify-center self-center">
    <div v-if="loggedIn">
      <h1>Welcome, {{ user.name }}.</h1>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-4">
      <h1 class="text-center">Welcome To Pastentonne.</h1>
      <p class="text-center">You are not logged in. Please sign in to continue.</p>
      <a class="text-center flex items-center justify-center" href="/auth/authentik">
        <Button class="items-center justify-center flex gap-2">
          <AppLogoAuthentik class="size-4 fill-current" />
          <p>Log In with Authentik</p>
        </Button>
      </a>
    </div>
  </div>
</template>
