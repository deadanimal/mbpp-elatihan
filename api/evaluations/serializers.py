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
    InternalEvaluation
)

from users.serializers import (
    CustomUserSerializer
)

class ContentEvaluationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ContentEvaluation
        fields = '__all__'


class ExternalEvaluationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExternalEvaluation
        fields = '__all__'


class InternalEvaluationSerializer(serializers.ModelSerializer):

    class Meta:
        model = InternalEvaluation
        fields = '__all__'