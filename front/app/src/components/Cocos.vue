<template>
    <div>
        <coco v-for="p in cocoRange" :p="p" :key="p"></coco>
    </div>
</template>

<script>
    import Coco from './Coco.vue';

    export default {
        computed: {
            cocoRange() { return [...Array(this.$store.getters.cocoNum).keys()] },
        },
        components: { Coco },
        created() {
            this.$store.dispatch('actDag');
        }
    }
</script>

<style lang="scss" scoped>
    @import "~styles/style.scss";
</style>
