from datetime import datetime
from calendar import timegm
import json

from django.contrib.auth.forms import PasswordResetForm
from django.conf import settings
from django.utils.translation import gettext as _
from rest_framework import serializers
from django.utils.timezone import now

from drf_extra_fields.fields import Base64FileField

from .models import (
    Training,
    TrainingNote,
    TrainingCore,
    TrainingApplication,
    TrainingAttendee,
    TrainingAbsenceMemo,
    Trainer,
    TrainingDomain,
    TrainingType,
    Configuration,
    TrainingNeedAnalysis,
    MonitoringPlan,
    BasicLevel
)

from organisations.serializers import(
    OrganisationSerializer
)

from users.serializers import(
    CustomUserSerializer
)

class PDFBase64File(Base64FileField):
    ALLOWED_TYPES = ['pdf']

    def get_file_extension(self, filename, decoded_file):
        return 'pdf'

class FileBase64File(Base64FileField):
    ALLOWED_TYPES = [
        'pdf',
        'jpeg',
        'jpg',
        'png',
        'tiff',
        'webp'
    ]

    def get_file_extension(self, filename, decoded_file):
        # print('self ', self)
        # print('filename ', filename)
        # print('decoded_file ', decoded_file)
        return ('pdf',
        'jpeg',
        'jpg',
        'png',
        'tiff',
        'webp')

class TrainingSerializer(serializers.ModelSerializer):

    # attachment = PDFBase64File()
    # attachment_approval = PDFBase64File()
    class Meta:
        model = Training
        fields = '__all__'


class TrainingNoteSerializer(serializers.ModelSerializer):

    # note_file = PDFBase64File()
    class Meta:
        model = TrainingNote
        fields = '__all__'


class TrainingCoreSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingCore
        fields = '__all__'


class TrainingApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingApplication
        fields = '__all__'


class TrainingApplicationExtendedSerializer(serializers.ModelSerializer):

    applicant = CustomUserSerializer(read_only=True)
    approved_level_1_by = CustomUserSerializer(read_only=True)
    approved_level_2_by = CustomUserSerializer(read_only=True)
    approved_level_3_by = CustomUserSerializer(read_only=True)

    class Meta:
        model = TrainingApplication
        fields = '__all__'


class TrainingApplicationExtendedSelfSerializer(serializers.ModelSerializer):

    training = TrainingSerializer(read_only=True)
    approved_level_1_by = CustomUserSerializer(read_only=True)
    approved_level_2_by = CustomUserSerializer(read_only=True)
    approved_level_3_by = CustomUserSerializer(read_only=True)

    class Meta:
        model = TrainingApplication
        fields = '__all__'


class TrainingAttendeeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAttendee
        fields = '__all__'

class TrainingAttendeeExtendedSerializer(serializers.ModelSerializer):

    attendee = CustomUserSerializer(read_only=True)
    checked_in_by = CustomUserSerializer(read_only=True)
    checked_out_by = CustomUserSerializer(read_only=True)
    verified_by = CustomUserSerializer(read_only=True)
    class Meta:
        model = TrainingAttendee
        fields = '__all__'

    
class TrainingAbsenceMemoSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingAbsenceMemo
        fields = '__all__'


class TrainingAbsenceMemoExtendedSerializer(serializers.ModelSerializer):

    attendee = CustomUserSerializer(read_only=True)
    verified_by = CustomUserSerializer(read_only=True)
    class Meta:
        model = TrainingAbsenceMemo
        fields = '__all__'


class TrainingLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = Training
        fields = '__all__'

class TrainerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Trainer
        fields = '__all__'

class TrainingDomainSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingDomain
        fields = '__all__'

class TrainingTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingType
        fields = '__all__'

class TrainingExtendedSerializer(serializers.ModelSerializer):

    organiser = OrganisationSerializer(read_only=True)
    training_type = TrainingTypeSerializer(read_only=True)
    core = TrainingCoreSerializer(read_only=True)
    domain = TrainingDomainSerializer(read_only=True)
    speaker = CustomUserSerializer(read_only=True)
    facilitator = CustomUserSerializer(read_only=True)
    training_training_notes = TrainingNoteSerializer(read_only=True, many=True)
    training_application = TrainingApplicationExtendedSerializer(read_only=True, many=True)
    training_attendee = TrainingAttendeeExtendedSerializer(read_only=True, many=True)
    training_absence_memo = TrainingAbsenceMemoExtendedSerializer(read_only=True, many=True)
    created_by = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Training
        fields = '__all__'   


class TrainingApplicationExtendedDepartmentSerializer(serializers.ModelSerializer):
    
    training = TrainingExtendedSerializer(read_only=True)
    applicant = CustomUserSerializer(read_only=True)
    approved_level_1_by = CustomUserSerializer(read_only=True)
    approved_level_2_by = CustomUserSerializer(read_only=True)
    approved_level_3_by = CustomUserSerializer(read_only=True)

    class Meta:
        model = TrainingApplication
        fields = '__all__'


class TrainingNeedAnalysisSerializer(serializers.ModelSerializer):

    class Meta:
        model = TrainingNeedAnalysis
        fields = '__all__'


class TrainingNeedAnalysisExtendedSerializer(serializers.ModelSerializer):

    staff = CustomUserSerializer(read_only=True)
    core = TrainingCoreSerializer(read_only=True)
    class Meta:
        model = TrainingNeedAnalysis
        fields = '__all__'

class ConfigurationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Configuration
        fields = '__all__'

class MonitoringPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = MonitoringPlan
        fields = '__all__'

class BasicLevelSerializer(serializers.ModelSerializer):

    class Meta:
        model = BasicLevel
        fields = '__all__'