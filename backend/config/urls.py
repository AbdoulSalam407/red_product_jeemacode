from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/hotels/', include('hotels.urls')),
    path('api/tickets/', include('tickets.urls')),
    path('api/messages/', include('messaging.urls')),
    path('api/emails/', include('emails.urls')),
    path('api/forms/', include('forms.urls')),
    path('api/entries/', include('entries.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
