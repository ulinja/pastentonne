# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Fundamental Rules

The following rules must **ALWAYS** be followed:

- Commits:
  - Use conventional commits when writing commit messages, following existing patterns
  - **NEVER** ever mention a `co-authored-by` or similar aspects: in particular, never mention the tool used to create the commit message or PR
- Code format:
  - **NEVER** write blank lines that contain whitespace. Blank lines should always consist of a newline character only.
  - **ALWAYS** terminate text files with a newline
  - Inline comments should generally **not** be used to explain _what_ the code is doing, rather it should be used to
    explain _why_ the code is doing something. Explanations given through inline comments should only be given if the
    _why_ might not be fully clear from its immediate context. The only exception for when inline comments should be used
    to explain the _what_ is to explain complicated, uncommon or hard-to-read algorithms and syntactic constructs.

### Development Commands

Start the development server on `http://localhost:8000`:

```bash
docker compose -f docker/app.docker-compose.yml -f docker/app.dev.override.docker-compose.yml --env-file .env up --build --force-recreate --remove-orphans
```

To run linting or formatting:

```
# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:fix
```

### Frontend Architecture

The frontend is built with Nuxt 4.

- `frontend/app/components/`: Reusable Vue components organized by feature
- `frontend/app/pages/`: File-based routing with nested structures
- `frontend/app/stores/`: Pinia stores for state management

## Coding Conventions

**Code Style & Organization:**

- **Nuxt 4 conventional structure** with nested component organization
- **TypeScript** throughout with strict configuration
- **2-space indentation** with ESLint + Prettier formatting

**Naming Conventions:**

- **kebab-case**: file names (`auth-login.ts`, `logged-in-only.ts`)
- **PascalCase**: Vue components (`Navbar.vue`, `HeroSection.vue`)
- **camelCase**: variables, functions (`mobileMenuOpen`, `onClickLogout`)
- **SCREAMING_SNAKE_CASE**: constants

**Vue Component Structure:**

- **Script setup pattern** with Composition API (`<script setup lang="ts">`)
- **Component tag order**: `<script>`, `<template>`, `<style>`
- **Props** defined with `defineProps<Props>()` and `withDefaults()`
- **Nuxt implicit imports** preferred over explicit imports

**Styling & State:**

- **Tailwind CSS** utility classes with custom design system
- **Pinia stores** using composition API pattern

## Git Workflow

- **GitHub Flow** with feature branches
- **Conventional commits** format required
- **Rebase workflow**: Use `git rebase origin/main` to keep branches current
- **Pull requests** required for merging to main
- **Main branch** is always ready for production deployment
