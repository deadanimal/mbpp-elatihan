# users/models.py
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import json
import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models

from mbpp_tms_api.helpers import PathAndRename

#from api.helpers import PathAndRename

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    full_name = models.CharField(blank=True, max_length=255)
    new_nric = models.CharField(blank=True, max_length=255)
    old_nric = models.CharField(blank=True, max_length=255)
    staff_id = models.CharField(blank=True, max_length=5)
    email = models.CharField(blank=True, max_length=255)
    telephone_number = models.CharField(blank=True, max_length=10)
    salary_code = models.CharField(blank=True, max_length=100)
    grade = models.CharField(blank=True, max_length=255)
    position = models.CharField(blank=True, max_length=255)
    address = models.CharField(blank=True, max_length=255)
    emergency_contact = models.CharField(blank=True, max_length=255)
    emergency_number = models.CharField(blank=True, max_length=11)
    profile_picture = models.ImageField(null=True, upload_to=PathAndRename('images'))

    USER_TYPE = [
        ('ST', 'Staff'),
        ('DC', 'Department Coordinator'),
        ('DH', 'Department Head'),
        ('DD', 'Department Director'),
        ('TC', 'Training Coordinator'),
        ('AD', 'Administrator'),
        ('TR', 'Trainer'),
        ('OT', 'Other')
    ]

    user_type = models.CharField(
        max_length=2,
        choices=USER_TYPE,
        default='OT'
    )  

    GENDER_TYPE = [
        ('ML', 'Male'),
        ('FM', 'Female'),
        ('OT', 'Other')
    ]

    gender_type = models.CharField(
        max_length=2,
        choices=GENDER_TYPE,
        default='OT'
    )

    DEPARTMENT_TYPE = [
        ('KA', 'Kawalan Bangunan'),
        ('KN', 'Kejuruteraan'),
        ('KK', 'Kesihatan, Persekitaraan dan Pelesenan'),
        ('PB', 'Perbendaharaan'),
        ('PP', 'Penilaian dan Pengurusan Harta'),
        ('UU', 'Undang-undang'),
        ('KP', 'Khidmat Pengurusan'),
        ('KM', 'Khidmat Kemasyarakatan'),
        ('KW', 'Konservasi Warisan'),
        ('PB', 'Pesuruhjaya Bangunan'),
        ('PG', 'Penguatkuasaan'),
        ('PN', 'Perkhidmatan Perbandaran'),
        ('LL', 'Landskap'),
        ('BP', 'Bahagian Pelesenan'),
        ('UD', 'Unit Audit Dalaman'),
        ('UO', 'Unit OSC'),
        ('OT', 'Other')
    ]

    department_type = models.CharField(
        max_length=2,
        choices=DEPARTMENT_TYPE,
        default='OT'
    )

    MARITAL_TYPE = [
        ('BW', 'Berkahwin'),
        ('BJ', 'Bujang'),
        ('OT', 'Other')
    ]

    marital_type = models.CharField(  
        max_length=2, 
        choices=MARITAL_TYPE,
        default='OT'
    )
    
    RELIGION_TYPE = [
        ('IM', 'Islam'),
        ('BA', 'Buddha'),
        ('HN', 'Hindu'),
        ('KN', 'Kristian'),
        ('OT', 'Other') 
    ]

    religion_type = models.CharField(max_length=2, choices=RELIGION_TYPE, default='OT') 
    
    RACE_TYPE = [
        ('MU', 'Melayu'),
        ('ID', 'India'),
        ('CN', 'Cina'),
        ('OT', 'Other')
    ]

    race_type = models.CharField(max_length=2, choices=RACE_TYPE, default='OT')
    is_first_login = models.BooleanField(default=True)

    class Meta:
        ordering = ['-full_name']

    def __str__(self):
        return self.full_name

class UserEvent(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    action = models.CharField(max_length=100, default='NA')
    action_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='user_event_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class SecurityQuestion(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    question = models.CharField(max_length=255, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: 
        ordering = ['-created_at']
