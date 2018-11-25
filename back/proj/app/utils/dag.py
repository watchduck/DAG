import networkx as nx
from networkx.algorithms.dag import is_directed_acyclic_graph, transitive_reduction, transitive_closure

from app.utils.connected_dag import connected_dag


def dag(nodenum, initial_edges, ranks_wanted):

    if nodenum == 0:
        return {
            'cocos': [],
            'edges': {
                'present': [],
                'removed': [],
                'closure': [],
                'closing': [],
                'forbidden': []
            },
            'r_to_pq': []
        }

    if nodenum == 1:
        return {
            'cocos': [{
                'nodes': [{
                    'q': 0,
                    'r': 0,
                    'x': 0,
                    'y': 0,
                    'rank': {'min': 0, 'max': 0}
                }],
                'edges': [],
                'svg_size': {'x': 0, 'y': 0},
                'longest_path_length': 0
            }],
            'edges': {
                'present': [],
                'removed': [],
                'closure': [],
                'closing': [],
                'forbidden': []
            },
            'r_to_pq': [[0, 0]]
        }

    nodes = range(nodenum)

    graph = nx.DiGraph()
    graph.add_nodes_from(nodes)
    graph.add_edges_from(initial_edges)

    if not is_directed_acyclic_graph(graph):
        return 'Error: The graph is not a DAG.'

    # transitive reduction (remove redundant edges)
    graph = transitive_reduction(graph)
    edges = list(graph.edges)
    removed_edges = list(set(initial_edges).difference(set(edges)))

    # transitive closure
    closure_graph = transitive_closure(graph)
    closure_edges = list(closure_graph.edges)
    closing_edges = list(set(closure_edges).difference(set(edges)))

    # forbidden edges (opposite edges of those in the t. c.)
    forbidden_edges = []
    for edge in closure_edges:
        forbidden_edges.append((edge[1], edge[0]))

    # create connected components (works only from undirected graph)
    graph_undir = graph.to_undirected()
    if nx.is_connected(graph_undir):
        result = connected_dag(nodes, edges, ranks_wanted)
        cocos = [result]
    else:
        cocos = []
        nodes_by_component = nx.connected_components(graph_undir)  # generator
        for comp_nodes in nodes_by_component:
            comp_edges = []
            for graph_edge in edges:
                if graph_edge[0] in comp_nodes:
                    comp_edges.append(graph_edge)
            coco = connected_dag(comp_nodes, comp_edges, ranks_wanted)
            cocos.append(coco)

    # r --> (p, q)     (node ID in DAG to pair of coco ID and node ID in coco)
    r_to_pq = [0] * nodenum
    for p, coco in enumerate(cocos):
        for node in coco['nodes']:
            r_to_pq[node['r']] = [p, node['q']]

    return {
        'cocos': cocos,
        'edges': {
            'present': edges,              # edges of the graph
            'removed': removed_edges,      # edges removed in transitive reduction
            'closure': closure_edges,      # transitive closure (present + closing)
            'closing': closing_edges,      # t. c. without present edges
            'forbidden': forbidden_edges   # edges that would create circles
        },
        'r_to_pq': r_to_pq
    }

