<template>
  <b-alert :model-value="true" variant="info" class="w-100">
    🤖 {{ $t("app.core.translated_by_ai")}}
  </b-alert>
</template>

<script>
export default {
  name: "AITranslationMessage"
}
</script>
