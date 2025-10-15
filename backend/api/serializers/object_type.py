from rest_framework import serializers

from api.models import ObjectType


class ObjectTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ObjectType
        fields = '__all__'
