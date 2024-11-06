<!-- SPDX-License-Identifier: Apache-2.0 -->
<style scoped>
.loading {
    padding: 17px;
    text-align: center;
}

.loading span {
    display: inline-block;
    font-size: 2em;
    color: dimgray;
}

.fixed-spinner {
  width: 2rem; height: 2rem;
}

</style>
<template>
    <div v-if="loading" class="fullwidth loading">
        <div class="loading">
            <b-spinner variant="info" label="Spinning" class="fixed-spinner"></b-spinner>
            &nbsp;
            <span>{{ $t("loading") }}</span>
        </div>
    </div>
</template>
<script>
// todo: fade in / only show after 0.2 seconds or so, to prevent flickering
export default {
    props: {
        loading: {
            type: Boolean,
            default: false
        },
    },
}
</script>
<i18n>
{
    "en": {
        "loading": "Loading..."
    },
    "nl": {
        "loading": "Laden..."
    }
}
</i18n>