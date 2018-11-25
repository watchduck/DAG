<template>
    <div id="app" @mouseup="handleMouseUp">
        <intro-text></intro-text>
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
    import IntroText from './components/IntroText.vue';

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
        components: { MatrixR, MatrixPQBig, Cocos, Dashboard, IntroText }
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";

    html, body, #app {
        height: 100%;
        width: 100%;
    }
</style>
