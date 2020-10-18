import json
import time

from django.http import JsonResponse
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
    Exam
)

from .serializers import (
    ExamSerializer
)


class ExamViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'code',
        'staff',
        'date',
        'classification'
    ]

    def get_permissions(self):
        permission_classes = [AllowAny]#[IsAuthenticated]
        """
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        """
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        queryset = Exam.objects.all()
        return queryset  
    
    # @action(methods=['GET'], detail=True)
    # def completed(self, request, *args, **kwargs):
    #     exam = self.get_object()
    #     exam.status = 'CM'
    #     exam.save()

    #     serializer = ExamSerializer(exam)
    #     return Response(serializer.data)
    
