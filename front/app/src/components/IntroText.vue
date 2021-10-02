<template>
    <div>
        <div style="position: absolute; left: 700px;">
            <a href="https://github.com/watchduck/DAG">
                <img src="../../../../.img/GitHub-Mark.png" width="40px">
            </a>
        </div>
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
            <a href="https://en.wikipedia.org/wiki/Connected_component_(graph_theory)">connected components</a>.
            These blocks are repeated below.
            <small>(<a href="http://dag.watchduck.net/?edges=1-2~3-1~4-0~5-3~5-6~6-8~6-1~7-3~7-6&names=bot~C~D~B~top~A~Y~X~Z">example</a>)</small><br>
            The components are numbered P and the nodes in them Q. The original order of nodes is called R.
        </p>
        <p>
            Some nodes have a clear <a href="https://en.wikipedia.org/wiki/Graded_poset">rank</a>.
            <small>(<a href="http://dag.watchduck.net/?edges=0-1~0-2~0-4~1-3~1-5~2-3~2-6~3-7~4-5~4-6~5-7~6-7&names=000~001~010~011~100~101~110~111">example</a>)</small>
            Others have greater freedom in their vertical positioning.
            <small>(<a href="http://dag.watchduck.net/?edges=1-0~1-6~2-5~3-1~3-2~4-3~5-0~7-6&names=leaf~~~~root~~leaf~root">example</a>)</small><br>
            For them an interval is shown, showing on which rank layers they could be placed.
        </p>
    </div>
</template>
