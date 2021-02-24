import json
import time
import pytz
import datetime

from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Q
from django.utils import timezone

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    ContentEvaluation,
    ExternalEvaluation,
    InternalEvaluation
)

from .serializers import (
    ContentEvaluationSerializer,
    ExternalEvaluationSerializer,
    InternalEvaluationSerializer
)

class ContentEvaluationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ContentEvaluation.objects.all()
    serializer_class = ContentEvaluationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = [
    #     'staff',
    #     'date'
    # ]

    def get_permissions(self):
        permission_classes = [IsAuthenticated]#[IsAuthenticated]
        """
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        """
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        queryset = ContentEvaluation.objects.all()
        return queryset  
    
    # @action(methods=['GET'], detail=False)
    # def get_self(self, request, *args, **kwargs):
    #     user = self.request.user
    #     exams = ExamAttendee.objects.filter(
    #         staff=user
    #     )

    #     serializer = ExamAttendeeExtendedSerializer(exams, many=True)
    #     return Response(serializer.data)
    
    # @action(methods=['GET'], detail=True)
    # def extended(self, request, *args, **kwargs):
    #     exam = self.get_object()
    #     serializer = ExamAttendeeExtendedSerializer(exam, many=False)
    #     return Response(serializer.data)

    # @action(methods=['GET'], detail=False)
    # def extended_all(self, request, *args, **kwargs):
    #     exams = ExamAttendee.objects.all()

    #     serializer = ExamAttendeeExtendedSerializer(exams, many=True)
    #     return Response(serializer.data)
    
    # @action(methods=['GET'], detail=False)
    # def get_department_attendees(self, request, *args, **kwargs):
    #     user = request.user
        
    #     if user.user_type == 'DC' or user.user_type == 'DH':
    #         users = ExamAttendee.objects.filter(staff__department_code=user.department_code).order_by('-date')
    #         serializer = ExamAttendeeExtendedSerializer(users, many=True)

    #         return Response(serializer.data)
    #     else:
    #         users = ExamAttendee.objects.none()
    #         serializer = ExamAttendeeExtendedSerializer(users, many=True)

    class ExternalEvaluationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExternalEvaluation.objects.all()
    serializer_class = ExternalEvaluationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = [
    #     'staff',
    #     'date'
    # ]

    def get_permissions(self):
        permission_classes = [IsAuthenticated]#[IsAuthenticated]
        """
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        """
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        queryset = ExternalEvaluation.objects.all()
        return queryset  


class InternalEvaluationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = InternalEvaluation.objects.all()
    serializer_class = InternalEvaluationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = [
    #     'staff',
    #     'date'
    # ]

    def get_permissions(self):
        permission_classes = [IsAuthenticated]#[IsAuthenticated]
        """
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        """
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        queryset = InternalEvaluation.objects.all()
        return queryset  