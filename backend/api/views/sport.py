from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from api.models import Sport
from api.serializers.sport import SportSerializer


@extend_schema(tags=['Sport'])
class SportViewSet(ModelViewSet):
    serializer_class = SportSerializer
    queryset = Sport.objects.all()