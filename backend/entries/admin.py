from django.contrib import admin
from .models import Entry

@admin.register(Entry)
class EntryAdmin(admin.ModelAdmin):
    list_display = ('form', 'created_at')
    list_filter = ('form', 'created_at')
    search_fields = ('form__title',)
    readonly_fields = ('created_at', 'updated_at')
