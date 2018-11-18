<template>
    <td v-html="representation" class="matdiag" :class="{focused: focused}"
        @mouseover="handleMouseOver" @mouseleave="handleMouseLeave"></td>
</template>

<script>
    export default {
        computed: {
            p() { return this.$store.getters.r_to_p(this.r) },
            q() { return this.$store.getters.r_to_q(this.r) },

            nodeFocus() { return this.$store.state.mouse.nodeFocus },
            nodePairFocus() { return this.$store.state.mouse.nodePairFocus },
            focused() { return this.nodeFocus == this.r || this.nodePairFocus.includes(this.r) },

            dagIsDisconnected() { return this.$store.getters.dagIsDisconnected },

            showNodesAs() { return this.$store.state.showNodesAs },
            representation() {
                if (this.showNodesAs == 'q') {
                    if (this.dagIsDisconnected) {
                        let p = this.$store.getters.r_to_p(this.r),
                            q = this.$store.getters.r_to_q(this.r);
                        return `<span class="small">${p}</span> ${q}`
                    } else {
                        return this.$store.getters.r_to_q(this.r)
                    }

                } else if (this.showNodesAs == 'r') {
                    return this.r
                } else if (this.showNodesAs == 'name') {
                    return this.$store.getters.r_to_name(this.r)
                }
            }
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
        props: ['r']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";
</style>

<style lang="css">
    span.small { font-size: 80%; }
</style>
