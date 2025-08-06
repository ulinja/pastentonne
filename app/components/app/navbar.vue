<script setup lang="ts">
const { loggedIn, user, clear } = useUserSession();

const menuIsOpen = ref<boolean>(false);
const screenIsSmall = ref<boolean>(false);

function checkIsScreenIsSmall(): boolean {
  if (typeof window !== "undefined") {
    const breakpointValue = getComputedStyle(document.documentElement).getPropertyValue("--breakpoint-md").trim();
    return window.matchMedia(`(max-width: ${breakpointValue})`).matches;
  }
  return true;
}

function onScreenResize(): void {
  const _smol = checkIsScreenIsSmall();
  screenIsSmall.value = _smol;
  if (!_smol && menuIsOpen.value) menuIsOpen.value = false;
}

onMounted(() => {
  onScreenResize();
  window.addEventListener("resize", onScreenResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", onScreenResize);
});

function onClickMenuButton(): void {
  menuIsOpen.value = !menuIsOpen.value;
}

async function onClickLogOut(): Promise<void> {
  await clear();
  await navigateTo("/", { external: true });
}
</script>

<template>
  <header
    class="from-background-400 via-background-600 to-background-400 m-2 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-b px-2 py-4 text-lg md:flex-row md:px-8"
  >
    <nav class="flex w-full items-center justify-between gap-x-2 md:w-auto">
      <NuxtLink to="/" class="flex items-center justify-center gap-x-2 md:gap-x-4">
        <AppLogoPastentonne class="ms-4 w-8 md:ms-0 md:w-10" />
        <h1 class="font-decor text-primary-800/75 text-2xl md:text-4xl">PastenTonne</h1>
      </NuxtLink>
      <Button variant="ghost" @click="onClickMenuButton" class="flex items-center justify-center md:hidden">
        <Icon v-if="menuIsOpen" name="mdi:window-close" class="size-8" />
        <Icon v-else name="mdi:hamburger" class="size-8" />
      </Button>
    </nav>
    <div v-if="!screenIsSmall || menuIsOpen" class="flex items-center justify-center">
      <div v-if="loggedIn" class="flex items-center justify-center gap-4">
        <p class="text-center text-sm font-light md:text-start md:text-base">Logged in as {{ user.email }}</p>
        <Button @click="onClickLogOut" variant="outline"> Sign Out </Button>
      </div>
      <div v-else class="flex items-center justify-center gap-4">
        <a href="/auth/authentik" class="flex items-center justify-center">
          <Button class="flex items-center justify-center gap-2">
            <AppLogoAuthentik class="size-4 fill-current" />
            <p>Log In with Authentik</p>
          </Button>
        </a>
      </div>
    </div>
  </header>
</template>
