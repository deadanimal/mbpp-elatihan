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
    TrainingCore,
    TrainingApplication,
    TrainingAttendee,
    TrainingAbsenceMemo,
    Trainer,
    TrainingDomain,
    TrainingQuota
)

from .serializers import (
    TrainingSerializer,
    TrainingNoteSerializer,
    TrainingCoreSerializer,
    TrainingApplicationSerializer,
    TrainingAttendeeSerializer,
    TrainingAbsenceMemoSerializer,
    TrainingLogSerializer,
    TrainerSerializer,
    TrainingDomainSerializer,
    TrainingQuotaSerializer,
    TrainingExtendedSerializer
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
    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):

        queryset = Training.objects.all()
        serializer_class = TrainingExtendedSerializer(queryset, many=True)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=True)
    def extended(self, request, *args, **kwargs):

        training = self.get_object()
        serializer_class = TrainingExtendedSerializer(training, many=False)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=False)
    def get_statistics(self, request, *args, **kwargs):

        # training = self.get_object()

        # trainings = 
        # internal_trainings = 

        planned_training = len(Training.objects.all())
        internal_training = len(Training.objects.filter(organiser_type='DD'))
        external_training = len(Training.objects.filter(organiser_type='LL'))
        current_budget = 0
        attendance_internal = 0
        attendance_external = 2
        current_expenses = 0

        statistic_data = {
            'planned_training': planned_training,
            'internal_training': internal_training,
            'external_training': external_training,
            'current_budget': current_budget,
            'attendance_internal': attendance_internal,
            'attendance_external': attendance_external,
            'current_expenses': current_expenses
        }

        return JsonResponse(statistic_data)

        # serializer_class = TrainingExtendedSerializer(training, many=False)
        
        # return Response(serializer_class.data)


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


class TrainingCoreViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingCore.objects.all()
    serializer_class = TrainingCoreSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['core', 'staff', 'date']

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
        queryset = TrainingCore.objects.all()
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

class TrainerViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
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
        queryset = Trainer.objects.all()
        return queryset  


class TrainingDomainViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingDomain.objects.all()
    serializer_class = TrainingDomainSerializer
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
        queryset = TrainingDomain.objects.all()
        return queryset  

class TrainingQuotaViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingQuota.objects.all()
    serializer_class = TrainingQuotaSerializer
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
        queryset = TrainingQuota.objects.all()
        return queryset  