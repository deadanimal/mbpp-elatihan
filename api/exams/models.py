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
    title = models.CharField(max_length=255, null=True)
    code = models.CharField(max_length=100, null=True)
    CLASSIFICATION = [
        ('FKW', 'FAEDAH KEWANGAN'),
        ('PDP', 'PENGESAHAN DALAM PERKHIDMATAN'),
        ('PSL', 'PEPERIKSAAN PENINGKATAN SECARA LANTIKAN (PSL)'),
        ('NA', 'Not Available')
    ]
    classification = models.CharField(
        max_length=3,
        choices=CLASSIFICATION,
        default='NA'
    )
    organiser = models.CharField(max_length=100, null=True)
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['classification', 'title']

    def __str__(self):
        return self.title


class ExamAttendee(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(
        Exam,
        null=True,
        on_delete=models.CASCADE,
        related_name='exam_attendees'
    )
    staff = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='exam_staff'
    )
    date = models.DateTimeField(null=True)
    document_copy = models.FileField(null=True, upload_to=PathAndRename('mbpp-elatihan/documents'))

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

    note = models.CharField(null=True, max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.created_at

