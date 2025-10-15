from rest_framework import serializers

from api.models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invitation
        fields = '__all__'
