from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone
from datetime import datetime

from api.models import Event
from api.serializers.event import EventSerializer, EventListSerializer


@extend_schema(tags=['Event'])
class EventViewSet(ModelViewSet):
    queryset = Event.objects.all()

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'get_professional_events' or self.action == 'get_custom_event':
            return EventListSerializer
        return EventSerializer

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        start_str = request.query_params.get('start')
        end_str = request.query_params.get('end')
        if not start_str or not end_str:
            return Response(
                {'error': 'Both "start" and "end" parameters are required'},
                status=400
            )

        try:
            date_start = datetime.strptime(start_str, '%d-%m-%Y').date()
            date_end = datetime.strptime(end_str, '%d-%m-%Y').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use DD-MM-YYYY'},
                status=400
            )

        if date_start > date_end:
            return Response(
                {'error': '"start" date must be before or equal to "end" date'},
                status=400
            )

            # Все события, которые хоть как-то попадают в этот диапазон
        events = Event.objects.filter(
            start_date__date__lte=date_end,
            end_date__date__gte=date_start,
        )

        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_professional_events(self, request):
        events = Event.objects.filter(type_event='professional events')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def get_custom_event(self, request):
        events = Event.objects.filter(type_event='custom event')
        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)
