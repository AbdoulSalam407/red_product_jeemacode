from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'images', views.ImageViewSet, basename='image')
router.register(r'hotel-images', views.HotelImageViewSet, basename='hotel-image')

urlpatterns = [
    path('', include(router.urls)),
]
