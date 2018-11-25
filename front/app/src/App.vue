<template>
    <div id="app" @mouseup="handleMouseUp">

        <div>
            <p>
                This app can be used to display and change
                <a href="https://en.wikipedia.org/wiki/Directed_acyclic_graph">directed acyclic graphs</a>.<br>
                The nodes can be dragged around to find a better representation.<br>
                Clicking fields in the
                <a href="https://en.wikipedia.org/wiki/Adjacency_matrix">adjacency matrices</a>
                will toggle edges.
            </p>
            <p>
                Red fields stand for edges, white fields for possible edges.
                Light red fields stand for edges in the
                <a href="https://en.wikipedia.org/wiki/Transitive_closure">transitive closure</a>.<br>
                They can not be added.
                When such redundant edges are removed, the field is marked with a red dot.<br>
                Gray fields are forbidden, because these edges would create a circle.
            </p>
            <p>
                The order of the first matrix does not change.
                The second matrix is in <a href="https://en.wikipedia.org/wiki/Topological_sorting">topological order</a>,
                changing with the graph.<br>
                If the graph is disconnected, this matrix is partitioned into
                <a href="https://en.wikipedia.org/wiki/Connected_component_(graph_theory)">connected components</a>
                (and these blocks are repeated below).<br>
                The components are numbered P and the nodes in them Q. The original order of nodes is called R.
            </p>
            <p>
                Some nodes have a clear <a href="https://en.wikipedia.org/wiki/Graded_poset">rank</a>.
                Others have greater freedom in their vertical positioning.<br>
                For them an interval is shown, showing on which rank layers they could be placed.
            </p>
        </div>

        <dashboard></dashboard>
        <matrix-r></matrix-r>
        <matrix-p-q-big></matrix-p-q-big>
        <cocos></cocos>

    </div>
</template>

<script>
    import MatrixR from './components/MatrixR.vue';
    import MatrixPQBig from './components/MatrixPQBig.vue';
    import Cocos from './components/Cocos.vue';
    import Dashboard from './components/Dashboard.vue';

    export default {
        computed: {
            drag() { return this.$store.state.mouse.drag },
            urlQuery() { return this.$store.getters.urlQuery }
        },
        methods: {
            handleMouseUp(e) {
                if (this.drag) {
                    this.$store.dispatch('actDrag', false);
                }
            }
        },
        watch: {
            urlQuery() {
                this.$router.push({query: this.urlQuery})
            }
        },
        components: { MatrixR, MatrixPQBig, Cocos, Dashboard }
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    html, body, #app {
        height: 100%;
        width: 100%;
    }
</style>

