from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path, include

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from conf import settings

api_urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    path('', include('api.urls')),

]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_urlpatterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)