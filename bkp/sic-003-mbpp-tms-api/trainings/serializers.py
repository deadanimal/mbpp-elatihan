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
    TrainingCode,
    TrainingAttendance,
    TrainingAbsence,
    TrainingApplication,
    TrainingNeedQuestion,
    TrainingNeedAnswer,
    TrainingNote,
    TrainingAssessmentQuestion,
    TrainingAssessmentAnswer,
    TrainingEvent,
    TrainingCodeGroup,
    TrainingCodeClass,
    TrainingCodeCategory
)

class TrainingSerializer(serializers.ModelSerializer):

    class Meta:
        model = Training
        fields = '__all__'
        read_only_fields = ['id']

class TrainingCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingCode
        fields = '__all__'
        read_only_fields = ['id']

class TrainingAttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAttendance
        fields = '__all__'
        read_only_fields = ['id']   

class TrainingAbsenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAbsence
        fields = '__all__'
        read_only_fields = ['id']   

class TrainingApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model =  TrainingApplication
        fields = '__all__'
        read_only_fields = ['id'] 

class TrainingNeedQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingNeedQuestion
        fields = '__all__'
        read_only_fields = ['id'] 

class TrainingNeedAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingNeedAnswer
        fields = '__all__'
        read_only_fields = ['id'] 

class TrainingNoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingNote
        fields = '__all__'
        read_only_fields = ['id'] 

class TrainingAssessmentQuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAssessmentQuestion
        fields = '__all__'
        read_only_fields = ['id'] 

class TrainingAssessmentAnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAssessmentAnswer
        fields = '__all__'
        read_only_fields = ['id'] 

class TrainingEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingEvent
        fields = '__all__'
        read_only_fields = ['id']

class TrainingCodeGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingCodeGroup
        fields = '__all__'
        read_only_fields = ['id']

class TrainingCodeClassSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingCodeClass
        fields = '__all__'
        read_only_fields = ['id']

class TrainingCodeCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingCodeCategory
        fields = '__all__'
        read_only_fields = ['id']