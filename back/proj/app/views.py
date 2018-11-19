from django.http import HttpResponse
import json

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes

from .utils.dag import dag


def home_view(request):
    html = """This is the backend.<br>
    Nothing happens here, but at <a href="/dag/">/dag/</a>.<br>
    The code is at <a href="https://github.com/watchduck/DAG">github.com/watchduck/DAG</a>."""
    return HttpResponse(html)


@api_view(['POST'])
@permission_classes((AllowAny, ))
def dag_view(request):
    nodenum = int(request.data['nodenum'])
    edges_as_lists = json.loads(request.data['edges'])
    ranks_wanted = bool(json.loads(request.data['ranks_wanted']))

    edges = []
    for edge_as_list in edges_as_lists:
        edges.append(tuple(edge_as_list))

    data = dag(nodenum, edges, ranks_wanted)

    return HttpResponse(json.dumps(data), content_type='application/json')
