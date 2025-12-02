from rest_framework import serializers
from .models import Email

class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Email
        fields = ('id', 'recipient', 'subject', 'body', 'is_sent', 'created_at', 'sent_at')
        read_only_fields = ('id', 'created_at', 'sent_at')
