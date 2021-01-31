from datetime import datetime
from calendar import timegm
import json
import base64

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import serializers
from django.utils.timezone import now

from drf_extra_fields.fields import Base64FileField

from .models import (
    Exam,
    ExamAttendee
)

from users.serializers import (
    CustomUserSerializer
)

class ExamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exam
        fields = '__all__'


class ExamAttendeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamAttendee
        fields = '__all__'
    

class ExamAttendeeExtendedSerializer(serializers.ModelSerializer):

    staff = CustomUserSerializer(read_only=True, many=False)
    exam = ExamSerializer(read_only=True, many=False)
    class Meta:
        model = ExamAttendee
        fields = '__all__'


class ExamExtendedSerializer(serializers.ModelSerializer):

    exam_attendees = ExamAttendeeSerializer(read_only=True, many=True)
    class Meta:
        model = Exam
        fields = '__all__'