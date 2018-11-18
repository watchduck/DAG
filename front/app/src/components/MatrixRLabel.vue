<template>
    <fragment>
        <td class="button-cell"
            @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave">
            <button type="button"
                    :disabled="$store.getters.nodeNum == 1"
                    @click="removeNode(r)">
                &minus;
            </button>
        </td>
        <td @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"
            :class="{focused: focused, notImportant: showNodesAs != 'q', notVisible: !dagIsDisconnected}">
            {{p}}
        </td>
        <td @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"
            :class="{focused: focused, notImportant: showNodesAs != 'q'}">
            {{q}}
        </td>
        <td @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"
            :class="{focused: focused, notImportant: showNodesAs != 'r'}">
            {{r}}
        </td>
        <td @mouseover="handleMouseOver"
            @mouseleave="handleMouseLeave"
            class="input"
            :class="{focused: focused}">
            <input type="text" v-model="nodeName" :style="{width: inputWidth}">
        </td>
        <td class="gap"></td>
    </fragment>
</template>

<script>
    import { Fragment } from 'vue-fragment';

    export default {
        computed: {
            p() { return this.$store.getters.r_to_p(this.r) },
            q() { return this.$store.getters.r_to_q(this.r) },
            nodeName: {
                get() { return this.$store.getters.r_to_name(this.r) },
                set(val) { this.$store.commit('mutNodeName', {'r': this.r, 'val': val}) }
            },
            inputWidth() { return String(this.$store.state.nodeNameInputWidth) + 'px'  },
            showNodesAs() { return this.$store.state.showNodesAs },
            drag() { return this.$store.state.mouse.drag },
            focused() { return this.$store.getters.nodeFocused(this.r) },
            dagIsDisconnected() { return this.$store.getters.dagIsDisconnected }
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
            },
            removeNode(r) {
                this.$store.dispatch('actRemoveNode', r)
            }
        },
        components: { Fragment },
        props: ['r']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    td { background-color: $nodeColor }
    td.focused { background-color: $nodeColorFocused; }
    td.input { padding: 0 5px; }
    input { display: block; border: none; margin: 0; padding: 0; font-size: 100%; }
</style>
