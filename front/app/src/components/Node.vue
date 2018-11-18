<template>
    <g class="node"
       @mousedown="handleMouseDown"
       @mouseover="handleMouseOver"
       @mouseleave="handleMouseLeave"
    >

        <circle :cx="x" :cy="y" :r="nodeRadius" :class="{focused: focused,}"/>

        <text :x="x" :y="y" class="nodenum" :style="{'font-size': nodeFontSize}">{{nodeRepr}}</text>

        <template v-if="rankFreedom > 0">
            <text :x="x+nodeRadius+8" :y="y-6" class="rank">{{ranks.min}}</text>
            <text :x="x+nodeRadius+8" :y="y+6" class="rank">{{ranks.max}}</text>
        </template>
        <template v-else>
            <text :x="x+nodeRadius+8" :y="y" class="rank">{{ranks.max}}</text>
        </template>
    </g>
</template>

<script>
    export default {
        computed: {
            coco() { return this.$store.state.graph.cocos[this.p] },
            node() { return this.coco.nodes[this.q] },
            r() { return this.node.r },

            x() { return this.node.x + this.margin },
            y() { return this.node.y + this.margin },

            showNodesAs() { return this.$store.state.showNodesAs },
            nodeRepr() {
                if (this.showNodesAs == 'q') {
                    return this.q
                } else if (this.showNodesAs == 'r') {
                    return this.r
                } else if (this.showNodesAs == 'name') {
                    return this.$store.getters.r_to_name(this.r)
                }
            },

            margin() { return this.$store.state.margin },
            nodeRadius() { return this.$store.state.nodeRadius },
            nodeFontSize() { return this.$store.state.nodeFontSize },

            drag() { return this.$store.state.mouse.drag },
            nodeFocus() { return this.$store.state.mouse.nodeFocus },
            nodePairFocus() { return this.$store.state.mouse.nodePairFocus },

            ranks() { return this.$store.getters.nodeRanks(this.p, this.q) },
            rankFreedom() { return this.ranks.max - this.ranks.min },

            focused() { return this.$store.getters.nodeFocused(this.r) },
        },
        methods: {
            handleMouseDown(e) {
                document.addEventListener("mousemove", this.handleMouseMove);
                this.$store.dispatch('actDrag', true);
                this.$store.commit('mutNodeFocus', this.r)
            },
            handleMouseMove(e) {
                this.$store.dispatch('actMouse', {p: this.p, q: this.q, x: e.pageX, y: e.pageY})
            },
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
        watch: {
            drag(val) {
                if (!val) {  // stop dragging the node when `drag` becomes false
                    document.removeEventListener("mousemove", this.handleMouseMove);
                }
            },
        },
        props: ['p', 'q']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    circle {
        fill: $nodeColor;
        stroke: #333;
        stroke-width: 1px;
    }
    circle.focused {
        fill: $nodeColorFocused;
    }

    text {
        text-anchor: middle;
        dominant-baseline: central;  // 'alignment-baseline' does not work in FF
        @extend .noselect;
    }
    text.rank {
        fill: $rankColor;
        font-size: 70%;
        font-family: Arial, Helvetica;
    }

    g.node {
        cursor: pointer;
    }
</style>
