from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import dashboard_views

router = DefaultRouter()
router.register(r'', views.HotelViewSet, basename='hotel')

urlpatterns = [
    path('dashboard/stats/', dashboard_views.dashboard_stats, name='dashboard-stats'),
    path('', include(router.urls)),
]
