from django.contrib import admin
from .models import Email

@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    list_display = ('recipient', 'subject', 'is_sent', 'created_at')
    list_filter = ('is_sent', 'created_at')
    search_fields = ('recipient', 'subject', 'body')
    readonly_fields = ('created_at', 'sent_at')
