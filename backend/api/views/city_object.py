from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from api.models import CityObject
from api.serializers.city_object import CityObjectSerializer, CityObjectListSerializer


@extend_schema(tags=['CityObject'])
class CityObjectViewSet(ModelViewSet):
    queryset = CityObject.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return CityObjectListSerializer
        return CityObjectSerializer