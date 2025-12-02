from django.db import models
from forms.models import Form

class Entry(models.Model):
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name='entries')
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Entry for {self.form.title}"
