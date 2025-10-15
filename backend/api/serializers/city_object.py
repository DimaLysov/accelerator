from rest_framework import serializers

from api.models import CityObject


class CityObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CityObject
        fields = '__all__'
