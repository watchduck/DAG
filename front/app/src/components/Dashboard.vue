<template>
    <div id="dashboard">
        <div>
            <span>
                <label>radius:</label>
                <input type="number" min="0" v-model="nodeRadius">
            </span>
            <span>
                <label>font size:</label>
                <input type="number" min="0" v-model="nodeFontSize">
            </span>
            <span>
                <label>name width:</label>
                <input type="number" min="0" v-model="nodeNameInputWidth">
            </span>
        </div>
        <div>
            <label>show nodes as:</label>

            <input type="radio" id="q" value="q" v-model="showNodesAs">
            <label for="q"><template v-if="dagIsDisconnected">P </template>Q</label>

            <input type="radio" id="r" value="r" v-model="showNodesAs">
            <label for="r">R</label>

            <input type="radio" id="name" value="name" v-model="showNodesAs">
            <label for="name">name</label>
        </div>
        <div>
            <span>
                <button type="button" @click="forgetRemovedNodes" :disabled="!nodesWereRemoved">forget removed nodes</button>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            nodeRadius: {
                get() { return this.$store.state.nodeRadius },
                set(val) { this.$store.commit('mutNodeRadius', Number(val)) }
            },
            nodeFontSize: {
                get() { return this.$store.state.nodeFontSize },
                set(val) { this.$store.commit('mutNodeFontSize', Number(val)) }
            },
            nodeNameInputWidth: {
                get() { return this.$store.state.nodeNameInputWidth },
                set(val) { this.$store.commit('mutNodeNameInputWidth', Number(val)) }
            },
            showNodesAs: {
                get() { return this.$store.state.showNodesAs },
                set(val) { this.$store.commit('mutShowNodesAs', val) }
            },
            nodesWereRemoved() { return this.$store.state.graph.edges.removed.length > 0 },
            dagIsDisconnected() { return this.$store.getters.dagIsDisconnected }

        },
        methods: {
            forgetRemovedNodes() { this.$store.commit('mutForgetRemovedNodes') }
        }
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    #dashboard {
        clear: both;
        display: inline-block;
    }
    input[type=radio] {
        margin-left: 20px;
    }
    #dashboard>div {
        margin-top: 10px;
    }
    input[type=number] {
        width: 40px;
    }
    span {
        padding-right: 30px;
    }
</style>
