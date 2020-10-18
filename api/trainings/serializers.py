from datetime import datetime
from calendar import timegm
import json

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import serializers
from django.utils.timezone import now

from .models import (
    Training,
    TrainingNote,
    TrainingCode,
    TrainingApplication,
    TrainingAttendee,
    TrainingAbsenceMemo
)

class TrainingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Training
        fields = '__all__'
    

class TrainingNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingNote
        fields = '__all__'
    

class TrainingCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingCode
        fields = '__all__'
    

class TrainingApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingApplication
        fields = '__all__'


class TrainingAttendeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAttendee
        fields = '__all__'
    
class TrainingAbsenceMemoSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAbsenceMemo
        fields = '__all__'

        
class TrainingLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Training
        fields = '__all__'

       