import json
import time
import uuid
import datetime
import pytz
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
    TrainingType,
    Configuration,
    TrainingNeedAnalysis
)

from .serializers import (
    TrainingSerializer,
    TrainingNoteSerializer,
    TrainingCoreSerializer,
    TrainingApplicationSerializer,
    TrainingApplicationExtendedSelfSerializer,
    TrainingAttendeeSerializer,
    TrainingAbsenceMemoSerializer,
    TrainingLogSerializer,
    TrainerSerializer,
    TrainingDomainSerializer,
    TrainingExtendedSerializer,
    TrainingTypeSerializer,
    ConfigurationSerializer,
    TrainingNeedAnalysisSerializer,
    TrainingNeedAnalysisExtendedSerializer
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
        'target_group_type',
        'is_group_KP_A',
        'is_group_KP_B',
        'is_group_KP_C',
        'is_group_KP_D',
        'is_department_11',
        'is_department_15',
        'is_department_21',
        'is_department_31',
        'is_department_41',
        'is_department_45',
        'is_department_47',
        'is_department_51',
        'is_department_55',
        'is_department_61',
        'is_department_63',
        'is_department_71',
        'is_department_81',
        'is_department_86',
        'is_department_90',
        'is_department_91',
        'is_department_92',
        'is_department_93',
        'is_department_94',
        'is_position_01',
        'is_position_02',
        'is_position_03',
        'is_position_04',
        'is_position_05',
        'is_position_06',
        'is_position_07',
        'is_position_08',
        'is_position_09',
        'is_position_10',
        'is_position_11',
        'is_position_12',
        'is_position_13',
        'is_position_14',
        'is_position_15',
        'is_position_16',
        'is_position_17',
        'is_position_18',
        'is_position_19',
        'is_position_20',
        'is_position_21',
        'is_position_22',
        'is_position_23',
        'is_position_24',
        'is_position_25',
        'is_position_26',
        'is_position_27',
        'is_position_28',
        'is_position_29',
        'is_position_30',
        'is_position_31',
        'is_position_32',
        'is_position_33',
        'is_position_34',
        'is_position_35',
        'is_position_36',
        'is_position_37',
        'is_position_38',
        'is_position_39',
        'is_position_40',
        'is_position_41',
        'is_position_42',
        'is_position_43',
        'is_position_44',
        'is_position_45',
        'is_position_46',
        'is_position_47',
        'is_position_48',
        'is_position_49',
        'is_position_50',
        'is_position_51',
        'is_position_52',
        'is_position_53',
        'is_position_54',
        'is_position_55',
        'is_position_60',
        'is_ba19',
        'is_fa29',
        'is_fa32',
        'is_fa41',
        'is_fa44',
        'is_fa48',
        'is_ft19',
        'is_ga17',
        'is_ga19',
        'is_ga22',
        'is_ga26',
        'is_ga29',
        'is_ga32',
        'is_ga41',
        'is_gv41',
        'is_ha11',
        'is_ha14',
        'is_ha16',
        'is_ha19',
        'is_ha22',
        'is_ja19',
        'is_ja22',
        'is_ja29',
        'is_ja36',
        'is_ja38',
        'is_ja40',
        'is_ja41',
        'is_ja44',
        'is_ja48',
        'is_ja52',
        'is_ja54',
        'is_kp11',
        'is_kp14',
        'is_kp19',
        'is_kp22',
        'is_kp29',
        'is_kp32',
        'is_kp41',
        'is_la29',
        'is_la41',
        'is_la44',
        'is_la52',
        'is_la54',
        'is_na01',
        'is_na11',
        'is_na14',
        'is_na17',
        'is_na19',
        'is_na22',
        'is_na26',
        'is_na29',
        'is_na30',
        'is_na32',
        'is_na36',
        'is_na41',
        'is_na44',
        'is_na48',
        'is_na52',
        'is_na54',
        'is_ra01',
        'is_ra03',
        'is_ua11',
        'is_ua14',
        'is_ua17',
        'is_ua19',
        'is_ua24',
        'is_ua29',
        'is_ua32',
        'is_ua36',
        'is_ua41',
        'is_ud43',
        'is_ud48',
        'is_ud52',
        'is_vu06',
        'is_vu07',
        'is_wa17',
        'is_wa19',
        'is_wa22',
        'is_wa26',
        'is_wa28',
        'is_wa29',
        'is_wa32',
        'is_wa36',
        'is_wa41',
        'is_wa44',
        'is_wa48',
        'is_wa52',
        'is_wa54',
        'is_waa41',
        'is_waa44',
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
    def get_latest(self, request, *args, **kwargs):

        trainings = Training.objects.all().order_by('-start_date')
        serializer = TrainingSerializer(trainings, many=True)
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
        attendance_internal = 0
        attendance_external = 2
        current_expenses = 0

        current_budget = Configuration.objects.filter(slug='current_budget').first()

        statistic_data = {
            'planned_training': planned_training,
            'internal_training': internal_training,
            'external_training': external_training,
            'current_budget': current_budget.value,
            'attendance_internal': attendance_internal,
            'attendance_external': attendance_external,
            'current_expenses': current_expenses
        }

        return JsonResponse(statistic_data)

    @action(methods=['GET'], detail=False)
    def get_next_code(self, request, *args, **kwargs):
        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        prefix = 'MBPP{}'.format(datetime.datetime.now(timezone_).strftime('%y%m'))
        prev_instances = Training.objects.filter(course_code__contains=prefix)

        next_course_code = ''

        if prev_instances.exists():
            last_instance_id = prev_instances.first().course_code[-4:]
            next_course_code = prefix+'{0:04d}'.format(int(last_instance_id)+1)
        else:
            next_course_code = prefix+'{0:04d}'.format(1)
        
        code_data = {
            'code': next_course_code
        }
        
        return JsonResponse(code_data)


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
        permission_classes = [IsAuthenticated]#[IsAuthenticated] [AllowAny]
        
        # if self.action == 'list':
        #     permission_classes = [IsAuthenticated]
        # else:
        #     permission_classes = [IsAuthenticated]
        
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'ST':
            queryset = TrainingApplication.objects.filter(
                applicant=user.id
            )
        elif user.user_type == 'DC':
            queryset = TrainingApplication.objects.all()
        elif user.user_type == 'TC':
            queryset = TrainingApplication.objects.all()
        elif user.user_type == 'AD':
            queryset = TrainingApplication.objects.all()
        else:
            queryset = TrainingApplication.objects.none()

        queryset = TrainingApplication.objects.all()
        return queryset  
    
    @action(methods=['GET'], detail=False)
    def get_self_latest(self, request, *args, **kwargs):

        user = request.user
        applications = TrainingApplication.objects.filter(applicant=user).order_by('-modified_at')
        serializer_class = TrainingApplicationExtendedSelfSerializer(applications, many=True)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=False)
    def get_self_history(self, request, *args, **kwargs):

        user = request.user
        applications = TrainingApplication.objects.filter(applicant=user).order_by('-modified_at')
        serializer_class = TrainingApplicationExtendedSelfSerializer(applications, many=True)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=False)
    def get_statistics_self(self, request, *args, **kwargs):

        user = request.user
        cores = TrainingCore.objects.all()
        data_to_pass_ = []
        for core in cores:
            data_to_pass_.append({
                'core': core.child,
                'value': len(TrainingApplication.objects.filter(applicant=user, training__core=core))
            })
        
        # print(data_to_pass_)
        data_ = {
            'statistics': data_to_pass_
        }

        return JsonResponse(data_)

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


class TrainingTypeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingType.objects.all()
    serializer_class = TrainingTypeSerializer
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
        queryset = TrainingType.objects.all()
        return queryset  


class ConfigurationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
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
        queryset = Configuration.objects.all()
        return queryset  


class TrainingNeedAnalysisViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingNeedAnalysis.objects.all()
    serializer_class = TrainingNeedAnalysisSerializer
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
        queryset = TrainingNeedAnalysis.objects.all()
        return queryset  
    
    @action(methods=['GET'], detail=True)
    def extended(self, request, *args, **kwargs):

        analysis = self.get_object()
        serializer_class = TrainingNeedAnalysisExtendedSerializer(analysis, many=False)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):

        analyses = TrainingNeedAnalysis.objects.all()
        serializer_class = TrainingNeedAnalysisExtendedSerializer(analyses, many=True)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=False)
    def get_self(self, request, *args, **kwargs):

        user = request.user
        analyses = TrainingNeedAnalysis.objects.filter(staff=user)
        serializer_class = TrainingNeedAnalysisExtendedSerializer(analyses, many=True)
        
        return Response(serializer_class.data)
    
    @action(methods=['POST'], detail=False)
    def get_self_range(self, request, *args, **kwargs):

        user = request.user

        request_ = json.loads(request.body)
        requested_start_ = request_['start_date']
        requested_end_ = request_['end_date']

        analyses = TrainingNeedAnalysis.objects.filter(
            staff=user,
            created_at__ranged=(
                start_date,
                end_date
            )
        )
        serializer_class = TrainingNeedAnalysisExtendedSerializer(analyses, many=True)
        
        return Response(serializer_class.data)
    

    @action(methods=['POST'], detail=False)
    def get_all_range(self, request, *args, **kwargs):

        request_ = json.loads(request.body)
        requested_start_ = request_['start_date']
        requested_end_ = request_['end_date']

        analyses = TrainingNeedAnalysis.objects.filter(
            created_at__ranged=(
                start_date,
                end_date
            )
        )
        serializer_class = TrainingNeedAnalysisExtendedSerializer(analyses, many=True)
        
        return Response(serializer_class.data)

    @action(methods=['GET'], detail=False)
    def get_statistics(self, request, *args, **kwargs):

        cores = TrainingCore.objects.all()
        data_to_pass_ = []
        for core in cores:
            data_to_pass_.append({
                'core': core.child,
                'value': len(TrainingNeedAnalysis.objects.filter(core=core))
            })
        
        # print(data_to_pass_)
        data_ = {
            'statistics': data_to_pass_
        }

        return JsonResponse(data_)
    