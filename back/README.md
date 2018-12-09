# Django backend

This backend uses Django 2.1.3 and Django REST framework 3.9.0.<br>
It receives the raw description of a DAG and returns details about it.

The backend is [back-dag.watchduck.net/dag](http://back-dag.watchduck.net/dag),
and the corresponding view is `dag_view` in
[`views.py`](https://github.com/watchduck/DAG/blob/master/back/proj/app/views.py).

There the parameters from the frontend are passed to the function 
[`dag`](https://github.com/watchduck/DAG/blob/master/back/proj/app/utils/dag.py),
which returns the details to be passed to the frontend.
There the connected components are determined. Details are then calculated for each component in
[`connected_dag`](https://github.com/watchduck/DAG/blob/master/back/proj/app/utils/connected_dag.py).

The most important part there is the creation of a graph drawing with
[`make_svg`](https://github.com/watchduck/DAG/blob/master/back/proj/app/utils/make_svg.py)<br>
and then the extraction of node coordinates with
[`extract_coordinates_from_svg`](https://github.com/watchduck/DAG/blob/master/back/proj/app/utils/extract_coordinates_from_svg.py).

If requested, the smallest and biggest possible [rank](https://en.wikipedia.org/wiki/Graded_poset) 
level of each node is calculated in
[`node_ranks`](https://github.com/watchduck/DAG/blob/master/back/proj/app/utils/node_ranks.py).<br>
(If the node has an actual rank, `min` and `max` are equal.)

The graph properties and the drawing come from [NetworkX](https://en.wikipedia.org/wiki/NetworkX).<br>
(There seems to be no direct way to get node coordinates from NetworkX, hence the creation of the SVG.)
