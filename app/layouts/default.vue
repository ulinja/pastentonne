<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar />
    <main class="flex w-full grow flex-col items-center">
      <div class="flex w-full grow flex-col px-6 py-6 lg:px-16 lg:py-16">
        <slot />
      </div>
    </main>
    <AppFooter />
  </div>
</template>
