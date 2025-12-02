from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Form
from .serializers import FormSerializer

class FormViewSet(viewsets.ModelViewSet):
    queryset = Form.objects.all()
    serializer_class = FormSerializer
    permission_classes = [IsAuthenticated]
