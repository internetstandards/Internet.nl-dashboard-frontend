<style>

button {
    margin: 0 auto .5em;
    background: #fff;
    border: solid .3em #ffab4c;
    font-family: 'robotobold', arial, sans-serif;
    font-weight: bold;
    font-size: 100%;
    border-radius: 18px !important;
    padding: .2em .5em
}

button:hover, .block button:focus, .block button:active {
    background: #ffab4c
}

button:hover {
    cursor: pointer
}

button:focus {
    outline: none
}

</style>
<template>
    <b-container class="shadow p-3 mb-3 mt-2 rounded bg-white" fluid="xl">
        <b-row>
            <b-col>
                <slot>
                    Sample text.
                </slot>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
export default {}
</script>