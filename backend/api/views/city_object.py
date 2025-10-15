from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from api.models import CityObject
from api.serializers.city_object import CityObjectSerializer


@extend_schema(tags=['CityObject'])
class CityObjectViewSet(ModelViewSet):
    serializer_class = CityObjectSerializer
    queryset = CityObject.objects.all()