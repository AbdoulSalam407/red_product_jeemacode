from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retourner tous les messages envoyés et reçus par l'utilisateur
        return Message.objects.filter(
            Q(sender=self.request.user) | Q(recipient=self.request.user)
        )

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
