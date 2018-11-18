import networkx as nx
from networkx.algorithms.dag import dag_to_branching


def node_ranks(graph, node_num, longest_path_length):

    # minimal node ranks, branching down

    max_dist_from_source = node_num * [0]

    branching = dag_to_branching(graph)
    branching_node_dict = branching.nodes(data='source')
    branching_source_nodes = [k for k, v in dict(branching.in_degree()).items() if v == 0]

    for branching_source_node in branching_source_nodes:
        for branching_node in branching.nodes:
            if nx.has_path(branching, branching_source_node, branching_node):
                dist = nx.shortest_path_length(branching, branching_source_node, branching_node)
                graph_node = branching_node_dict[branching_node]
                if max_dist_from_source[graph_node] < dist:
                    max_dist_from_source[graph_node] = dist

    # maximal node ranks, branching up

    max_dist_from_sink = node_num * [0]

    branching = dag_to_branching(graph.reverse())
    branching_node_dict = branching.nodes(data='source')
    branching_source_nodes = [k for k, v in dict(branching.in_degree()).items() if v == 0]

    for branching_source_node in branching_source_nodes:
        for branching_node in branching.nodes:
            if nx.has_path(branching, branching_source_node, branching_node):
                dist = nx.shortest_path_length(branching, branching_source_node, branching_node)
                graph_node = branching_node_dict[branching_node]
                if max_dist_from_sink[graph_node] < dist:
                    max_dist_from_sink[graph_node] = dist

    # return data

    min_node_ranks = max_dist_from_source
    max_node_ranks = [longest_path_length - d for d in max_dist_from_sink]

    return min_node_ranks, max_node_ranks
