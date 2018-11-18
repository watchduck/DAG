import os
from xml.etree import ElementTree



"""
Example of a node in the SVG generated by pygraphviz:

<!-- 1 -->
<g id="node4" class="node"><title>1</title>
<ellipse fill="none" stroke="black" cx="27" cy="-90" rx="27" ry="18"/>
<text text-anchor="middle" x="27" y="-86.3" font-family="Times,serif" font-size="14.00">1</text>
</g>

The node number Q appears in the comment above and in the `title` element.
In this case it is also in the `text` element, but usually there is a dummy zero.
(The `id` property of the `g` tag stands in no meaningful relationship with the node ID.)
"""


def extract_coordinates_from_svg(node_num, name):

    file_name = 'app/svg_files/{name}.svg'.format(name=name)
    full_file = os.path.abspath(file_name)
    tree = ElementTree.parse(full_file)

    svg_x_list = [0] * node_num
    svg_y_list = [0] * node_num

    svg_el = tree.getroot()
    graph_el = svg_el[0]
    for g_el in graph_el.findall('{http://www.w3.org/2000/svg}g'):
        if g_el.get('class') == 'node':
            ellipse_el = g_el.find('{http://www.w3.org/2000/svg}ellipse')
            x = int(ellipse_el.get('cx'))
            y = int(ellipse_el.get('cy'))
            title_el = g_el.find('{http://www.w3.org/2000/svg}title')
            q = int(title_el.text)
            svg_x_list[q] = x
            svg_y_list[q] = y

    # avoid negative coordinates

    svg_x_min = min(svg_x_list)
    svg_y_min = min(svg_y_list)

    for i in range(node_num):
        svg_x_list[i] = svg_x_list[i] - svg_x_min
        svg_y_list[i] = svg_y_list[i] - svg_y_min

    svg_x_max = max(svg_x_list)
    svg_y_max = max(svg_y_list)

    os.system('rm ' + file_name)  # remove SVG file

    return svg_x_list, svg_y_list, svg_x_max, svg_y_max