<template>
    <div class="container">
        <h2 v-if="dagIsDisconnected">
            <router-link :to="{name: 'app', query: {edges: edgesUrlStr, names: namesUrlStr}}">
                P {{p}}
            </router-link>
        </h2>

        <matrix-p-q-small :p="p" class="left"></matrix-p-q-small>

        <div class="left">
            <svg :width="rectSize.x" :height="rectSize.y">

                <node v-for="q in nodeRange" :p="p" :q="q" :key="`node-${p}-${q}`"></node>

                <edge v-for="s in edgeRange" :p="p" :s="s" :key="`edge-${p}-${s}`"></edge>

            </svg>
        </div>
    </div>
</template>

<script>
    import Node from './Node.vue';
    import Edge from './Edge.vue';
    import MatrixPQSmall from './MatrixPQSmall.vue';

    import { helpers } from "../utils/helpers";

    export default {
        data() { return {
            rectOrigin: { x: null, y: null },  // left and top
            margin: this.$store.state.margin,
        }},
        computed: {
            coco() { return this.$store.state.graph.cocos[this.p] },
            nodes() { return this.coco.nodes },
            edges() { return this.coco.edges },
            nodeRange() { return [...Array(this.nodes.length).keys()] },
            edgeRange() { return [...Array(this.edges.length).keys()] },

            rectSizeRaw() { return this.coco.svg_size },  // width and height
            rectSize() { return {
                x: this.rectSizeRaw.x + 2 * this.margin,
                y: this.rectSizeRaw.y + 2 * this.margin
            }},
            nodeRadius() { return this.$store.state.nodeRadius },

            showNodesAs() { return this.$store.state.showNodesAs },

            edgesUrlStr() {
                return helpers.edges_arr_to_str(this.edges)
            },
            namesUrlStr() {
                let names = [];
                for (let i in this.nodeRange) {
                    names.push(this.$store.state.graph.nodeNames[this.nodes[i].r])
                }
                return helpers.names_arr_to_str(names)
            },
            dagIsDisconnected() { return this.$store.getters.dagIsDisconnected }
        },
        watch: {
            '$route'(to, from) {
                this.$store.commit('mutFirstLoadTrue');
                this.$store.dispatch('actDag');
            }
        },
        methods: {
            setSvgOrigin() {
                let rect = this.$el.querySelector('svg').getBoundingClientRect();
                this.$store.commit('mutSvgOrigin', {p: this.p, x: rect.left, y: rect.top});
            }
        },
        mounted() {
            this.setSvgOrigin()
        },
        updated() {
            this.setSvgOrigin()
        },
        props: ['p'],
        components: { Node, Edge, MatrixPQSmall }
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    svg {
        border: 1px solid black;
        margin: 0;
    }
    .container {
        clear: both;
        overflow: auto;
        margin-top: 10px;
    }
    .left {
        float: left;
    }
    h2 {
        margin: 0;
    }
</style>
