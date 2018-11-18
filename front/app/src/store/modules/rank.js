export default {
    state: {
        rankFocus: {p: null, rank: null}
    },
    getters: {
        cocoRank: (state, getters, rootState) => p => rootState.graph.cocos[p].longest_path_length,
        nodeRanks: (state, getters, rootState) => (p, q) => rootState.graph.cocos[p].nodes[q].rank,

        nodePQRankFocused: (state, getters) => (p, q) => {
            if (state.rankFocus.p == p) {
                let minRank = getters.nodeRanks(p, q).min,
                    maxRank = getters.nodeRanks(p, q).max,
                    rank = state.rankFocus.rank;
                return minRank <= rank && rank <= maxRank
            } else {
                return false
            }
        },
        nodeRRankFocused: (state, getters, rootState) => (r) => {
            let r_to_pq = rootState.graph.r_to_pq;
            if (r_to_pq.length > r) {
                let [p, q] = r_to_pq[r];
                return getters.nodePQRankFocused(p, q)
            } else {
                return false
            }
        }
    },
    mutations: {
        mutRankFocus(state, payload) {
            state.rankFocus = payload;
        },
        mutRankUnfocus(state) {
            state.rankFocus = {p: null, rank: null};
        }
    }
};
