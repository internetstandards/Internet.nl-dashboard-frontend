<template>
  <b-alert show variant="light" class="w-100 shadow">
    {{ $t('intro')}}
    <a href="https://github.com/internetstandards/Internet.nl-dashboard/issues/new" target="_blank" rel="nofollow"><b-icon icon="github"/> GitHub</a> {{ $t('or')}}
    <a href="mailto:vraag@internet.nl" target="_blank" rel="nofollow"><b-icon icon="envelope"/> {{ $t('mail') }}</a> •
    <a href="https://github.com/internetstandards/Internet.nl-dashboard/issues" target="_blank" rel="nofollow">{{ $t('view issues') }}</a>
  </b-alert>
</template>

<script>
export default {
name: "GithubMessage"
}
</script>

<style scoped>

</style>
<i18n>
{
  "en": {
    "or": "of",
    "intro": "Is something not working right? Raise an issue via ",
    "mail": "E-Mail",
    "view issues": "Bekijk openstaande meldingen"
  },
  "nl": {
    "or": "of",
    "intro": "Werkt iets niet goed? Maak een melding via ",
    "mail": "E-Mail",
    "view issues": "Bekijk openstaande meldingen"
  }
}
</i18n>