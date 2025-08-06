// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt().append({
  ignores: ["app/components/ui/**/*"],
});
