from django.shortcuts import render
from django.db.models import Q

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Exam, 
    ExamApplication,
    ExamAttendance,
    ExamResult,
    ExamAbsence,
    ExamEvent,
)

from .serializers import (
    ExamSerializer, ExamApplicationSerializer,ExamAttendanceSerializer,ExamResultSerializer,ExamAbsenceSerializer,ExamEventSerializer,
)

class ExamViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Exam.objects.all()
        return queryset

class ExamApplicationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExamApplication.objects.all()
    serializer_class = ExamApplicationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['exam_code', 'current_appoint_type', 'status_type']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = ExamApplication.objects.all()
        return queryset

class ExamAttendanceViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset =  ExamAttendance.objects.all()
    serializer_class =  ExamAttendanceSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['exam_code']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset =  ExamAttendance.objects.all()
        return queryset

class ExamResultViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExamResult.objects.all()
    serializer_class = ExamResultSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['exam_code']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = ExamResult.objects.all()
        return queryset

class ExamAbsenceViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExamAbsence.objects.all()
    serializer_class = ExamAbsenceSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['exam_code']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = ExamAbsence.objects.all()
        return queryset

class ExamEventViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExamEvent.objects.all()
    serializer_class = ExamEventSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = ExamEvent.objects.all()
        return queryset
