from rest_framework import serializers
from .models import Entry

class EntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Entry
        fields = ('id', 'form', 'data', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
