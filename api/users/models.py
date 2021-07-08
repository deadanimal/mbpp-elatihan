from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from django.contrib.postgres.fields import ArrayField
from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

from organisations.models import (
    Organisation
)

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(blank=True, max_length=100)
    staff_id = models.CharField(blank=True, max_length=100)
    nric = models.CharField(blank=True, max_length=12)
    email = models.CharField(blank=True, max_length=100)
    mobile = models.CharField(blank=True, max_length=12)

    SERVICE_STATUS = [
        ('K', 'Kontrak'),
        ('S', 'Sementara'),
        ('T', 'Tetap')
    ]
    service_status = models.CharField(
        max_length=1,
        choices=SERVICE_STATUS,
        default='T'
    )

    GENDER = [
        ('ML', 'Male'),
        ('FM', 'Female'),
        ('NA', 'Not Available')
    ]
    gender = models.CharField(
        max_length=2,
        choices=GENDER,
        default='NA'
    )

    USER_TYPE = [
        ('ST', 'Staff'),
        ('DC', 'Department Coordinator'),
        ('TC', 'Training Coordinator'),
        ('AD', 'Administrator'),
        ('DH', 'Department Head')
    ]
    user_type = models.CharField(
        max_length=2,
        choices=USER_TYPE,
        default='ST'
    )

    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, null=True)

    appointed_at = models.DateTimeField(null=True)
    confirmed_at = models.DateTimeField(null=True)

    department_code = models.CharField(blank=True, max_length=5)
    section_code = models.CharField(blank=True, max_length=5)
    grade_code = models.CharField(blank=True, max_length=10)
    position = models.CharField(blank=True, max_length=100)
    salary_code = models.CharField(blank=True, max_length=100)

    MARITAL_TYPE = [
        ('BW', 'Berkahwin'),
        ('BJ', 'Bujang'),
        ('NA', 'Not Available')
    ]

    marital_type = models.CharField(  
        max_length=2, 
        choices=MARITAL_TYPE,
        default='NA'
    )
    
    RELIGION = [
        ('IM', 'Islam'),
        ('BA', 'Buddha'),
        ('HN', 'Hindu'),
        ('KN', 'Kristian'),
        ('NA', 'Not Available') 
    ]

    religion = models.CharField(
        max_length=2,
        choices=RELIGION,
        default='NA'
    ) 
    
    RACE = [
        ('MU', 'Melayu'),
        ('ID', 'India'),
        ('CN', 'Cina'),
        ('NA', 'Not Available')
    ]

    race = models.CharField(
        max_length=2,
        choices=RACE,
        default='OT'
    )

    profile_picture = models.ImageField(null=True, upload_to=PathAndRename('images'))
    is_first_login = models.BooleanField(default=True)

    history = HistoricalRecords()

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name
    

class SecurityQuestion(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.CharField(max_length=255, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['question']

    def __str__(self):
        return self.question


class SecurityAnswer(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,)
    question = models.ForeignKey(SecurityQuestion, on_delete=models.CASCADE,)
    answer = models.CharField(max_length=255, null=False)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def save(self,*args, **kwargs):
        user = self.user
        user.is_first_login = False
        user.save()
        super(SecurityAnswer, self).save(*args, **kwargs)

    class Meta:
        ordering = ['question']

    def __str__(self):
        return self.question
