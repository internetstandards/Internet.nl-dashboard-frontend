<template>
  <b-alert :model-value="true" variant="light" class="w-100">
    {{ $t("app.github.intro")}}
    <a href="https://github.com/internetstandards/Internet.nl-dashboard/issues/new" target="_blank" rel="nofollow"><i-bi-github/> GitHub</a> {{ $t("app.github.or")}}
    <a href="mailto:vraag@internet.nl" target="_blank" rel="nofollow"><i-bi-envelope/> {{ $t("app.github.mail") }}</a> •
    <a href="https://github.com/internetstandards/Internet.nl-dashboard/issues" target="_blank" rel="nofollow">{{ $t("app.github.view issues") }}</a>
  </b-alert>
</template>

<script>
export default {
  name: "GithubMessage"
}
</script>
