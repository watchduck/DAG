# Vue frontend

The frontend uses Vue 2.5.17 and Vuex 3.0.1.<br>
It sends the raw description of a DAG to the backend and presents the details it gets from there.

## Graph

The sent information is the number of nodes and the array of edges (including those previously removed).<br>
The answer looks like in the following example.

This is basically
[dag.watchduck.net/?edges=0-1~<!---->0-3~<!---->1-2~<!---->2-4~<!---->3-4&names=~~~~](http://dag.watchduck.net/?edges=0-1~0-3~1-2~2-4~3-4&names=~~~~).
<br>To also get (0, 2) as a removed edge, remove (1, 2), add (0, 2), and add (1, 2) again.
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
<td><img src="../.img/dag_example_1_screen.png" width="350">
<td><img src="../.img/dag_example_1.svg" width="450">
</table>

The two matrices have different orderings, which entail two different ways to refer to nodes.

**R:** The first matrix is in the order the nodes were added. (It can have entries in its lower triangle.)<br>
The node numbers in this order are called R.

**Q:** The second one is in [topological order](https://en.wikipedia.org/wiki/Topological_sorting),
which usually changes when any edge is added or removed.
(It will always be reordered so that all entries are in the upper triangle.)
In addition to the unique number R, nodes can also be identified by a pair (P, Q), where P identifies the connected component and Q the node in this order.
(The topological order is not unique. Even if the first ordering is topological, the second one will usually be different.)

In the app it can be set in the
[`Dashboard`](app/src/components/Dashboard.vue)
component if nodes are to be shown as R or Q (or their name).<br>
In the image on the left they are shown as the default R.

In the image on the right both numbers are shown for each node &mdash; R without and and Q with serifs.

The DAG in this example has only one connected component. (A second one with two can be found
[here](README_2.md).)

The response from the server has three parts: `cocos`, `edges` and the map `r_to_pq`.<br>
`cocos` contains the data for each connected component, including its (present) edges as pairs of Q.<br>
`edges` contains the edges of the whole DAG as pairs of P.
In addition to the present edges (red matrix fields) there are also the removed and the closing edges.
The closing edges are those in the closure that are implied by others (light red matrix fields).
If edges passed to the server turn out to be closing, they are removed (red circle in the matrix).
Any edge opposite to one in the closure is forbidden (gray matrix fields), because it would create a circle.

The sending and receiving happens in the action `actDag` in
[`store/modules/graph.js`](app/src/store/modules/graph.js).
It is dispatched when the DAG changes (actions `actToggleEdge`, `actAddNode` and `actRemoveNode` right below) 
and on page load in the
[`Cocos`](app/src/components/Cocos.vue) component.
After the Axios call in the action is finished, the mutation `mutDag` is committed 
and updates the store variables `cocos`, `edges` and `r_to_pq`.

## Drag

A key functionality of the app is that nodes can be dragged with the mouse.<br>
The code for that is in the component 
[`Node`](app/src/components/Node.vue)
and in [`store/modules/mouse.js`](app/src/store/modules/mouse.js).

Clicking on a node triggers the method `handleMouseDown`, 
which adds the event listener `handleMouseMove`, and (through `actDrag`) sets the store variable `drag` to true.

This listener will dispatch the action `actMouse` on every mouse move, and pass to it the node (as P and Q) and its new position.
There it will be checked if the new position is legal. If it is, the coordinates of the node will be changed by
commiting the mutations `mutNodeX` and `mutNodeY` (found in 
[`store/store.js`](app/src/store/store.js)).

The mouse can leave the drawing, but the node can not.
Therefore the release of the mouse has to be detected outside of the drawing.
This `handleMouseUp` method is attached to the root `div` in the
[`App`](app/src/App.vue) component.
It sets `drag` to false, and this change is detected by the watcher in `Node`,
where the listener `handleMouseMove` is then removed.

## Focus

There are different ways to focus single or many nodes by hovering over elements.
Focusing a node will highlight all elements associated with it, i.e. its circle in the graph
([`Node`](app/src/components/Node.vue)),
its row in the tables
([`MatrixRLabel`](app/src/components/MatrixRLabel.vue),
[`MatrixPQLabel`](app/src/components/MatrixPQLabel.vue)),
and its diagonal field in the matrices
([`MatrixRCellDiagonal`](app/src/components/MatrixRCellDiagonal.vue),
[`MatrixPQCellDiagonal`](app/src/components/MatrixPQCellDiagonal.vue)).

In these components associated with single nodes, mouseover will commit `mutNodeFocus` (with the node passed to it as R), and mouseleave will commit `mutNodeUnfocus`.
These mutations will change the store variable `nodeFocus` to R or to null respectively.

In the matrix cells
([`MatrixRCell`](app/src/components/MatrixRCell.vue),
[`MatrixPQCell`](app/src/components/MatrixPQCell.vue))
the equivalent mutations are `mutNodePairFocus` (with row and column passed to it as R) and `mutNodePairUnfocus`.
The changed variable is `nodePairFocus`.<br>
In the upper matrix the positions of the cells do not change. Therefore it is more intuitive to have the field still
focused after clicking on it. To achieve this, `toggleEdge` in
[`MatrixRCell`](app/src/components/MatrixRCell.vue)
also sets `nodePairFocusRetain` to the current row and column.
`actToggleEdge` in
[`store/modules/graph.js`](app/src/store/modules/graph.js)
will then refocus the cell after adding or removing the edge.

Until here these mutations and variables are all in 
[`store/modules/mouse.js`](app/src/store/modules/mouse.js)

Hovering over a column in the green rank matrix will highlight all nodes with that rank. In 
[`MatrixPQRanks`](app/src/components/MatrixPQRanks.vue)
the mutations are `mutRankFocus` (with the component index P and the rank passed to it) and `mutRankUnfocus`,
which change the variable `rankFocus`. These are in
[`store/modules/rank.js`](app/src/store/modules/rank.js).

The getter `nodeFocused` in
[`store/store.js`](app/src/store/store.js)
checks if a node is focused in any of these three ways.<br>
It is used in `Node` and the tables `MatrixRLabel` and `MatrixPQLabel`.

In the component [`Edge`](app/src/components/Edge.vue)
the computed property `strong` will highlight the edge, if one of its two nodes is focused (equal to `nodeFocus`) or if the mouse hovers over the cooresponding red cell in a matrix (pair is equal to `nodePairFocus`).

## Components

[`App`](app/src/App.vue)

&emsp;[`Dashboard`](app/src/components/Dashboard.vue)

&emsp;[`MatrixR`](app/src/components/MatrixR.vue)<br>
&emsp;&emsp;[`MatrixRLabel`](app/src/components/MatrixRLabel.vue)<br>
&emsp;&emsp;[`MatrixRCell`](app/src/components/MatrixRCell.vue)<br>
&emsp;&emsp;[`MatrixRCellDiagonal`](app/src/components/MatrixRCellDiagonal.vue)<br>

&emsp;[`MatrixPQBig`](app/src/components/MatrixPQBig.vue)
(hidden if DAG has only one connected component)<br>
&emsp;&emsp;[`MatrixPQLabel`](app/src/components/MatrixPQLabel.vue)<br>
&emsp;&emsp;[`MatrixPQCell`](app/src/components/MatrixPQCell.vue)<br>
&emsp;&emsp;[`MatrixPQCellDiagonal`](app/src/components/MatrixPQCellDiagonal.vue)<br>

&emsp;[`Cocos`](app/src/components/Cocos.vue) (connected components)<br>
&emsp;&emsp;[`Coco`](app/src/components/Coco.vue)
(heading hidden if only one)<br>
&emsp;&emsp;&emsp;[`Node`](app/src/components/Node.vue)<br>
&emsp;&emsp;&emsp;[`Edge`](app/src/components/Edge.vue)<br>
&emsp;&emsp;&emsp;[`MatrixPQSmall`](app/src/components/MatrixPQSmall.vue)<br>
&emsp;&emsp;&emsp;&emsp;[`MatrixPQLabel`](app/src/components/MatrixPQLabel.vue)<br>
&emsp;&emsp;&emsp;&emsp;[`MatrixPQRanks`](app/src/components/MatrixPQRanks.vue)<br>
&emsp;&emsp;&emsp;&emsp;[`MatrixPQCell`](app/src/components/MatrixPQCell.vue)<br>
&emsp;&emsp;&emsp;&emsp;[`MatrixPQCellDiagonal`](app/src/components/MatrixPQCellDiagonal.vue)

The labels and cells of the PQ matrices
([`MatrixPQLabel`](app/src/components/MatrixPQLabel.vue),
[`MatrixPQCell`](app/src/components/MatrixPQCell.vue),
[`MatrixPQCellDiagonal`](app/src/components/MatrixPQCellDiagonal.vue))
are used both in
[`MatrixPQBig`](app/src/components/MatrixPQBig.vue) and
[`MatrixPQSmall`](app/src/components/MatrixPQSmall.vue).
(So this is not a tree, but itself a DAG.)

## Misc.

The borders between the matrix cells are hidden in Firefox, thanks to an
[ancient bug](https://bugzilla.mozilla.org/show_bug.cgi?id=688556).
(Compare [this fiddle](https://jsfiddle.net/watchduck/du9ne1jz).) <br>
In Chrome it looks like it should.

In the site currently online the [devtools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
are allowed. Components and store can be accessed.

