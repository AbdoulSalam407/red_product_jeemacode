from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Email
from .serializers import EmailSerializer

class EmailViewSet(viewsets.ModelViewSet):
    queryset = Email.objects.all()
    serializer_class = EmailSerializer
    permission_classes = [IsAuthenticated]
