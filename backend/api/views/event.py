from rest_framework.response import Response
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from django.utils import timezone
from datetime import datetime

from api.models import Event
from api.serializers.event import EventSerializer


@extend_schema(tags=['Event'])
class EventViewSet(ModelViewSet):
    serializer_class = EventSerializer
    queryset = Event.objects.all()

    @action(detail=False, methods=['get'])
    def by_date(self, request):
        date_str = request.query_params.get('date')

        if not date_str:
            return Response({'error': 'Date parameter is required'}, status=400)

        try:
            # Преобразуем строку в дату
            target_date = datetime.strptime(date_str, '%d-%m-%Y').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use DD-MM-YYYY'}, status=400)

        # Ищем события, которые происходят в указанную дату
        events = Event.objects.filter(
            start_date__date__lte=target_date,
            end_date__date__gte=target_date
        )

        serializer = self.get_serializer(events, many=True)
        return Response(serializer.data)