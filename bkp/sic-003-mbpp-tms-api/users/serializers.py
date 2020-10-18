from datetime import datetime
from calendar import timegm
import json

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import serializers
from django.utils.timezone import now

from .models import (
    CustomUser,
    UserEvent,
    SecurityQuestion
)


class CustomUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = 'id', 'full_name', 'new_nric', 'old_nric', 'staff_id', 'email', 'telephone_number', 'salary_code', 'grade', 'position', 'address', 'emergency_contact', 'emergency_number', 'profile_picture', 'user_type', 'gender_type', 'department_type', 'marital_type', 'religion_type', 'race_type', 'is_first_login'
        read_only_fields = ['id']

class UserEventSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = UserEvent
        fields = '__all__'
        read_only_fields = ['id']

class SecurityQuestionSerializer(serializers.ModelSerializer):
 
    class Meta:
        model = SecurityQuestion
        fields = '__all__'
        read_only_fields = ['id']