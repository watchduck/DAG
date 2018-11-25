import Vue from 'vue';
import axios from 'axios';

import { helpers } from "../../utils/helpers";

export default {
    state: {
        nodeNames: [],

        // filled after axios call in `actDag`
        cocos: [],  // connected components of the DAG
        edges: {    // all edges of the DAG, not to be confused with the separate edges for each coco
            present: [],
            removed: [],
            closure: [],
            closing: [],
            forbidden: []
        },
        r_to_pq: [],
    },
    getters: {
        edge_present: state => pair => helpers.findArrayInArray(state.edges.present, pair) != -1,
        edge_closing: state => pair => helpers.findArrayInArray(state.edges.closing, pair) != -1,
        edge_forbidden: state => pair => helpers.findArrayInArray(state.edges.forbidden, pair) != -1,
        edge_removed: state => pair => helpers.findArrayInArray(state.edges.removed, pair) != -1,

        r_to_p: state => r => {
            if (r < state.r_to_pq.length) {
                return state.r_to_pq[r][0]
            }
        },
        r_to_q: state => r => {
            if (r < state.r_to_pq.length) {
                return state.r_to_pq[r][1]
            }
        },
        r_to_name: state => r => {
            if (r < state.nodeNames.length) {
                return state.nodeNames[r]
            }
        },
        pq_to_r: state => (p, q) => {
            return state.cocos[p].nodes[q].r
        },

        nodeNum(state) {
            return state.nodeNames.length
        },
        cocoNum(state) {
            return state.cocos.length
        },
        cocoNodeNum: state => p => {
            return state.cocos[p].nodes.length
        },
        nodeRange(state, getters) {
            return helpers.range(getters.nodeNum)
        },
        cocoRange(state, getters) {
            return helpers.range(getters.cocoNum)
        },
        cocoNodeRange: (state, getters) => p => {
            return helpers.range(getters.cocoNodeNum(p))
        },

        dagIsDisconnected(state) {
            return state.cocos.length > 1
        },
        urlQuery(state) {
            return {
                edges: helpers.edges_arr_to_str(state.edges.present),
                names: helpers.names_arr_to_str(state.nodeNames)
            }
        }
    },
    mutations: {
        mutDag(state, payload) {
            state.cocos = payload.cocos;
            state.edges = payload.edges;
            state.r_to_pq = payload.r_to_pq;
        },
        mutAddEdge(state, payload) {
            state.edges.present.push(payload);
        },
        mutRemoveEdge(state, payload) {
            helpers.removeArrayFromArray(state.edges.present, payload)
        },
        mutReplaceEdges(state, payload) {
            state.edges.present = payload.present;
            state.edges.removed = payload.removed;
        },
        mutAddNode(state) {
            state.nodeNames.push('');
        },
        mutForgetRemovedNodes(state) {
            state.edges.removed = [];
        },
        mutNodeName(state, {r, val}) {
            Vue.set(state.nodeNames, r, val);
        },
        mutRemoveNodeName(state, r) {
            state.nodeNames.splice(r, 1);
        },
    },
    actions: {
        actDag(context) {
            let url = 'http://back-dag.watchduck.net/dag/';
            if (context.rootState.firstLoad) {
                context.commit('mutFirstLoad')
            }
            let edgesWithRemoved = context.state.edges.present.concat(context.state.edges.removed);
            let data = {
                nodenum: JSON.stringify(context.getters.nodeNum),
                edges: JSON.stringify(edgesWithRemoved),
                ranks_wanted: JSON.stringify(true)
            };
            axios.post(url, data)
                .then(response => {
                    context.commit('mutDag', response.data)
                })
                .catch(e => {
                    console.log(e)
                });
            context.commit('mutNodePairUnfocus')  // to prevent a pair from remaining focused when the matrix field disappears under the mouse
        },
        actToggleEdge(context, payload) {
            if (helpers.findArrayInArray(context.state.edges.present, payload) != -1) {
                 context.commit('mutRemoveEdge', payload);
            } else {
                 context.commit('mutAddEdge', payload);
            }
            context.dispatch('actDag');
            if (context.rootState.mouse.nodePairFocusRetain != [null, null]) {
                let [t, b] = context.rootState.mouse.nodePairFocusRetain;
                context.commit('mutNodePairFocus', {topR: t, botR: b});
                context.commit('mutNodePairUnfocusRetain');
            }
        },
        actAddNode(context) {
            context.commit('mutAddNode');
            context.dispatch('actDag');
        },
        actRemoveNode(context, r) {
            if (context.getters.nodeNum > 1) {
                context.commit('mutRemoveNodeName', r);
                context.commit('mutReplaceEdges', {
                    present: helpers.renumber_edges(context.state.edges.present, r),
                    removed: helpers.renumber_edges(context.state.edges.removed, r),
                });
                context.dispatch('actDag');
            }
        }
    }
};
