<template>
    <fragment>
        <template v-if="showP">
            <td :class="{notImportant: showNodesAs != 'q', border: border}"
                :rowspan="colspanP">
                {{p}}
            </td>
        </template>
        <td @mouseover="handleMouseOver" @mouseleave="handleMouseLeave"
            :class="{focused: focused, notImportant: showNodesAs != 'q', border: border}">
            {{q}}
        </td>
        <td @mouseover="handleMouseOver" @mouseleave="handleMouseLeave"
            :class="{focused: focused, notImportant: showNodesAs != 'r', border: border}">
            {{r}}
        </td>
        <td @mouseover="handleMouseOver" @mouseleave="handleMouseLeave"
            :class="{focused: focused, border: border}">
            {{nodeName}}
        </td>
        <td class="gap"></td>
    </fragment>
</template>

<script>
    import { Fragment } from 'vue-fragment';

    export default {
        computed: {
            r() { return this.$store.getters.pq_to_r(this.p, this.q) },
            nodeName() { return this.$store.getters.r_to_name(this.r) },
            showNodesAs() { return this.$store.state.showNodesAs },
            showP() { return this.bigMatrix && this.q == 0 },
            colspanP() {
                if (this.showP) {
                    return this.$store.getters.cocoNodeNum(this.p)
                }
            },
            border() { return this.showP && this.p != 0 },  // beginning of coco in big matrix (except the first)
            drag() { return this.$store.state.mouse.drag },
            focused() { return this.$store.getters.nodeFocused(this.r) },
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
        components: { Fragment },
        props: ['p', 'q', 'bigMatrix']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    td { background-color: $nodeColor }
    td.focused { background-color: $nodeColorFocused; }
    td.input { padding: 0 5px; }
    input { display: block; border: none; margin: 0; padding: 0; font-size: 100%; }
    td.border { border-top: 2px solid black; }
</style>
