from drf_spectacular.utils import extend_schema
from rest_framework.viewsets import ModelViewSet

from api.models import Invitation
from api.serializers.invitation import InvitationSerializer


@extend_schema(tags=['Invitation'])
class InvitationViewSet(ModelViewSet):
    serializer_class = InvitationSerializer
    queryset = Invitation.objects.all()