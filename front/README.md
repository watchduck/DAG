# Vue frontend

The frontend uses Vue 2.5.17 and Vuex 3.0.1.<br>
It sends the raw description of a DAG to the backend and presents the details it gets from there.

The sent information is the number of nodes and the array of edges (including those previously removed).<br>
The answer looks like in the following example.

This is basically [dag.watchduck.net/?edges=0-1~<!---->0-3~<!---->1-2~<!---->2-4~<!---->3-4&names=~~~~](http://dag.watchduck.net/?edges=0-1~0-3~1-2~2-4~3-4&names=~~~~).<br>
To also get (0, 2) as a removed edge, remove (1, 2), add (0, 2), and add (1, 2) again.
```
{
    'cocos': [
        {
            'nodes': [
                {'q': 0, 'r': 0, 'x': 35, 'y':   0, 'rank': {'max': 0, 'min': 0}},
                {'q': 1, 'r': 3, 'x': 72, 'y': 144, 'rank': {'max': 2, 'min': 1}},
                {'q': 2, 'r': 1, 'x':  4, 'y':  72, 'rank': {'max': 1, 'min': 1}},
                {'q': 3, 'r': 2, 'x':  0, 'y': 144, 'rank': {'max': 2, 'min': 2}},
                {'q': 4, 'r': 4, 'x': 36, 'y': 216, 'rank': {'max': 3, 'min': 3}}
            ],
            'svg_size': {'x': 72, 'y': 216},
            'edges': [(0, 2), (0, 1), (2, 3), (3, 4), (1, 4)],
            'longest_path_length': 3
        }
    ],
    'edges': {
        'present':   [(0, 1), (0, 3), (1, 2), (2, 4), (3, 4)],
        'removed':   [(0, 2)],
        'closing':   [(0, 2), (1, 4), (0, 4)],
        'closure':   [(0, 1), (0, 2), (0, 3), (0, 4), (1, 2), (1, 4), (2, 4), (3, 4)],
        'forbidden': [(1, 0), (2, 0), (3, 0), (4, 0), (2, 1), (4, 1), (4, 2), (4, 3)]
    },
    'r_to_pq': [[0, 0], [0, 2], [0, 3], [0, 1], [0, 4]]
}
```
<table>
<tr>
<td><img src="http://paste.watchduck.net/1812/dag_example_1_screen.png" width="350">
<td><img src="http://paste.watchduck.net/1812/dag_example_1.svg" width="450">
</table>

The two matrices have different orderings, which entail two different ways to refer to nodes.

**R:** The first matrix is in the order the nodes were added. (It can have entries in its lower triangle.)<br>
The node numbers in this order are called R.

**Q:** The second one is in [topological order](https://en.wikipedia.org/wiki/Topological_sorting),
which usually changes when any edge is added or removed.
(It will always be reordered so that all entries are in the upper triangle.)
The nodes in this order can be identified by a pair (P, Q), where P identifies the connected component and Q the node.
(The topological order is not unique. Even if the first ordering is topological, the second one will usually be different.)

In the app it can be set in the
[`Dashboard`](https://github.com/watchduck/DAG/blob/master/front/app/src/components/Dashboard.vue)
component if nodes are to be shown as R or Q (or their name).<br>
In the image on the left they are shown as the default R.

In the image on the right both numbers are shown for each node &mdash; R without and and Q with serifs.

This DAG in this example has only one connected component. (A second one with two can be found
[here](https://github.com/watchduck/DAG/blob/master/front/README_2.md).)

The response from the server has three parts: `cocos`, `edges` and the map `r_to_pq`.<br>
`cocos` contains the data for each connected component, including its (present) edges as pairs of Q.<br>
`edges` contains the edges of the whole DAG as pairs of P.
In addition to the present edges (red matrix fields) there are also the removed and the closing edges.
The closing edges are those in the closure that are implied by others (light red matrix fields).
Closing edges are removed on the server (red circle in the matrix).
Any edge opposite to one in the closure is forbidden (gray matrix fields), because it would create a circle.

The sending and receiving happens in the action `actDag` in
[`store/modules/graph.js`](https://github.com/watchduck/DAG/blob/master/front/app/src/store/modules/graph.js).
It is dispatched when the DAG changes (`actToggleEdge`, `actAddNode` and `actRemoveNode`) and on page load in the
[`Cocos`](https://github.com/watchduck/DAG/blob/master/front/app/src/components/Cocos.vue) component.
After the Axios call in the action is finished, the mutation `mutDag` is committed 
and updates the store variables `cocos`, `edges` and `r_to_pq`.

