from django.urls import path, include
from rest_framework import routers

from api.views.city_object import CityObjectViewSet
from api.views.event import EventViewSet
from api.views.invitation import InvitationViewSet
from api.views.object_type import ObjectTypeViewSet
from api.views.sport import SportViewSet


router = routers.DefaultRouter()
router.register(r'city_object', CityObjectViewSet)
router.register(r'event', EventViewSet)
router.register(r'invitation', InvitationViewSet)
router.register(r'object_type', ObjectTypeViewSet)
router.register(r'sport', SportViewSet)


urlpatterns = [
    path('', include(router.urls)),
]