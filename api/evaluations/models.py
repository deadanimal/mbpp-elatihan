from __future__ import unicode_literals
import uuid
import pytz
import datetime

from django.contrib.gis.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

from trainings.models import (
    Training
)
from users.models import (
    CustomUser
)

class InternalEvaluation(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    training = models.ForeignKey(
        Training, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='internal_evaluation_training'
    )
    attendee = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='internal_evaluation_attendee'
    )

    answer_1 = models.CharField(max_length=1, null=True) # Question 1: 1/2/3/4/5
    answer_2 = models.CharField(max_length=1, null=True) # Question 2: 1/2/3
    answer_3 = models.CharField(max_length=1, null=True) # Question 3: 1/2/3
    answer_4 = models.CharField(max_length=1, null=True) # Question 4.1: 1/2/3/4/5
    answer_5 = models.CharField(max_length=1, null=True) # Question 4.2: 1/2/3/4/5
    answer_6 = models.CharField(max_length=1, null=True) # Question 4.3: 1/2/3/4/5
    answer_7 = models.TextField(null=True) # Question 5: Free text
    answer_8 = models.TextField(null=True) # Question 6: Free text

    approved_by = models.ForeignKey( # Department head
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='internal_evaluation_approved_by',
        limit_choices_to={
            'user_type': 'DH'
        }
    )

    verified_by = models.ForeignKey( # Training coordinator
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='internal_evaluation_verified_by',
        limit_choices_to={
            'user_type': 'TC'
        }
    )

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.training


class ExternalEvaluation(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    training = models.ForeignKey(
        Training, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='external_evaluation_training'
    )
    attendee = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='external_evaluation_attendee'
    )

    answer_1 = models.TextField(null=True) # Question 1: Objectif freetext
    answer_2 = models.TextField(null=True) # Question 2: Isu kandungan freetext
    answer_3 = models.TextField(null=True) # Question 3.1: Faedah tugas freetext
    answer_4 = models.TextField(null=True) # Question 3.2: Faedah kemajuan freetext
    answer_5 = models.TextField(null=True) # Question 4.1: Kebaikan freetext
    answer_6 = models.TextField(null=True) # Question 4.2: Kelemahan freetext
    answer_7 = models.TextField(null=True) # Question 5: Pelan tindakan freetext
    answer_8 = models.TextField(null=True) # Question 6: Kesusaian freetext
    # answer_7 = models.TextField(null=False) # Question 7: Kesusaian freetext

    approved_by = models.ForeignKey( # Department head
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='external_evaluation_approved_by',
        limit_choices_to={
            'user_type': 'DH'
        }
    )

    verified_by = models.ForeignKey( # Training coordinator
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='external_evaluation_verified_by',
        limit_choices_to={
            'user_type': 'TC'
        }
    )

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.training


class ContentEvaluation(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    evaluation = models.ForeignKey(
        InternalEvaluation, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='evaluation_training'
    )
    topic_trainer = models.CharField(max_length=255, null=False)
    content = models.CharField(max_length=1, null=False)
    presentation = models.CharField(max_length=1, null=False)
    relevance = models.CharField(max_length=1, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.evaluation


class Certificate(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    training = models.ForeignKey(
        Training, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='certificate_training'
    )
    attendee = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='certificate_attendee'
    )
    generated_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='certificate_generated_by',
        limit_choices_to={
            'user_type': 'TC'
        }
    )
    cert = models.FileField(null=True, upload_to=PathAndRename('mbpp-elatihan/certificates'))

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.evaluation