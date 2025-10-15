from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from api.models import ObjectType
from api.serializers.object_type import ObjectTypeSerializer


@extend_schema(tags=['ObjectType'])
class ObjectTypeViewSet(ModelViewSet):
    serializer_class = ObjectTypeSerializer
    queryset = ObjectType.objects.all()