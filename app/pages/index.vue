<script setup lang="ts">
const { loggedIn, user, session, fetch, clear } = useUserSession();
</script>

<template>
  <div v-if="loggedIn">
    <h1>Welcome {{ user.name }}!</h1>
    <p>Logged in since {{ session.loggedInAt }}</p>
    <p>Logged in as {{ user.username }}</p>
    <p>Logged in as {{ user.email }}</p>
    <p>Logged in as {{ user.id }}</p>
    <code>
      {{ session }}
    </code>
    <Button @click="clear">Logout</Button>
  </div>
  <div v-else>
    <h1>Not logged in</h1>
    <a href="/auth/authentik">
      <Button>Login with Authentik</Button>
    </a>
  </div>
</template>
