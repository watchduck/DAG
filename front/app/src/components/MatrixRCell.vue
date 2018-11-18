<template>
    <td class="matcell"
        :class="{
                    present: edge_present,
                    closing: edge_closing,
                    forbidden: edge_forbidden,
                    removed: edge_removed,
                    focused: focused
                }"
        @mouseover="handleMouseOver" @mouseleave="handleMouseLeave" @click="toggleEdge"></td>
</template>

<script>
    import { helpers } from "../utils/helpers";

    export default {
        computed: {
            rowP() { return this.$store.getters.r_to_p(this.rowR) },
            rowQ() { return this.$store.getters.r_to_q(this.rowR) },
            colP() { return this.$store.getters.r_to_p(this.colR) },
            colQ() { return this.$store.getters.r_to_q(this.colR) },

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
                    this.$store.commit('mutNodePairFocusRetain', {topR: this.rowR, botR: this.colR});
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
        props: ['rowR', 'colR']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";
</style>
