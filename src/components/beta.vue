<template>
    <div>
        <h1>This is a beta to test BootstrapVue components.</h1>

        <div class="block fullwidth do-not-print">
            <h2>Spinner</h2>
            <div class="text-center">
                <b-spinner label="Spinning"></b-spinner>
                <b-spinner type="grow" label="Spinning"></b-spinner>
                <b-spinner variant="primary" label="Spinning"></b-spinner>
                <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
                <b-spinner variant="info" label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                <b-spinner variant="info" type="grow" label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
            </div>
        </div>
        <loading :loading="true"></loading>

        <div class="block fullwidth do-not-print">
            <h2>Modal</h2>
              <b-button v-b-modal="'my-modal'">Launch demo modal</b-button>
              <b-modal id="my-modal">Hello From My Modal!</b-modal>

            <!-- Button trigger modal -->
            <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                Launch demo modal
            </button>

            <!-- Modal -->
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
                 aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="block fullwidth do-not-print">
            <h2>Collapse</h2>
            <b-button v-b-toggle.collapse-2 class="m-1">Toggle Collapse</b-button>
            <b-collapse id="collapse-2">
                <b-card>I am collapsible content!</b-card>
            </b-collapse>
        </div>

        <div class="block fullwidth do-not-print">
            <h2>Progress</h2>
            <b-progress :value="value" :max="max" show-progress animated></b-progress>
            <b-progress class="mt-2" :max="max" show-value>
                <b-progress-bar :value="value * (6 / 10)" variant="success"></b-progress-bar>
                <b-progress-bar :value="value * (2.5 / 10)" variant="warning"></b-progress-bar>
                <b-progress-bar :value="value * (1.5 / 10)" variant="danger"></b-progress-bar>
            </b-progress>

            <b-button class="mt-3" @click="randomValue">Click me</b-button>
        </div>

        <div class="block fullwidth do-not-print">
            <h2>Toast</h2>
            <b-button class="mb-2" variant="primary" @click="$bvToast.show('example-toast')">
                Show toast
            </b-button>
            <b-toast id="example-toast" title="BootstrapVue" static no-auto-hide>
                Hello, world! This is a toast message.
            </b-toast>
        </div>


        <div class="block fullwidth do-not-print">
            <h2>Tabs</h2>
            <b-card no-body>
                <b-tabs card>
                    <b-tab title="Tab 1" active>
                        <b-card-text>Tab contents 1</b-card-text>
                    </b-tab>
                    <b-tab title="Tab 2">
                        <b-card-text>Tab contents 2</b-card-text>
                    </b-tab>
                </b-tabs>
            </b-card>
        </div>


        <div class="block fullwidth do-not-print">
            <h2>Tabs</h2>

            <b-tabs>
                <b-tab title="Tab 1" active>
                    <b-card-text>Tab contents 1</b-card-text>
                </b-tab>
                <b-tab title="Tab 2">
                    Tab contents 2
                </b-tab>
            </b-tabs>

        </div>

    </div>
</template>
<script>
export default {

    data() {
        return {
            value: 45,
            max: 100
        }
    },
    methods: {
        randomValue() {
            this.value = Math.random() * this.max
        }
    }

}
</script>
