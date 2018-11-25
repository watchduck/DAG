import Vue from 'vue';
import Vuex from 'vuex';

import { helpers } from "../utils/helpers";

import graph from './modules/graph';
import mouse from './modules/mouse';
import rank from './modules/rank';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        firstLoad: true,
        showNodesAs: 'r',  // 'q', 'r' or 'name'

        margin: 50,
        nodeRadius: 15,
        nodeFontSize: 17,
        nodeNameInputWidth: 30,
    },
    getters: {
        nodeFocused: (state, getters) => r => {
            let single = state.mouse.nodeFocus == r,
                pair = state.mouse.nodePairFocus.includes(r),
                rank = getters.nodeRRankFocused(r);
            return single || pair || rank
        }
    },
    mutations: {
        mutFirstLoadTrue(state) {
            state.firstLoad = true;
        },
        mutFirstLoad(state) {
            state.graph.nodeNames = helpers.names_str_to_arr(state.route.query.names);
            state.graph.edges.present = helpers.edges_str_to_arr(state.route.query.edges);
            state.firstLoad = false;
        },
        mutShowNodesAs(state, payload) {
            state.showNodesAs = payload;
        },

        mutNodeX(state, {p, q, val}) {
            state.graph.cocos[p]['nodes'][q]['x'] = val;
        },
        mutNodeY(state, {p, q, val}) {
            state.graph.cocos[p]['nodes'][q]['y'] = val;
        },

        mutNodeRadius(state, payload) {
            state.nodeRadius = payload;
        },
        mutNodeFontSize(state, payload) {
            state.nodeFontSize = payload;
        },
        mutNodeNameInputWidth(state, payload) {
            state.nodeNameInputWidth = payload;
        }
    },
    modules: { graph, mouse, rank }
});
