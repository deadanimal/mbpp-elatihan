import json
import time
import uuid
import datetime
from django.utils import timezone

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

from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

from .models import (
    Training,
    TrainingNote,
    TrainingCode,
    TrainingApplication,
    TrainingAttendee,
    TrainingAbsenceMemo
)

from .serializers import (
    TrainingSerializer,
    TrainingNoteSerializer,
    TrainingCodeSerializer,
    TrainingApplicationSerializer,
    TrainingAttendeeSerializer,
    TrainingAbsenceMemoSerializer,
    TrainingLogSerializer
)


class TrainingViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'method',
        'country',
        'organiser_type',
        'organiser',
        'course_type',
        'target_group_type',
        'is_group_KPP_A',
        'is_group_KPP_B',
        'is_group_KPP_C',
        'is_group_KP_A',
        'is_group_KP_B',
        'is_group_KP_C',
        'is_department_PDB',
        'is_department_UUU',
        'is_department_UAD',
        'is_department_UPP',
        'is_department_UPS',
        'is_department_JKP',
        'is_department_JPD',
        'is_department_JPH',
        'is_department_JPP',
        'is_department_JKJ',
        'is_department_JKB',
        'is_department_JKEA',
        'is_department_JKEB',
        'is_department_JPR',
        'is_department_JKK',
        'is_department_JKW',
        'is_department_JLK',
        'is_department_JPU',
        'is_department_JPB',
        'transportation'
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
        queryset = Training.objects.all()
        return queryset

    
    @action(methods=['GET'], detail=True)
    def history(self, request, *args, **kwargs):
        history = Training.history.all()
        serializer = TrainingSerializer(history, many=True)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=False)
    def report_attendance(self, request, *args, **kwargs):

        items = {
            'item': 1
        }

        html_string = render_to_string('report/attendance.html', {'items': items})
        html = HTML(string=html_string)
        pdf_file = html.write_pdf(stylesheets=[CSS('https://pipeline-project.sgp1.digitaloceanspaces.com/mbpp-elatihan/css/template.css')])
        
        file_path = "mbpp-elatihan/attendance-report/" + datetime.datetime.utcnow().strftime("%s") + "-" + uuid.uuid4().hex + '.pdf'
        # "mbpp-elatihan/application-report/" <-- naming system
        saved_file = default_storage.save(
            file_path, 
            ContentFile(pdf_file)
        )
        
        full_url_path = settings.MEDIA_ROOT + saved_file
        # print(full_url_path)

        serializer = 'https://pipeline-project.sgp1.digitaloceanspaces.com/'+full_url_path
        return Response(serializer)
    

    @action(methods=['GET'], detail=False)
    def report_obb(self, request, *args, **kwargs):

        items = {
            'item': 1
        }

        html_string = render_to_string('report/obb.html', {'items': items})
        html = HTML(string=html_string)
        pdf_file = html.write_pdf(stylesheets=[CSS('https://pipeline-project.sgp1.digitaloceanspaces.com/mbpp-elatihan/css/template.css')])
        
        file_path = "mbpp-elatihan/obb-report/" + datetime.datetime.utcnow().strftime("%s") + "-" + uuid.uuid4().hex + '.pdf'
        # "mbpp-elatihan/application-report/" <-- naming system
        saved_file = default_storage.save(
            file_path, 
            ContentFile(pdf_file)
        )
        
        full_url_path = settings.MEDIA_ROOT + saved_file
        # print(full_url_path)

        serializer = 'https://pipeline-project.sgp1.digitaloceanspaces.com/'+full_url_path
        return Response(serializer)
    
    
    # @action(methods=['GET'], detail=True)
    # def completed(self, request, *args, **kwargs):
    #     Training = self.get_object()
    #     Training.status = 'CM'
    #     Training.save()

    #     serializer = TrainingSerializer(Training)
    #     return Response(serializer.data)


class TrainingNoteViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingNote.objects.all()
    serializer_class = TrainingNoteSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    ilterset_fields = [
        'training',
        'title'
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
        queryset = TrainingNote.objects.all()
        return queryset  


class TrainingCodeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingCode.objects.all()
    serializer_class = TrainingCodeSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = TrainingCode.objects.all()
        return queryset  


class TrainingApplicationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingApplication.objects.all()
    serializer_class = TrainingApplicationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training',
        'applicant',
        'is_approved',
        'application_type'
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
        queryset = TrainingApplication.objects.all()
        return queryset  


class TrainingAttendeeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAttendee.objects.all()
    serializer_class = TrainingAttendeeSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training', 
        'attendee',
        'verified_by'
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
        queryset = TrainingAttendee.objects.all()
        return queryset  
    
    @action(methods=['GET'], detail=True)
    def sign(self, request, *args, **kwargs):
        attendee = self.get_object()
        attendee.is_attend = True
        attendee.save()

        serializer = TrainingSerializer(attendee)
        return Response(serializer.data)
    

class TrainingAbsenceMemoViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAbsenceMemo.objects.all()
    serializer_class = TrainingAbsenceMemoSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = TrainingAbsenceMemo.objects.all()
        return queryset  


class TrainingLogViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Training.history.all()
    serializer_class = TrainingLogSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = Training.history.all()
        return queryset  


