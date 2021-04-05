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
    ContentEvaluation,
    ExternalEvaluation,
    InternalEvaluation,
    Certificate
)

from trainings.serializers import (
    TrainingSerializer
)

from users.serializers import (
    CustomUserSerializer
)

class ContentEvaluationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContentEvaluation
        fields = '__all__'


class ContentEvaluationExtendedSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContentEvaluation
        fields = '__all__'


class ExternalEvaluationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExternalEvaluation
        fields = '__all__'


class ExternalEvaluationExtendedSerializer(serializers.ModelSerializer):

    training = TrainingSerializer(read_only=True)
    attendee = CustomUserSerializer(read_only=True)
    approved_by = CustomUserSerializer(read_only=True)
    verified_by = CustomUserSerializer(read_only=True)
    class Meta:
        model = ExternalEvaluation
        fields = '__all__'


class InternalEvaluationSerializer(serializers.ModelSerializer):

    class Meta:
        model = InternalEvaluation
        fields = '__all__'


class InternalEvaluationExtendedSerializer(serializers.ModelSerializer):

    training = TrainingSerializer(read_only=True)
    attendee = CustomUserSerializer(read_only=True)
    approved_by = CustomUserSerializer(read_only=True)
    verified_by = CustomUserSerializer(read_only=True)
    evaluation_training = ContentEvaluationSerializer(read_only=True, many=True)
    class Meta:
        model = InternalEvaluation
        fields = '__all__'


class CertificateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Certificate
        fields = '__all__'


class CertificateExtendedSerializer(serializers.ModelSerializer):

    training = TrainingSerializer(read_only=True)
    attendee = CustomUserSerializer(read_only=True)
    generated_by = CustomUserSerializer(read_only=True)
    class Meta:
        model = Certificate
        fields = '__all__'