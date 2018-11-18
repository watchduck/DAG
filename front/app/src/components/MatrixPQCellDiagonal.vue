<template>
    <td v-html="representation" class="matdiag" :class="{focused: focused, border: border}"
        @mouseover="handleMouseOver" @mouseleave="handleMouseLeave"></td>
</template>

<script>
    export default {
        computed: {
            r() { return this.$store.getters.pq_to_r(this.p, this.q) },
            nodeName() { return this.$store.getters.r_to_name(this.r) },

            nodeFocus() { return this.$store.state.mouse.nodeFocus },
            nodePairFocus() { return this.$store.state.mouse.nodePairFocus },
            focused() { return this.nodeFocus == this.r || this.nodePairFocus.includes(this.r) },

            showNodesAs() { return this.$store.state.showNodesAs },
            representation() {
                if (this.showNodesAs == 'q') {
                    return this.q
                } else if (this.showNodesAs == 'r') {
                    return this.r
                } else if (this.showNodesAs == 'name') {
                    return this.$store.getters.r_to_name(this.r)
                }
            },

            border() { return this.bigMatrix && this.q == 0 && this.p != 0 },

        },
        methods: {
            handleMouseOver(e) {
                if (!this.drag) {
                    this.$store.commit('mutNodeFocus', this.r)
                }
            },
            handleMouseLeave(e) {
                if (!this.drag) {
                    this.$store.commit('mutNodeUnfocus')
                }
            }
        },
        props: ['p', 'q', 'bigMatrix']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    td.border {
        border-top: 2px solid black;
        border-left: 2px solid black;
    }
</style>

<style lang="css">
    span.small { font-size: 80%; }
</style>
