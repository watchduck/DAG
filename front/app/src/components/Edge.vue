<template>
    <g>
        <line :x1="xEdgeTop" :y1="yEdgeTop" :x2="xEdgeBot" :y2="yEdgeBot" :class="{strong: strong}"/>
        <circle :cx="xDotTop" :cy="yDotTop" r="1.5"/>
        <circle :cx="xDotBot" :cy="yDotBot" r="1.5"/>
    </g>
</template>

<script>
    import { helpers } from "../utils/helpers";

    export default {
        computed: {
            coco() { return this.$store.state.graph.cocos[this.p] },
            edge() { return this.coco.edges[this.s] },
            topQ() { return this.edge[0] },
            botQ() { return this.edge[1] },

            nodeFocus() { return this.$store.state.mouse.nodeFocus },
            nodePairFocus() { return this.$store.state.mouse.nodePairFocus },
            strong() {
                if (this.nodeFocus != null || this.nodePairFocus != [null, null]) {
                    let topR = this.$store.getters.pq_to_r(this.p, this.topQ),
                        botR = this.$store.getters.pq_to_r(this.p, this.botQ),
                        pair = [topR, botR];
                    return pair.includes(this.nodeFocus) || helpers.arraysEqual(this.nodePairFocus, pair)
                }
            },

            margin() { return this.$store.state.margin },
            nodeRadius() { return this.$store.state.nodeRadius },

            edgeFactor() { return this.nodeRadius + 3 },
            dotFactor() { return this.nodeRadius - 2 },

            xTop() { return this.coco.nodes[this.topQ].x + this.margin },
            yTop() { return this.coco.nodes[this.topQ].y + this.margin },
            xBot() { return this.coco.nodes[this.botQ].x + this.margin },
            yBot() { return this.coco.nodes[this.botQ].y + this.margin },

            xDiff() { return this.xBot - this.xTop },
            yDiff() { return this.yBot - this.yTop },

            length() {
                let result =  Math.sqrt(Math.pow(this.xDiff, 2) + Math.pow(this.yDiff, 2));
                if (result != 0) { return result } else { return 1 }  // to avoid division by zero, should not happen anyway
            },
            tooShort() { return this.length < this.minLength },

            xNorm() { return this.xDiff / this.length },
            yNorm() { return this.yDiff / this.length },

            xEdgeTop() { return this.xTop + this.edgeFactor*this.xNorm },
            yEdgeTop() { return this.yTop + this.edgeFactor*this.yNorm },
            xEdgeBot() { return this.xBot - this.edgeFactor*this.xNorm },
            yEdgeBot() { return this.yBot - this.edgeFactor*this.yNorm },

            xDotTop() { return this.xTop + this.dotFactor*this.xNorm },
            yDotTop() { return this.yTop + this.dotFactor*this.yNorm },
            xDotBot() { return this.xBot - this.dotFactor*this.xNorm },
            yDotBot() { return this.yBot - this.dotFactor*this.yNorm },
        },
        props: ['p', 's']
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    line {
        stroke: black;
        stroke-width: 2px;
        opacity: 0.3;
    }
    line.strong {
        opacity: 1;
    }
    circle {
        fill: black;
        stroke: none;
    }
</style>
