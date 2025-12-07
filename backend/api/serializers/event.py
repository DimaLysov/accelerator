from rest_framework import serializers

from api.models import Event
from api.serializers.sport import SportSerializer


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class EventListSerializer(serializers.ModelSerializer):
    sport = SportSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = ['id', 'sport', 'name', 'description', 'location', 'type_event', 'start_date', 'end_date']