from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from .models import Message
from .serializers import MessageSerializer
import logging

logger = logging.getLogger(__name__)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Retourner tous les messages envoyés et reçus par l'utilisateur
        queryset = Message.objects.filter(
            Q(sender=self.request.user) | Q(recipient=self.request.user)
        ).order_by('-created_at')
        logger.info(f"Messages for user {self.request.user.id}: {queryset.count()}")
        return queryset

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
        logger.info(f"Message created by {self.request.user.id}")
