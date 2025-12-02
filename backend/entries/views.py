from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Entry
from .serializers import EntrySerializer

class EntryViewSet(viewsets.ModelViewSet):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer
    permission_classes = [IsAuthenticated]
