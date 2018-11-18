<template>
    <table v-if="dagIsDisconnected">
        <tr>
            <th :class="{notImportant: showNodesAs != 'q'}">P</th>
            <th :class="{notImportant: showNodesAs != 'q'}">Q</th>
            <th :class="{notImportant: showNodesAs != 'r'}">R</th>
            <th>name</th>
            <th :colspan="nodeNum"></th>
        </tr>

        <template v-for="rowP in cocoRange">
            <template v-for="rowQ in cocoNodeRange(rowP)">
                <tr>

                    <matrix-p-q-label :p="rowP" :q="rowQ" :big-matrix="true"></matrix-p-q-label>

                    <template v-for="colP in cocoRange">
                        <template v-for="colQ in cocoNodeRange(colP)">

                            <matrix-p-q-cell v-if="(rowP != colP) || (rowQ != colQ)"
                                             :big-matrix="true"
                                             :row-p="rowP" :row-q="rowQ"
                                             :col-p="colP" :col-q="colQ"></matrix-p-q-cell>
                            <matrix-p-q-cell-diagonal v-else
                                                      :big-matrix="true"
                                                      :p="rowP" :q="rowQ"></matrix-p-q-cell-diagonal>
                        </template>
                    </template>

                </tr>
            </template>
        </template>
    </table>
</template>

<script>
    import MatrixPQLabel from './MatrixPQLabel.vue';
    import MatrixPQCell from './MatrixPQCell.vue';
    import MatrixPQCellDiagonal from './MatrixPQCellDiagonal.vue';

    export default {
        computed: {
            showNodesAs() { return this.$store.state.showNodesAs },

            nodeNum() { return this.$store.getters.nodeNum },
            cocoRange() { return this.$store.getters.cocoRange },

            dagIsDisconnected() { return this.$store.getters.dagIsDisconnected }
        },
        methods: {
            cocoNodeRange(p) {
                return this.$store.getters.cocoNodeRange(p)
            },
        },
        components: { MatrixPQLabel, MatrixPQCell, MatrixPQCellDiagonal },
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";
</style>
