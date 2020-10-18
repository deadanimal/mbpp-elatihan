from __future__ import unicode_literals
import uuid

from django.contrib.gis.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

from users.models import (
    CustomUser
)

class Exam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(blank=True, max_length=100)
    staff = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='exam_staff')
    code = models.CharField(blank=True, max_length=100)
    date = models.DateTimeField(blank=True)
    document_copy = models.FileField(null=True, upload_to=PathAndRename('document'))

    RESULT = [
        ('PA', 'Pass'),
        ('FA', 'Failed'),
        ('NA', 'Not Available')
    ]
    result = models.CharField(
        max_length=2,
        choices=RESULT,
        default='NA'
    )

    CLASSIFICATION = [
        ('FKW', 'Faedah Kewangan'),
        ('PDP', 'Pengesahan Dalam Perkhidmatan'),
        ('PSL', 'Peperiksaan Peningkatan Secara Lantikan (PSL)'),
        ('NA', 'Not Available')
    ]
    classification = models.CharField(
        max_length=3,
        choices=CLASSIFICATION,
        default='NA'
    )
    note = models.CharField(blank=True, max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

