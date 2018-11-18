import networkx as nx
from networkx.algorithms.dag import dag_longest_path_length

import hashlib

from app.utils.node_ranks import node_ranks
from app.utils.extract_coordinates_from_svg import extract_coordinates_from_svg
from app.utils.make_svg import make_svg


def connected_dag(comp_nodes, comp_edges, ranks_wanted):
    comp_nodes = sorted(comp_nodes)
    node_num = len(comp_nodes)

    edges = []
    for edge in comp_edges:
        a = comp_nodes.index(edge[0])
        b = comp_nodes.index(edge[1])
        edges.append((a, b))

    # networkx graph
    graph = nx.DiGraph()
    graph.add_nodes_from(range(node_num))
    graph.add_edges_from(edges)
    longest_path_length = dag_longest_path_length(graph)

    # SVG name
    unhashed = str(node_num) + str(edges)
    svg_name = hashlib.md5(unhashed.encode('utf-8')).hexdigest()

    # pygraphviz draw SVG
    make_svg(node_num, edges, svg_name)

    # extract coordinates from SVG
    svg_x_list, svg_y_list, svg_x_max, svg_y_max = extract_coordinates_from_svg(node_num, svg_name)

    # node ranks
    if ranks_wanted:
        (min_node_ranks, max_node_ranks) = node_ranks(graph, node_num, longest_path_length)

    # topological ordering and its inverse permutation
    topo = list(nx.topological_sort(graph))
    topo_inv = [0] * node_num
    for key, val in enumerate(topo):
        topo_inv[val] = key

    # edges named according to topological order
    edges_topo = []
    for a, b in edges:
        edges_topo.append((topo_inv[a], topo_inv[b]))

    # prepare data
    nodes_nested = [None] * node_num
    for i in range(node_num):
        q = topo_inv[i]
        node_nested = {
            'q': q,    # node index in connected component
            'r': comp_nodes[i],  # node index in DAG
            'x': svg_x_list[i],
            'y': svg_y_list[i],
        }
        if ranks_wanted:
            node_nested.update({
                'rank': {'min': min_node_ranks[i], 'max': max_node_ranks[i]}
            })
        nodes_nested[q] = node_nested

    return {
        'nodes': nodes_nested,
        'edges': edges_topo,
        'svg_size': {'x': svg_x_max, 'y': svg_y_max},
        'longest_path_length': longest_path_length
    }
