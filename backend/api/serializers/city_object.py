from rest_framework import serializers

from api.models import CityObject
from api.serializers.object_type import ObjectTypeSerializer
from api.serializers.sport import SportSerializer


class CityObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityObject
        fields = '__all__'


class CityObjectListSerializer(serializers.ModelSerializer):
    object_type = ObjectTypeSerializer(read_only=True)
    sport = SportSerializer(many=True, read_only=True)

    class Meta:
        model = CityObject
        fields = ['id', 'object_type', 'sport', 'name', 'description', 'location', 'lat', 'lng']