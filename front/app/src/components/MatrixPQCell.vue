<template>
    <td class="matcell"
        :class="{
                    present: edge_present,
                    closing: edge_closing,
                    forbidden: edge_forbidden,
                    removed: edge_removed,
                    focused: focused,
                    rowBorder: rowBorder,
                    colBorder: colBorder
                }"
        @mouseover="handleMouseOver" @mouseleave="handleMouseLeave" @click="toggleEdge"></td>
</template>

<script>
    import { helpers } from "../utils/helpers";

    export default {
        computed: {
            rowR() { return this.$store.getters.pq_to_r(this.rowP, this.rowQ) },
            colR() { return this.$store.getters.pq_to_r(this.colP, this.colQ) },

            rowBorder() { return this.bigMatrix && this.rowQ == 0 && this.rowP != 0 },
            colBorder() { return this.bigMatrix && this.colQ == 0 && this.colP != 0 },

            edge_present() { return this.$store.getters.edge_present([this.rowR, this.colR]) },
            edge_closing() { return this.$store.getters.edge_closing([this.rowR, this.colR]) },
            edge_forbidden() { return this.$store.getters.edge_forbidden([this.rowR, this.colR]) },
            edge_removed() { return this.$store.getters.edge_removed([this.rowR, this.colR]) },

            nodePairFocus() { return this.$store.state.mouse.nodePairFocus },
            focused() {
                if (!this.edge_forbidden && this.nodePairFocus != [null, null]) {
                    return helpers.arraysEqual(this.nodePairFocus, [this.rowR, this.colR])
                }
            },
        },
        methods: {
            toggleEdge() {
                if (!this.edge_closing && !this.edge_forbidden) {
                    this.$store.dispatch('actToggleEdge', [this.rowR, this.colR]);
                }
            },
            handleMouseOver(e) {
                if (!this.drag && !this.edge_forbidden) {
                    this.$store.commit('mutNodePairFocus', {topR: this.rowR, botR: this.colR})
                }
            },
            handleMouseLeave(e) {
                if (!this.drag && !this.edge_forbidden) {
                    this.$store.commit('mutNodePairUnfocus')
                }
            }
        },
        props: ['rowP', 'rowQ', 'colP', 'colQ', 'bigMatrix']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    td.rowBorder { border-top: 2px solid black; }
    td.colBorder { border-left: 2px solid black; }
</style>
