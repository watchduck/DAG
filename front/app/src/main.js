import Vue from 'vue';
import App from './App';

import { sync } from 'vuex-router-sync';
import router from './router';
const unsync = sync(store, router);

import { store } from './store/store';
import { helpers } from "./utils/helpers";

Vue.config.productionTip = false;

Vue.mixin({
    methods: {
        arraysEqual: helpers.arraysEqual,
        findArrayInArray: helpers.findArrayInArray,
        removeArrayFromArray: helpers.removeArrayFromArray,
        range: helpers.range,
        edges_arr_to_str: helpers.edges_arr_to_str,
        edges_str_to_arr: helpers.edges_str_to_arr,
        names_arr_to_str: helpers.names_arr_to_str,
        names_str_to_arr: helpers.names_str_to_arr,
        renumber_edges: helpers.renumber_edges
    }
});

new Vue({
    el: '#app',
    store,
    router,
    sync,
    components: { App },
    template: '<App/>'
});
