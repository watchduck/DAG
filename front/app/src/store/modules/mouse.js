import Vue from 'vue';

export default {
    state: {
        nodeFocus: null,
        nodePairFocus: [null, null],
        nodePairFocusRetain: [null, null],
        drag: false,
        svgOrigins: []
    },
    getters: {
        minNodeCenterDist(state, getters, rootState) {
            return 2 * rootState.nodeRadius + 8
        },
    },
    mutations: {
        mutNodeFocus(state, r) {
            state.nodeFocus = r
        },
        mutNodeUnfocus(state) {
            state.nodeFocus = null
        },

        mutNodePairFocus(state, {topR, botR}) {
            state.nodePairFocus = [topR, botR]
        },
        mutNodePairUnfocus(state) {
            state.nodePairFocus = [null, null]
        },

        mutNodePairFocusRetain(state, {topR, botR}) {
            state.nodePairFocusRetain = [topR, botR]
        },
        mutNodePairUnfocusRetain(state) {
            state.nodePairFocusRetain = [null, null]
        },

        mutDrag(state, val) {
            state.drag = val;
        },
        mutSvgOrigin(state, {p, x, y}) {
            Vue.set(
                state.svgOrigins,
                p,
                {x: x, y: y}
            )
        }
    },
    actions: {
        actDrag(context, val) {
            context.commit('mutDrag', val);
            // if dragging is ended by mouseup (possibly outside of SVG), focus should end too
            if (!val) {
                context.commit('mutNodeUnfocus')
            }
        },
        actMouse(context, {p, q, x, y}) {
            let coco = context.rootState.graph.cocos[p],
                nodes = coco['nodes'],
                edges = coco['edges'],
                size = coco['svg_size'],
                node = nodes[q],
                nodeRange = [...Array(nodes.length).keys()];

            let origin = context.state.svgOrigins[p],
                radius = context.rootState.nodeRadius,
                margin = context.rootState.margin,
                minNodeCenterDist = context.getters.minNodeCenterDist;

            let nodeNeighbors = [];
            for (let foo in nodeRange) {
                nodeNeighbors.push([[], []])  // preallocate
            }
            for (let edge of edges) {
                let topQ = edge[0],
                    botQ = edge[1];
                nodeNeighbors[topQ][1].push(botQ);
                nodeNeighbors[botQ][0].push(topQ);
            }

            let xOld = node.x + margin,
                yOld = node.y + margin;

            let xMove = x - (origin.x + xOld),
                yMove = y - (origin.y + yOld);

            let xNew = xOld + xMove,
                yNew = yOld + yMove;

            let xCondition = xNew > radius && xNew < size.x + 2*margin - radius,
                yCondition = yNew > radius && yNew < size.y + 2*margin - radius;

            let angleAllowed = true,
                topOverBottom = true,
                neighborsBothDir = nodeNeighbors[q];
            for (let [downInt, neighborsOneDir] of neighborsBothDir.entries()) {
                for (let neighbor of neighborsOneDir) {
                    let xNeighbor = nodes[neighbor].x + margin,
                        yNeighbor = nodes[neighbor].y + margin,
                        xTop = 0, yTop = 0,
                        xBot = 0, yBot = 0;
                    if (downInt) {  // neighbor is bottom
                        xTop = xNew; yTop = yNew;
                        xBot = xNeighbor; yBot = yNeighbor;
                    } else {  // neighbor is top
                        xTop = xNeighbor; yTop = yNeighbor;
                        xBot = xNew; yBot = yNew;
                    }
                    let xDiff = xBot - xTop, yDiff = yBot - yTop;
                    let angleNew = Math.atan(xDiff / yDiff);
                    if (Math.abs(angleNew) > 1.35) {  // if flatter than 13°
                        angleAllowed = false;
                    }
                    if (yTop >= yBot) {  // if top below bot (y-axis pointing downwards)
                        topOverBottom = false;
                    }
                }
            }

            let notOnOtherNode = true;  // not too close to any other node
            for (let otherNode of nodes) {
                if (otherNode.q != q) {
                    let xDiff = xNew - (otherNode.x + margin),
                        yDiff = yNew - (otherNode.y + margin),
                        dist = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
                    if (dist < minNodeCenterDist) {
                        notOnOtherNode = false;
                    }

                }
            }

            if (angleAllowed && topOverBottom && notOnOtherNode) {
                if (xCondition) {
                    context.commit('mutNodeX', {p: p, q: q, val: xNew - margin})
                }
                if (yCondition) {
                    context.commit('mutNodeY', {p: p, q: q, val: yNew - margin})
                }
            }
        },
    }
};
