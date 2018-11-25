import pygraphviz as pgv
import os


def make_svg(node_num, edges, name):

    s = 'digraph example { splines="line";\n'

    for node in range(node_num):
        s += '{node}[label=0];\n'.format(node=node)  # dummy label '0' to give all nodes same size
    for edge in edges:
        s += '{e0} -> {e1} [arrowhead=none];\n'.format(e0=edge[0], e1=edge[1])
    s += '}'

    g = pgv.AGraph(s)

    file_path = '{grandparent}/svg_files/{name}.svg'.format(
        grandparent=os.path.dirname(os.path.dirname(__file__)),
        name=name
    )
    g.draw(file_path, prog='dot')

