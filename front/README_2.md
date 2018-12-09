This is a second example of a response from the server. Here the DAG has two connected components (`cocos`).

This is basically [http://dag.watchduck.net/?edges=0-2~<!---->2-4~<!---->3-1&names=~~~~](http://dag.watchduck.net/?edges=0-2~2-4~3-1&names=~~~~).<br>
To also get (0, 4) as a removed edge, remove (0, 2) or (2, 4), add (0, 4), and add the previously removed edge again.

```
{
    'cocos': [
        {
            'nodes': [
                {'q': 0, 'r': 0, 'x': 0, 'y':   0, 'rank': {'max': 0, 'min': 0}},
                {'q': 1, 'r': 2, 'x': 0, 'y':  72, 'rank': {'max': 1, 'min': 1}},
                {'q': 2, 'r': 4, 'x': 0, 'y': 144, 'rank': {'max': 2, 'min': 2}}
            ],
            'svg_size': {'x': 0, 'y': 144},
            'edges': [(0, 1), (1, 2)],
            'longest_path_length': 2
        },
        {
            'nodes': [
                {'q': 0, 'r': 3, 'x': 0, 'y':  0, 'rank': {'max': 0, 'min': 0}},
                {'q': 1, 'r': 1, 'x': 0, 'y': 72, 'rank': {'max': 1, 'min': 1}}
            ],
            'svg_size': {'x': 0, 'y': 72},
            'edges': [(0, 1)],
            'longest_path_length': 1
        }
    ],
    'edges': {
        'present':   [(0, 2), (2, 4), (3, 1)],
        'removed':   [(0, 4)],
        'closing':   [(0, 4)],
        'closure':   [(0, 2), (0, 4), (2, 4), (3, 1)],
        'forbidden': [(2, 0), (4, 0), (4, 2), (1, 3)],
    },
    'r_to_pq': [[0, 0], [1, 1], [0, 1], [1, 0], [0, 2]]
}
```

<img src="http://paste.watchduck.net/1812/dag_example_2_screen.png">
