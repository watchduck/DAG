<template>
    <fragment>
        <template v-for="i in cocoRankRange">
            <td @mouseover="handleMouseOver(i)" @mouseleave="handleMouseLeave"
                :class="{'in-range': inRange(i), 'rank-focused': rankFocused(i)}"></td>
        </template>
        <td class="gap"></td>
    </fragment>
</template>

<script>
    import { Fragment } from 'vue-fragment';

    import { helpers } from "../utils/helpers";

    export default {
        computed: {
            r() { return this.$store.getters.pq_to_r(this.p, this.q) },
            cocoRank() { return this.$store.getters.cocoRank(this.p) },
            cocoRankRange() { return helpers.range(this.cocoRank + 1) },

            ranks() { return this.$store.getters.nodeRanks(this.p, this.q) },
            rankFreedom() { return this.ranks.max - this.ranks.max },
            rankFocus() { return this.$store.state.rank.rankFocus },
        },
        methods: {
            handleMouseOver(rank) {
                this.$store.commit('mutRankFocus', {p: this.p, rank: rank})
            },
            handleMouseLeave() {
                this.$store.commit('mutRankUnfocus')
            },

            inRange(i) { return this.ranks.min <= i && i <= this.ranks.max },

            rankFocused(i) {
                if (this.rankFocus.p == this.p) {
                    return this.$store.state.rank.rankFocus.rank == i
                } else {
                    return false
                }
            }
        },
        components: { Fragment },
        props: ['p', 'q']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    td {
        background-color: #ccc;
        border: 1px solid white;
        padding: 0;
        width: 7px;
        &.rank-focused {
            background-color: #aaa;
        }
    }
    td.in-range {
        background-color: $rankColor;
        &.rank-focused {
            background-color: #0f540f;
        }
    }
</style>
