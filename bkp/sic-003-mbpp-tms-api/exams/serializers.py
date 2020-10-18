from rest_framework import serializers

from django.utils.timezone import now

from .models import (
    Exam,
    ExamApplication,ExamAttendance,ExamResult,ExamAbsence,ExamEvent
)

class ExamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Exam
        fields = '__all__'

class ExamApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamApplication
        fields = '__all__'

class ExamAttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamAttendance
        fields = '__all__'

class ExamResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamResult
        fields = '__all__'

class ExamAbsenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamAbsence
        fields = '__all__'

class ExamEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExamEvent
        fields = '__all__'