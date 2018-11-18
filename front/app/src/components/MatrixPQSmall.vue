<template>
    <div>
        <table>
            <tr>
                <th :class="{notImportant: showNodesAs != 'q'}">Q</th>
                <th :class="{notImportant: showNodesAs != 'r'}">R</th>
                <th>name</th>
                <th></th> <!--gap-->
                <th :colspan="cocoRank+1" class="rank">
                    <template v-if="rankFocus.p == p">{{rankFocus.rank}}</template>
                </th>
            </tr>

            <tr v-for="row in cocoNodeRange">

                <matrix-p-q-label :p="p" :q="row" :big-matrix="false"></matrix-p-q-label>

                <matrix-p-q-ranks :p="p" :q="row"></matrix-p-q-ranks>

                <template v-for="col in cocoNodeRange">
                    <matrix-p-q-cell v-if="row != col" :big-matrix="false"
                                     :row-p="p" :row-q="row"
                                     :col-p="p" :col-q="col"></matrix-p-q-cell>
                    <matrix-p-q-cell-diagonal v-else :big-matrix="false"
                                              :p="p" :q="row"></matrix-p-q-cell-diagonal>
                </template>

            </tr>
        </table>
    </div>
</template>

<script>
    import MatrixPQLabel from './MatrixPQLabel.vue';
    import MatrixPQRanks from './MatrixPQRanks.vue';
    import MatrixPQCell from './MatrixPQCell.vue';
    import MatrixPQCellDiagonal from './MatrixPQCellDiagonal.vue';

    import { helpers } from "../utils/helpers";

    export default {
        computed: {
            showNodesAs() { return this.$store.state.showNodesAs },

            cocoNodeNum() { return this.$store.getters.cocoNodeNum(this.p) },
            cocoNodeRange() { return this.$store.getters.cocoNodeRange(this.p) },

            cocoRank() { return this.$store.getters.cocoRank(this.p) },
            rankFocus() { return this.$store.state.rank.rankFocus }
        },
        methods: {
            handleMouseOver(rank) {
                this.$store.commit('mutRankFocus', {p: this.p, rank: rank})

            },
            handleMouseLeave() {
                this.$store.commit('mutRankUnfocus')
            }
        },
        components: { MatrixPQLabel, MatrixPQRanks, MatrixPQCell, MatrixPQCellDiagonal },
        props: ['p']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    th.rank {
        color: $rankColor;
    }
</style>
