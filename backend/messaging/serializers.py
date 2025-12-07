from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    recipient_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Message
        fields = ('id', 'sender', 'recipient', 'recipient_id', 'content', 'is_read', 'created_at', 'updated_at')
        read_only_fields = ('id', 'sender', 'created_at', 'updated_at')

    def create(self, validated_data):
        recipient_id = validated_data.pop('recipient_id', None)
        if recipient_id:
            validated_data['recipient_id'] = recipient_id
        return super().create(validated_data)
    
    def validate_recipient_id(self, value):
        """Vérifier que le destinataire existe"""
        if value:
            try:
                User.objects.get(id=value)
            except User.DoesNotExist:
                raise serializers.ValidationError("Le destinataire n'existe pas")
        return value
