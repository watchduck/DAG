<template>
    <div>
        <table>
            <tr>
                <th></th>
                <th :class="{notImportant: showNodesAs != 'q', notVisible: !dagIsDisconnected}">P</th>
                <th :class="{notImportant: showNodesAs != 'q'}">Q</th>
                <th :class="{notImportant: showNodesAs != 'r'}">R</th>
                <th>name</th>
                <th :colspan="nodeNum"></th>
            </tr>

            <tr v-for="row in nodeRange">

                <matrix-r-label :r="row"></matrix-r-label>

                <template v-for="col in nodeRange">
                    <matrix-r-cell v-if="row != col" :row-r="row" :col-r="col"></matrix-r-cell>
                    <matrix-r-cell-diagonal v-else :r="row"></matrix-r-cell-diagonal>
                </template>
            </tr>
            <tr>
                <td class="button-cell">
                    <button type="button" @click="addNode">+</button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
    import MatrixRLabel from './MatrixRLabel.vue';
    import MatrixRCell from './MatrixRCell.vue';
    import MatrixRCellDiagonal from './MatrixRCellDiagonal.vue';

    export default {
        computed: {
            showNodesAs() { return this.$store.state.showNodesAs },

            nodeNum() { return this.$store.getters.nodeNum },
            nodeRange() { return this.$store.getters.nodeRange },

            dagIsDisconnected() { return this.$store.getters.dagIsDisconnected },
        },
        methods: {
            addNode() { this.$store.dispatch('actAddNode') }
        },
        components: { MatrixRLabel, MatrixRCell, MatrixRCellDiagonal }
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    td.button-cell { padding-top: 4px; }
</style>
