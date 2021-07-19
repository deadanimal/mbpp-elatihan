import json
import time
import uuid
import datetime
import pytz
import dateutil.parser

from django.utils import timezone

from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Q
from django.http import HttpResponse

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
    TrainingNeedAnalysis,
    MonitoringPlan,
    BasicLevel
)

from .serializers import (
    TrainingSerializer,
    TrainingNoteSerializer,
    TrainingCoreSerializer,
    TrainingApplicationSerializer,
    TrainingApplicationExtendedSelfSerializer,
    TrainingApplicationExtendedDepartmentSerializer,
    TrainingAttendeeSerializer,
    TrainingAbsenceMemoSerializer,
    TrainingLogSerializer,
    TrainerSerializer,
    TrainingDomainSerializer,
    TrainingExtendedSerializer,
    TrainingTypeSerializer,
    ConfigurationSerializer,
    TrainingNeedAnalysisSerializer,
    TrainingNeedAnalysisExtendedSerializer,
    MonitoringPlanSerializer,
    BasicLevelSerializer
)

from evaluations.models import (
    ExternalEvaluation,
    InternalEvaluation
)

from evaluations.serializers import (
    ExternalEvaluationSerializer,
    InternalEvaluationExtendedSerializer
)

from users.models import (
    CustomUser
)

from users.serializers import (
    CustomUserSerializer
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
        # permission_classes = [IsAuthenticated]#[IsAuthenticated]
        
        if self.action == 'get_latest':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        
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

    @action(methods=['POST'], detail=False)
    def report_attendance(self, request, *args, **kwargs):

        request_ = json.loads(request.body)
        request_department_ = request_['department']
        request_month_type_ = request_['month_type']
        
        # Timezone set
        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        filter_year = datetime.datetime.now(tz=timezone_).year
        today = datetime.datetime.now(tz=timezone_)

        # staffs = CustomUser.objects.filter(
        #     Q(service_status='K') |
        #     Q(service_status='T')
        # )
        # attendances = TrainingAttendee.objects.all()

        # Filter department
        if request_department_ == 'ALL':
            staffs = CustomUser.objects.filter(
                Q(service_status='K') |
                Q(service_status='T')
            )
            department = 'KESELURUHAN'
        else:
            staffs = CustomUser.objects.filter(
                Q(service_status='K') |
                Q(service_status='T')
            ).filter(
                department_code=request_department_
            )

            if request_department_ == '11':
                department = 'JABATAN KHIDMAT PENGURUSAN'
            elif request_department_ == '15':
                department = 'JABATAN PENGUATKUASAAN'
            elif request_department_ == '21':
                department = 'JABATAN PERBENDAHARAAN'
            elif request_department_ == '31':
                department = 'JABATAN KEJURUTERAAN'
            elif request_department_ == '41':
                department = 'JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN'
            elif request_department_ == '45':
                department = 'JABATAN PERKHIDMATAN DAN PERBANDARAAN'
            elif request_department_ == '47':
                department = 'JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN - PELESENAN'
            elif request_department_ == '51':
                department = 'JABATAN KAWALAN BANGUNAN'
            elif request_department_ == '55':
                department = 'JABATAN KONSERVASI WARISAN'
            elif request_department_ == '61':
                department = 'JABATAN PENILAIAN DAN PENGURUSAN HARTA'
            elif request_department_ == '63':
                department = 'JABATAN PESURUHJAYA BANGUNAN'
            elif request_department_ == '71':
                department = 'JABATAN PERANCANGAN PEMBANGUNAN'
            elif request_department_ == '81':
                department = 'JABATAN KHIDMAT KEMASYARAKATAN'
            elif request_department_ == '86':
                department = 'JABATAN LANDSKAP'
            elif request_department_ == '90':
                department = 'PEJABAT DATUK BANDAR'
            elif request_department_ == '91':
                department = 'PEJABAT DATUK BANDAR - UNDANG - UNDANG'
            elif request_department_ == '92':
                department = 'PEJABAT DATUK BANDAR - PENYELARASAN PEMBANGUNAN'
            elif request_department_ == '93':
                department = 'PEJABAT DATUK BANDAR - AUDIT DALAM'
            elif request_department_ == '94':
                department = 'PEJABAT DATUK BANDAR - OSC'
        
        # Filter month
        if request_month_type_ == 'ALL':
            attendances = TrainingAttendee.objects.filter(
                created_at__year=filter_year
            )

            month = 'KESELURUHAN'
        elif request_month_type_ == 'RANGE':
            request_month_from_ = dateutil.parser.parse(request_['month_from'] + 'T00:00:00.0000000+08:00')
            request_month_to_ = dateutil.parser.parse(request_['month_to'] + 'T00:00:00.00000000+08:00')

            attendances = TrainingAttendee.objects.filter(
                created_at__range=[request_month_from_, request_month_to_]
            )

            month_from = request_month_from_.strftime('%d/%m/%Y')
            month_to = request_month_to_.strftime('%d/%m/%Y')

            # if str(request_month_from_) == '1':
            #     month_from = 'JANUARI'
            # elif str(request_month_from_) == '2':
            #     month_from = 'FEBRUARI'
            # elif str(request_month_from_) == '3':
            #     month_from = 'MAC'
            # elif str(request_month_from_) == '4':
            #     month_from = 'APRIL'
            # elif str(request_month_from_) == '5':
            #     month_from = 'MEI'
            # elif str(request_month_from_) == '6':
            #     month_from = 'JUN'
            # elif str(request_month_from_) == '7':
            #     month_from = 'JULAI'
            # elif str(request_month_from_) == '8':
            #     month_from = 'OGOS'
            # elif str(request_month_from_) == '9':
            #     month_from = 'SEPTEMBER'
            # elif str(request_month_from_) == '10':
            #     month_from = 'OKTOBER'
            # elif str(request_month_from_) == '11':
            #     month_from = 'NOVEMBER'
            # elif str(request_month_from_) == '12':
            #     month_from = 'DISEMBER'
            
            # if str(request_month_to_) == '1':
            #     month_to = 'JANUARI'
            # elif str(request_month_to_) == '2':
            #     month_to = 'FEBRUARI'
            # elif str(request_month_to_) == '3':
            #     month_to = 'MAC'
            # elif str(request_month_to_) == '4':
            #     month_to = 'APRIL'
            # elif str(request_month_to_) == '5':
            #     month_to = 'MEI'
            # elif str(request_month_to_) == '6':
            #     month_to = 'JUN'
            # elif str(request_month_to_) == '7':
            #     month_to = 'JULAI'
            # elif str(request_month_to_) == '8':
            #     month_to = 'OGOS'
            # elif str(request_month_to_) == '9':
            #     month_to = 'SEPTEMBER'
            # elif str(request_month_to_) == '10':
            #     month_to = 'OKTOBER'
            # elif str(request_month_to_) == '11':
            #     month_to = 'NOVEMBER'
            # elif str(request_month_to_) == '12':
            #     month_to = 'DISEMBER'
            
            month = month_from + ' - ' + month_to
        elif request_month_type_ == 'SINGLE':
            request_month_ = request_['month']
            attendances = TrainingAttendee.objects.filter(
                created_at__year=filter_year,
                created_at__month=request_month_
            )
            # print(request_month_)
            if str(request_month_) == '1':
                month = 'JANUARI'
            elif str(request_month_) == '2':
                month = 'FEBRUARI'
            elif str(request_month_) == '3':
                month = 'MAC'
            elif str(request_month_) == '4':
                month = 'APRIL'
            elif str(request_month_) == '5':
                month = 'MEI'
            elif str(request_month_) == '6':
                month = 'JUN'
            elif str(request_month_) == '7':
                month = 'JULAI'
            elif str(request_month_) == '8':
                month = 'OGOS'
            elif str(request_month_) == '9':
                month = 'SEPTEMBER'
            elif str(request_month_) == '10':
                month = 'OKTOBER'
            elif str(request_month_) == '11':
                month = 'NOVEMBER'
            elif str(request_month_) == '12':
                month = 'DISEMBER'
            
            # print(month)
        else:
            attendances = TrainingAttendee.objects.none()
            month = 'TIADA'
        
        # print('cendol')
        
        # Group A
        group_a_a_0 = 0
        group_a_a_1 = 0
        group_a_a_2 = 0
        group_a_a_3 = 0
        group_a_a_4 = 0
        group_a_a_5 = 0

        group_a_b_0 = 0
        group_a_b_1 = 0
        group_a_b_2 = 0
        group_a_b_3 = 0
        group_a_b_4 = 0
        group_a_b_5 = 0

        group_a_c_0 = 0
        group_a_c_1 = 0
        group_a_c_2 = 0
        group_a_c_3 = 0
        group_a_c_4 = 0
        group_a_c_5 = 0

        # Group B
        group_b_0 = 0
        group_b_1 = 0
        group_b_2 = 0
        group_b_3 = 0
        group_b_4 = 0
        group_b_5 = 0

        # Group C
        group_c_0 = 0
        group_c_1 = 0
        group_c_2 = 0
        group_c_3 = 0
        group_c_4 = 0
        group_c_5 = 0

        # Group D
        group_d_0 = 0
        group_d_1 = 0
        group_d_2 = 0
        group_d_3 = 0
        group_d_4 = 0
        group_d_5 = 0

        group_a_a = staffs.filter(
            grade_code__gte=48
        )
        group_a_b = staffs.filter(
            grade_code=44
        )
        group_a_c = staffs.filter(
            grade_code=41
        )
        group_b = staffs.filter(
            grade_code__range=[19, 40]
        )
        group_c = staffs.filter(
            grade_code__range=[11, 18]
        )
        group_d = staffs.filter(
            grade_code__in=[
                '01', '02', '03', '04', '05',
                '06', '07', '08', '09', '10'
            ]
        )

        for staff in group_a_a:
            staff_count = attendances.filter(
                attendee=staff,
                is_attend=True,
                verified_by__isnull=False
            ).count()

            if staff_count == 0:
                group_a_a_0 += 1
            elif staff_count == 1:
                group_a_a_1 += 1
            elif staff_count == 2:
                group_a_a_2 += 1
            elif staff_count == 3:
                group_a_a_3 += 1
            elif staff_count == 4:
                group_a_a_4 += 1
            elif staff_count >= 5:
                group_a_a_5 += 1

        for staff in group_a_b:
            staff_count = attendances.filter(
                attendee=staff,
                is_attend=True,
                verified_by__isnull=False
            ).count()

            if staff_count == 0:
                group_a_b_0 += 1
            elif staff_count == 1:
                group_a_b_1 += 1
            elif staff_count == 2:
                group_a_b_2 += 1
            elif staff_count == 3:
                group_a_b_3 += 1
            elif staff_count == 4:
                group_a_b_4 += 1
            elif staff_count >= 5:
                group_a_b_5 += 1

        for staff in group_a_c:
            staff_count = attendances.filter(
                attendee=staff,
                is_attend=True,
                verified_by__isnull=False
            ).count()

            if staff_count == 0:
                group_a_c_0 += 1
            elif staff_count == 1:
                group_a_c_1 += 1
            elif staff_count == 2:
                group_a_c_2 += 1
            elif staff_count == 3:
                group_a_c_3 += 1
            elif staff_count == 4:
                group_a_c_4 += 1
            elif staff_count >= 5:
                group_a_c_5 += 1

        for staff in group_b:
            staff_count = attendances.filter(
                attendee=staff,
                is_attend=True,
                verified_by__isnull=False
            ).count()

            if staff_count == 0:
                group_b_0 += 1
            elif staff_count == 1:
                group_b_1 += 1
            elif staff_count == 2:
                group_b_2 += 1
            elif staff_count == 3:
                group_b_3 += 1
            elif staff_count == 4:
                group_b_4 += 1
            elif staff_count >= 5:
                group_b_5 += 1

        for staff in group_c:
            staff_count = attendances.filter(
                attendee=staff,
                is_attend=True,
                verified_by__isnull=False
            ).count()

            if staff_count == 0:
                group_c_0 += 1
            elif staff_count == 1:
                group_c_1 += 1
            elif staff_count == 2:
                group_c_2 += 1
            elif staff_count == 3:
                group_c_3 += 1
            elif staff_count == 4:
                group_c_4 += 1
            elif staff_count >= 5:
                group_c_5 += 1
        
        for staff in group_d:
            staff_count = attendances.filter(
                attendee=staff,
                is_attend=True,
                verified_by__isnull=False
            ).count()

            if staff_count == 0:
                group_d_0 += 1
            elif staff_count == 1:
                group_d_1 += 1
            elif staff_count == 2:
                group_d_2 += 1
            elif staff_count == 3:
                group_d_3 += 1
            elif staff_count == 4:
                group_d_4 += 1
            elif staff_count >= 5:
                group_d_5 += 1
        
        items = {
            'group_a_a': {
                'group_a_a_0': group_a_a_0,
                'group_a_a_1': group_a_a_1,
                'group_a_a_2': group_a_a_2,
                'group_a_a_3': group_a_a_3,
                'group_a_a_4': group_a_a_4,
                'group_a_a_5': group_a_a_5
            },
            'group_a_b': {
                'group_a_b_0': group_a_b_0,
                'group_a_b_1': group_a_b_1,
                'group_a_b_2': group_a_b_2,
                'group_a_b_3': group_a_b_3,
                'group_a_b_4': group_a_b_4,
                'group_a_b_5': group_a_b_5
            },
            'group_a_c': {
                'group_a_c_0': group_a_c_0,
                'group_a_c_1': group_a_c_1,
                'group_a_c_2': group_a_c_2,
                'group_a_c_3': group_a_c_3,
                'group_a_c_4': group_a_c_4,
                'group_a_c_5': group_a_c_5
            },
            'group_b': {
                'group_b_0': group_b_0,
                'group_b_1': group_b_1,
                'group_b_2': group_b_2,
                'group_b_3': group_b_3,
                'group_b_4': group_b_4,
                'group_b_5': group_b_5
            },
            'group_c': {
                'group_c_0': group_c_0,
                'group_c_1': group_c_1,
                'group_c_2': group_c_2,
                'group_c_3': group_c_3,
                'group_c_4': group_c_4,
                'group_c_5': group_c_5
            },
            'group_d': {
                'group_d_0': group_d_0,
                'group_d_1': group_d_1,
                'group_d_2': group_d_2,
                'group_d_3': group_d_3,
                'group_d_4': group_d_4,
                'group_d_5': group_d_5
            },
            'total': {
                'total_0': group_a_a_0 + group_a_b_0 + group_a_c_0 + group_b_0 + group_c_0 + group_d_0,
                'total_1': group_a_a_1 + group_a_b_1 + group_a_c_1 + group_b_1 + group_c_1 + group_d_1,
                'total_2': group_a_a_2 + group_a_b_2 + group_a_c_2 + group_b_2 + group_c_2 + group_d_2,
                'total_3': group_a_a_3 + group_a_b_3 + group_a_c_3 + group_b_3 + group_c_3 + group_d_3,
                'total_4': group_a_a_4 + group_a_b_4 + group_a_c_4 + group_b_4 + group_c_4 + group_d_4,
                'total_5': group_a_a_5 + group_a_b_5 + group_a_c_5 + group_b_5 + group_c_5 + group_d_5,
                'total_staff': group_a_a.count() + group_a_b.count() + group_a_c.count() + group_b.count() + group_c.count() + group_d.count()
            },
            'misc': {
                'department': department,
                'month': month,
                'year': filter_year,
                'generated_at': today.strftime('%d/%m/%Y %H:%M %p')
            }
        }

        html_string = render_to_string('report/attendance.html', {'data': items})
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
    
    @action(methods=['POST'], detail=False)
    def report_obb(self, request, *args, **kwargs):

        # request_ = json.loads(request.body)
        # request_department_ = request_['department']
        # request_month_type_ = request_['month_type']

        # Timezone set
        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        filter_year = datetime.datetime.now(tz=timezone_).year # Tahun sebenar
        today = datetime.datetime.now(tz=timezone_)
        # print('Date: ', today.strftime('%d/%m/%Y %H:%M %p'))

        # Var
        basic_ = BasicLevel.objects.get(year=(filter_year-5)) # Get basic level
        basic_level_year = basic_.year # Tahun aras asas
        basic_level = basic_.level # Aras asas
        varian = 5 * 2 # Varian - fixed
        tolerance_limit = basic_level - varian # Had toleransi

        # Current year - 0
        target_1 = BasicLevel.objects.get(year=filter_year)
        # Current year - 1
        target_2 = BasicLevel.objects.get(year=(filter_year-1))
        # Current year - 2
        target_3 = BasicLevel.objects.get(year=(filter_year-2))
        # Current year - 3
        target_4 = BasicLevel.objects.get(year=(filter_year-3))
        # Current year - 4
        target_5 = BasicLevel.objects.get(year=(filter_year-4))

        # Monitoring plan target
        plan_target = MonitoringPlan.objects.get(year=filter_year)
        plan_actual = Training.objects.filter(start_date__year=filter_year)

        items = {
            'level': {
                'year': basic_level_year,
                'level': basic_level,
                'varian': varian,
                'tolerance_limit': tolerance_limit
            },
            'target': {
                'target_1_year': target_1.year,
                'target_1': target_1.level,
                'target_2_year': target_2.year,
                'target_2': target_2.level,
                'target_3_year': target_3.year,
                'target_3': target_3.level,
                'target_4_year': target_4.year,
                'target_4': target_4.level,
                'target_5_year': target_5.year,
                'target_5': target_5.level,
            },
            'plan': {
                'target': {
                    'year': plan_target.year,
                    'q1': plan_target.q1,
                    'q2': plan_target.q2,
                    'q3': plan_target.q3,
                    'q4': plan_target.q4
                },
                'actual': {
                    'year': filter_year,
                    'q1': len(plan_actual.filter(start_date__month__range=[1, 3])),
                    'q2': len(plan_actual.filter(start_date__month__range=[4, 6])),
                    'q3': len(plan_actual.filter(start_date__month__range=[7, 9])),
                    'q4': len(plan_actual.filter(start_date__month__range=[10, 12]))
                }
            },
            'misc': {
                'generated_at': today.strftime('%d/%m/%Y %H:%M %p')
            }
        }

        html_string = render_to_string('report/obb.html', {'data': items})
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
        trainings = Training.objects.all()
        attendances = TrainingAttendee.objects.all()
        planned_training = len(trainings)
        internal_training = len(trainings.filter(organiser_type='DD'))
        external_training = len(trainings.filter(organiser_type='LL'))
        attendance_internal = len(attendances.filter(training__organiser_type='DD', is_attend=True))
        attendance_external = len(attendances.filter(training__organiser_type='LL', is_attend=True))
        current_expenses = 0

        
        for training in trainings:
            current_expenses += (training.cost*1000)

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
    def get_statistics_department(self, request, *args, **kwargs):
        user = request.user

        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        current_year = str(datetime.datetime.now(timezone_).year)

        filter_year = datetime.datetime.now(tz=timezone.utc).year
        
        attendances = TrainingAttendee.objects.all()
        attendance_internal = len(attendances.filter(attendee__user_type=user.user_type, training__organiser_type='DD', is_attend=True))
        attendance_external = len(attendances.filter(attendee__user_type=user.user_type, training__organiser_type='LL', is_attend=True))
        attendance_by_month = {
            'january': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=1,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'february': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=2,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'march': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=3,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'april': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=4,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'may': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=5,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'june': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=6,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'july': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=7,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'august': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=8,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'september': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=9,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'october': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=10,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'november': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=11,
                attendee__user_type=user.user_type,
                is_attend=True
            )),
            'december': len(attendances.filter(
                training__start_date__year=filter_year,
                training__start_date__month=12,
                attendee__user_type=user.user_type,
                is_attend=True
            ))
        }

        statistic_data = {
            'attendance_internal': attendance_internal,
            'attendance_external': attendance_external,
            'attendance_by_month': attendance_by_month
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

    @action(methods=['GET'], detail=False)
    def get_department_list(self, request, *args, **kwargs):
        user = request.user

        trainings_all = Training.objects.all()
        if user.department_code == '11':
            trainings = trainings_all.filter(is_department_11=True)
        elif user.department_code == '15':
            trainings = trainings_all.filter(is_department_15=True)
        elif user.department_code == '21':
            trainings = trainings_all.filter(is_department_21=True)
        elif user.department_code == '31':
            trainings = trainings_all.filter(is_department_31=True)
        elif user.department_code == '41':
            trainings = trainings_all.filter(is_department_41=True)
        elif user.department_code == '45':
            trainings = trainings_all.filter(is_department_45=True)
        elif user.department_code == '47':
            trainings = trainings_all.filter(is_department_47=True)
        elif user.department_code == '51':
            trainings = trainings_all.filter(is_department_51=True)
        elif user.department_code == '55':
            trainings = trainings_all.filter(is_department_55=True)
        elif user.department_code == '61':
            trainings = trainings_all.filter(is_department_61=True)
        elif user.department_code == '63':
            trainings = trainings_all.filter(is_department_63=True)
        elif user.department_code == '71':
            trainings = trainings_all.filter(is_department_71=True)
        elif user.department_code == '81':
            trainings = trainings_all.filter(is_department_81=True)
        elif user.department_code == '86':
            trainings = trainings_all.filter(is_department_86=True)
        elif user.department_code == '90':
            trainings = trainings_all.filter(is_department_90=True)
        elif user.department_code == '91':
            trainings = trainings_all.filter(is_department_91=True)
        elif user.department_code == '92':
            trainings = trainings_all.filter(is_department_92=True)
        elif user.department_code == '93':
            trainings = trainings_all.filter(is_department_93=True)
        elif user.department_code == '94':
            trainings = trainings_all.filter(is_department_94=True)
        else:
            trainings = trainings_all
        
        serializer_class = TrainingExtendedSerializer(trainings, many=True)
        
        return Response(serializer_class.data)

    @action(methods=['GET'], detail=True)
    def get_applicable_staff_department(self, request, *args, **kwargs):
        user = request.user
        training = self.get_object()
        training_positions = []
        training_salary_codes = []

        if training.is_position_01:
            training_positions.append('AKAUNTAN')
        if training.is_position_02:
            training_positions.append('ARKITEK')
        if training.is_position_03:
            training_positions.append('ARKITEK LANDSKAP')
        if training.is_position_04:
            training_positions.append('DATUK BANDAR')
        if training.is_position_05:
            training_positions.append('JURUAUDIO VISUAL')
        if training.is_position_06:
            training_positions.append('JURUAUDIT')
        if training.is_position_07:
            training_positions.append('JURURAWT')
        if training.is_position_08:
            training_positions.append('JURURAWAT MASYARAKAT')
        if training.is_position_09:
            training_positions.append('JURUTEKNIK KOMPUTER')
        if training.is_position_10:
            training_positions.append('JURUTERA')
        if training.is_position_11:
            training_positions.append('JURUUKUR BAHAN')
        if training.is_position_12:
            training_positions.append('PEGAWAI KESELAMATAN')
        if training.is_position_13:
            training_positions.append('PEGAWAI KESIHATAN PERSEKITARAN')
        if training.is_position_14:
            training_positions.append('PEGAWAI KHIDMAT PELANGGAN')
        if training.is_position_15:
            training_positions.append('PEGAWAI PENILAIAN')
        if training.is_position_16:
            training_positions.append('PEGAWAI PERANCANG BANDAR DAN DESA')
        if training.is_position_17:
            training_positions.append('PEGAWAI PERTANIAN')
        if training.is_position_18:
            training_positions.append('PEGAWAI PERUBATAN')
        if training.is_position_19:
            training_positions.append('PEGAWAI TADBIR')
        if training.is_position_20:
            training_positions.append('PEGAWAI TEKNOLOGI MAKLUMAT')
        if training.is_position_21:
            training_positions.append('PEGAWAI UNDANG-UNDANG')
        if training.is_position_22:
            training_positions.append('PEGAWAI VETERINAR')
        if training.is_position_23:
            training_positions.append('PEGAWAI PEKERJA AWAM')
        if training.is_position_24:
            training_positions.append('PELUKIS PELAN ')
        if training.is_position_25:
            training_positions.append('PELUKIS PELAN (KEJURUTERAAN AWAM) / PENOLONG JURUTERA')
        if training.is_position_26:
            training_positions.append('PELUKIS PELAN (SENI BINA) / PENOLONG PEGAWAI  SENI BINA')
        if training.is_position_27:
            training_positions.append('PEMANDU KENDERAAN')
        if training.is_position_28:
            training_positions.append('PEMANDU KENDERAAN BERMOTOR')
        if training.is_position_29:
            training_positions.append('PEMBANTU AWAM')
        if training.is_position_30:
            training_positions.append('PEMBANTU KEMAHIRAN')
        if training.is_position_31:
            training_positions.append('PEMBANTU KESIHATAN AWAM')
        if training.is_position_32:
            training_positions.append('PEMBANTU OPERASI')
        if training.is_position_33:
            training_positions.append('PEMBANTU PENGUATKUASA')
        if training.is_position_34:
            training_positions.append('PEMBANTU PENGUATKUASA RENDAH')
        if training.is_position_35:
            training_positions.append('PEMBANTU PENILAIAN')
        if training.is_position_36:
            training_positions.append('PEMBANTU PERAWATAN KESIHATAN')
        if training.is_position_37:
            training_positions.append('PEMBANTU SETIAUSAHA PEJABAT / SETIAUSAHA PEJABAT')
        if training.is_position_38:
            training_positions.append('PEMBANTU TADBIR (PERKERANIAN / OPERASI)')
        if training.is_position_39:
            training_positions.append('PEMBANTU TADBIR KEWANGAN')
        if training.is_position_40:
            training_positions.append('PEMBANTU VETERINAR')
        if training.is_position_41:
            training_positions.append('PEMBANTU KESELAMATAN')
        if training.is_position_42:
            training_positions.append('PENGHANTAR NOTIS ')
        if training.is_position_43:
            training_positions.append('PENOLONG AKAUNTAN')
        if training.is_position_44:
            training_positions.append('PENOLONG ARKITEK LANDSKAP')
        if training.is_position_45:
            training_positions.append('PENOLONG JURUAUDIT')
        if training.is_position_46:
            training_positions.append('PENOLONG PEGAWAI KESIHATAN PERSEKITARAN')
        if training.is_position_47:
            training_positions.append('PENOLONG PEGAWAI PENGUATKUASA')
        if training.is_position_48:
            training_positions.append('PENOLONG PEGAWAI PENILAIAN')
        if training.is_position_49:
            training_positions.append('PENOLONG PEGAWAI PERANCANG BANDAR DAN DESA')
        if training.is_position_50:
            training_positions.append('PENOLONG PEGAWAI PERTANIAN')
        if training.is_position_51:
            training_positions.append('PENOLONG PEGAWAI TADBIR')
        if training.is_position_52:
            training_positions.append('PENOLONG PEGAWAI TEKNOLOGI MAKLUMAT')
        if training.is_position_53:
            training_positions.append('PENOLONG PEGAWAI UNDANG-UNDANG')
        if training.is_position_54:
            training_positions.append('PENOLONG PEGAWAI VETERINAR')
        if training.is_position_55:
            training_positions.append('PEREKA')
        if training.is_position_60:
            training_positions.append('SETIAUSAHA')

        if training.is_ba19:
            training_salary_codes.append('BA19')
        if training.is_fa29:
            training_salary_codes.append('FA29')
        if training.is_fa32:
            training_salary_codes.append('FA32')
        if training.is_fa41:
            training_salary_codes.append('FA41')
        if training.is_fa44:
            training_salary_codes.append('FA44')
        if training.is_fa48:
            training_salary_codes.append('FA48')
        if training.is_ft19:
            training_salary_codes.append('FT19')
        if training.is_ga17:
            training_salary_codes.append('GA17')
        if training.is_ga19:
            training_salary_codes.append('GA19')
        if training.is_ga22:
            training_salary_codes.append('GA22')
        if training.is_ga26:
            training_salary_codes.append('GA26')
        if training.is_ga29:
            training_salary_codes.append('GA29')
        if training.is_ga32:
            training_salary_codes.append('GA32')
        if training.is_ga41:
            training_salary_codes.append('GA41')
        if training.is_gv41:
            training_salary_codes.append('GV41')
        if training.is_ha11:
            training_salary_codes.append('HA11')
        if training.is_ha14:
            training_salary_codes.append('HA14')
        if training.is_ha16:
            training_salary_codes.append('HA16')
        if training.is_ha19:
            training_salary_codes.append('HA19')
        if training.is_ha22:
            training_salary_codes.append('HA22')
        if training.is_ja19:
            training_salary_codes.append('JA19')
        if training.is_ja22:
            training_salary_codes.append('JA22')
        if training.is_ja29:
            training_salary_codes.append('JA29')
        if training.is_ja36:
            training_salary_codes.append('JA36')
        if training.is_ja38:
            training_salary_codes.append('JA38')
        if training.is_ja40:
            training_salary_codes.append('JA40')
        if training.is_ja41:
            training_salary_codes.append('JA41')
        if training.is_ja44:
            training_salary_codes.append('JA44')
        if training.is_ja48:
            training_salary_codes.append('JA48')
        if training.is_ja52:
            training_salary_codes.append('JA52')
        if training.is_ja54:
            training_salary_codes.append('JA54')
        if training.is_kp11:
            training_salary_codes.append('KP11')
        if training.is_kp14:
            training_salary_codes.append('KP14')
        if training.is_kp19:
            training_salary_codes.append('KP19')
        if training.is_kp22:
            training_salary_codes.append('KP22')
        if training.is_kp29:
            training_salary_codes.append('KP29')
        if training.is_kp32:
            training_salary_codes.append('KP32')
        if training.is_kp41:
            training_salary_codes.append('KP41')
        if training.is_la29:
            training_salary_codes.append('LA29')
        if training.is_la41:
            training_salary_codes.append('LA41')
        if training.is_la44:
            training_salary_codes.append('LA44')
        if training.is_la52:
            training_salary_codes.append('LA52')
        if training.is_la54:
            training_salary_codes.append('LA54')
        if training.is_na01:
            training_salary_codes.append('NA01')
        if training.is_na11:
            training_salary_codes.append('NA11')
        if training.is_na14:
            training_salary_codes.append('NA14')
        if training.is_na17:
            training_salary_codes.append('NA17')
        if training.is_na19:
            training_salary_codes.append('NA19')
        if training.is_na22:
            training_salary_codes.append('NA22')
        if training.is_na26:
            training_salary_codes.append('NA26')
        if training.is_na29:
            training_salary_codes.append('NA29')
        if training.is_na30:
            training_salary_codes.append('NA30')
        if training.is_na32:
            training_salary_codes.append('NA32')
        if training.is_na36:
            training_salary_codes.append('NA36')
        if training.is_na41:
            training_salary_codes.append('NA41')
        if training.is_na44:
            training_salary_codes.append('NA44')
        if training.is_na48:
            training_salary_codes.append('NA48')
        if training.is_na52:
            training_salary_codes.append('NA52')
        if training.is_na54:
            training_salary_codes.append('NA54')
        if training.is_ra01:
            training_salary_codes.append('RA01')
        if training.is_ra03:
            training_salary_codes.append('RA03')
        if training.is_ua11:
            training_salary_codes.append('UA11')
        if training.is_ua14:
            training_salary_codes.append('UA14')
        if training.is_ua17:
            training_salary_codes.append('UA17')
        if training.is_ua19:
            training_salary_codes.append('UA19')
        if training.is_ua24:
            training_salary_codes.append('UA24')
        if training.is_ua29:
            training_salary_codes.append('UA29')
        if training.is_ua32:
            training_salary_codes.append('UA32')
        if training.is_ua36:
            training_salary_codes.append('UA36')
        if training.is_ua41:
            training_salary_codes.append('UA41')
        if training.is_ud43:
            training_salary_codes.append('UD43')
        if training.is_ud48:
            training_salary_codes.append('UD48')
        if training.is_ud52:
            training_salary_codes.append('UD53')
        if training.is_vu06:
            training_salary_codes.append('VU06')
        if training.is_vu07:
            training_salary_codes.append('VU07')
        if training.is_wa17:
            training_salary_codes.append('WA17')
        if training.is_wa19:
            training_salary_codes.append('WA19')
        if training.is_wa22:
            training_salary_codes.append('WA22')
        if training.is_wa26:
            training_salary_codes.append('WA26')
        if training.is_wa28:
            training_salary_codes.append('WA28')
        if training.is_wa29:
            training_salary_codes.append('WA29')
        if training.is_wa32:
            training_salary_codes.append('WA32')
        if training.is_wa36:
            training_salary_codes.append('WA36')
        if training.is_wa41:
            training_salary_codes.append('WA41')
        if training.is_wa44:
            training_salary_codes.append('WA44')
        if training.is_wa48:
            training_salary_codes.append('WA48')
        if training.is_wa52:
            training_salary_codes.append('WA52')
        if training.is_wa54:
            training_salary_codes.append('WA54')
        if training.is_waa41:
            training_salary_codes.append('WAA41')
        if training.is_waa44:
            training_salary_codes.append('WAA44')
        
        staff = CustomUser.objects.filter(
            department_code=user.department_code,
            position__in=training_positions,
            salary_code__in=training_salary_codes
        ).order_by('-nric')

        serializer_class = CustomUserSerializer(staff, many=True)

        return Response(serializer_class.data)

    @action(methods=['GET'], detail=True)
    def get_applicable_staff_training(self, request, *args, **kwargs):
        user = request.user
        training = self.get_object()
        training_positions = []
        training_salary_codes = []

        if training.is_position_01:
            training_positions.append('AKAUNTAN')
        if training.is_position_02:
            training_positions.append('ARKITEK')
        if training.is_position_03:
            training_positions.append('ARKITEK LANDSKAP')
        if training.is_position_04:
            training_positions.append('DATUK BANDAR')
        if training.is_position_05:
            training_positions.append('JURUAUDIO VISUAL')
        if training.is_position_06:
            training_positions.append('JURUAUDIT')
        if training.is_position_07:
            training_positions.append('JURURAWT')
        if training.is_position_08:
            training_positions.append('JURURAWAT MASYARAKAT')
        if training.is_position_09:
            training_positions.append('JURUTEKNIK KOMPUTER')
        if training.is_position_10:
            training_positions.append('JURUTERA')
        if training.is_position_11:
            training_positions.append('JURUUKUR BAHAN')
        if training.is_position_12:
            training_positions.append('PEGAWAI KESELAMATAN')
        if training.is_position_13:
            training_positions.append('PEGAWAI KESIHATAN PERSEKITARAN')
        if training.is_position_14:
            training_positions.append('PEGAWAI KHIDMAT PELANGGAN')
        if training.is_position_15:
            training_positions.append('PEGAWAI PENILAIAN')
        if training.is_position_16:
            training_positions.append('PEGAWAI PERANCANG BANDAR DAN DESA')
        if training.is_position_17:
            training_positions.append('PEGAWAI PERTANIAN')
        if training.is_position_18:
            training_positions.append('PEGAWAI PERUBATAN')
        if training.is_position_19:
            training_positions.append('PEGAWAI TADBIR')
        if training.is_position_20:
            training_positions.append('PEGAWAI TEKNOLOGI MAKLUMAT')
        if training.is_position_21:
            training_positions.append('PEGAWAI UNDANG-UNDANG')
        if training.is_position_22:
            training_positions.append('PEGAWAI VETERINAR')
        if training.is_position_23:
            training_positions.append('PEGAWAI PEKERJA AWAM')
        if training.is_position_24:
            training_positions.append('PELUKIS PELAN ')
        if training.is_position_25:
            training_positions.append('PELUKIS PELAN (KEJURUTERAAN AWAM) / PENOLONG JURUTERA')
        if training.is_position_26:
            training_positions.append('PELUKIS PELAN (SENI BINA) / PENOLONG PEGAWAI  SENI BINA')
        if training.is_position_27:
            training_positions.append('PEMANDU KENDERAAN')
        if training.is_position_28:
            training_positions.append('PEMANDU KENDERAAN BERMOTOR')
        if training.is_position_29:
            training_positions.append('PEMBANTU AWAM')
        if training.is_position_30:
            training_positions.append('PEMBANTU KEMAHIRAN')
        if training.is_position_31:
            training_positions.append('PEMBANTU KESIHATAN AWAM')
        if training.is_position_32:
            training_positions.append('PEMBANTU OPERASI')
        if training.is_position_33:
            training_positions.append('PEMBANTU PENGUATKUASA')
        if training.is_position_34:
            training_positions.append('PEMBANTU PENGUATKUASA RENDAH')
        if training.is_position_35:
            training_positions.append('PEMBANTU PENILAIAN')
        if training.is_position_36:
            training_positions.append('PEMBANTU PERAWATAN KESIHATAN')
        if training.is_position_37:
            training_positions.append('PEMBANTU SETIAUSAHA PEJABAT / SETIAUSAHA PEJABAT')
        if training.is_position_38:
            training_positions.append('PEMBANTU TADBIR (PERKERANIAN / OPERASI)')
        if training.is_position_39:
            training_positions.append('PEMBANTU TADBIR KEWANGAN')
        if training.is_position_40:
            training_positions.append('PEMBANTU VETERINAR')
        if training.is_position_41:
            training_positions.append('PEMBANTU KESELAMATAN')
        if training.is_position_42:
            training_positions.append('PENGHANTAR NOTIS ')
        if training.is_position_43:
            training_positions.append('PENOLONG AKAUNTAN')
        if training.is_position_44:
            training_positions.append('PENOLONG ARKITEK LANDSKAP')
        if training.is_position_45:
            training_positions.append('PENOLONG JURUAUDIT')
        if training.is_position_46:
            training_positions.append('PENOLONG PEGAWAI KESIHATAN PERSEKITARAN')
        if training.is_position_47:
            training_positions.append('PENOLONG PEGAWAI PENGUATKUASA')
        if training.is_position_48:
            training_positions.append('PENOLONG PEGAWAI PENILAIAN')
        if training.is_position_49:
            training_positions.append('PENOLONG PEGAWAI PERANCANG BANDAR DAN DESA')
        if training.is_position_50:
            training_positions.append('PENOLONG PEGAWAI PERTANIAN')
        if training.is_position_51:
            training_positions.append('PENOLONG PEGAWAI TADBIR')
        if training.is_position_52:
            training_positions.append('PENOLONG PEGAWAI TEKNOLOGI MAKLUMAT')
        if training.is_position_53:
            training_positions.append('PENOLONG PEGAWAI UNDANG-UNDANG')
        if training.is_position_54:
            training_positions.append('PENOLONG PEGAWAI VETERINAR')
        if training.is_position_55:
            training_positions.append('PEREKA')
        if training.is_position_60:
            training_positions.append('SETIAUSAHA')

        if training.is_ba19:
            training_salary_codes.append('BA19')
        if training.is_fa29:
            training_salary_codes.append('FA29')
        if training.is_fa32:
            training_salary_codes.append('FA32')
        if training.is_fa41:
            training_salary_codes.append('FA41')
        if training.is_fa44:
            training_salary_codes.append('FA44')
        if training.is_fa48:
            training_salary_codes.append('FA48')
        if training.is_ft19:
            training_salary_codes.append('FT19')
        if training.is_ga17:
            training_salary_codes.append('GA17')
        if training.is_ga19:
            training_salary_codes.append('GA19')
        if training.is_ga22:
            training_salary_codes.append('GA22')
        if training.is_ga26:
            training_salary_codes.append('GA26')
        if training.is_ga29:
            training_salary_codes.append('GA29')
        if training.is_ga32:
            training_salary_codes.append('GA32')
        if training.is_ga41:
            training_salary_codes.append('GA41')
        if training.is_gv41:
            training_salary_codes.append('GV41')
        if training.is_ha11:
            training_salary_codes.append('HA11')
        if training.is_ha14:
            training_salary_codes.append('HA14')
        if training.is_ha16:
            training_salary_codes.append('HA16')
        if training.is_ha19:
            training_salary_codes.append('HA19')
        if training.is_ha22:
            training_salary_codes.append('HA22')
        if training.is_ja19:
            training_salary_codes.append('JA19')
        if training.is_ja22:
            training_salary_codes.append('JA22')
        if training.is_ja29:
            training_salary_codes.append('JA29')
        if training.is_ja36:
            training_salary_codes.append('JA36')
        if training.is_ja38:
            training_salary_codes.append('JA38')
        if training.is_ja40:
            training_salary_codes.append('JA40')
        if training.is_ja41:
            training_salary_codes.append('JA41')
        if training.is_ja44:
            training_salary_codes.append('JA44')
        if training.is_ja48:
            training_salary_codes.append('JA48')
        if training.is_ja52:
            training_salary_codes.append('JA52')
        if training.is_ja54:
            training_salary_codes.append('JA54')
        if training.is_kp11:
            training_salary_codes.append('KP11')
        if training.is_kp14:
            training_salary_codes.append('KP14')
        if training.is_kp19:
            training_salary_codes.append('KP19')
        if training.is_kp22:
            training_salary_codes.append('KP22')
        if training.is_kp29:
            training_salary_codes.append('KP29')
        if training.is_kp32:
            training_salary_codes.append('KP32')
        if training.is_kp41:
            training_salary_codes.append('KP41')
        if training.is_la29:
            training_salary_codes.append('LA29')
        if training.is_la41:
            training_salary_codes.append('LA41')
        if training.is_la44:
            training_salary_codes.append('LA44')
        if training.is_la52:
            training_salary_codes.append('LA52')
        if training.is_la54:
            training_salary_codes.append('LA54')
        if training.is_na01:
            training_salary_codes.append('NA01')
        if training.is_na11:
            training_salary_codes.append('NA11')
        if training.is_na14:
            training_salary_codes.append('NA14')
        if training.is_na17:
            training_salary_codes.append('NA17')
        if training.is_na19:
            training_salary_codes.append('NA19')
        if training.is_na22:
            training_salary_codes.append('NA22')
        if training.is_na26:
            training_salary_codes.append('NA26')
        if training.is_na29:
            training_salary_codes.append('NA29')
        if training.is_na30:
            training_salary_codes.append('NA30')
        if training.is_na32:
            training_salary_codes.append('NA32')
        if training.is_na36:
            training_salary_codes.append('NA36')
        if training.is_na41:
            training_salary_codes.append('NA41')
        if training.is_na44:
            training_salary_codes.append('NA44')
        if training.is_na48:
            training_salary_codes.append('NA48')
        if training.is_na52:
            training_salary_codes.append('NA52')
        if training.is_na54:
            training_salary_codes.append('NA54')
        if training.is_ra01:
            training_salary_codes.append('RA01')
        if training.is_ra03:
            training_salary_codes.append('RA03')
        if training.is_ua11:
            training_salary_codes.append('UA11')
        if training.is_ua14:
            training_salary_codes.append('UA14')
        if training.is_ua17:
            training_salary_codes.append('UA17')
        if training.is_ua19:
            training_salary_codes.append('UA19')
        if training.is_ua24:
            training_salary_codes.append('UA24')
        if training.is_ua29:
            training_salary_codes.append('UA29')
        if training.is_ua32:
            training_salary_codes.append('UA32')
        if training.is_ua36:
            training_salary_codes.append('UA36')
        if training.is_ua41:
            training_salary_codes.append('UA41')
        if training.is_ud43:
            training_salary_codes.append('UD43')
        if training.is_ud48:
            training_salary_codes.append('UD48')
        if training.is_ud52:
            training_salary_codes.append('UD53')
        if training.is_vu06:
            training_salary_codes.append('VU06')
        if training.is_vu07:
            training_salary_codes.append('VU07')
        if training.is_wa17:
            training_salary_codes.append('WA17')
        if training.is_wa19:
            training_salary_codes.append('WA19')
        if training.is_wa22:
            training_salary_codes.append('WA22')
        if training.is_wa26:
            training_salary_codes.append('WA26')
        if training.is_wa28:
            training_salary_codes.append('WA28')
        if training.is_wa29:
            training_salary_codes.append('WA29')
        if training.is_wa32:
            training_salary_codes.append('WA32')
        if training.is_wa36:
            training_salary_codes.append('WA36')
        if training.is_wa41:
            training_salary_codes.append('WA41')
        if training.is_wa44:
            training_salary_codes.append('WA44')
        if training.is_wa48:
            training_salary_codes.append('WA48')
        if training.is_wa52:
            training_salary_codes.append('WA52')
        if training.is_wa54:
            training_salary_codes.append('WA54')
        if training.is_waa4:
            training_salary_codes.append('WAA41')
        if training.is_waa4:
            training_salary_codes.append('WAA44')

        staff = CustomUser.objects.filter(
            position__in=training_positions,
            salary_code__in=training_salary_codes
        ).order_by('-nric')

        serializer_class = CustomUserSerializer(staff, many=True)

        return Response(serializer_class.data)


    @action(methods=['GET'], detail=True)
    def check_evaluation(self, request, *args, **kwargs):
        training = self.get_object()
        user = request.user
        is_evaluated = False
        evaluation = None

        if training.organiser_type == 'DD':
            evaluation = InternalEvaluation.objects.filter(training=training, attendee=user).first()
            # print(evaluation)
            
        elif training.organiser_type == 'LL':
            evaluation = ExternalEvaluation.objects.filter(training=training, attendee=user).first()
            
        else:
            evaluation = None
        
        if evaluation:
            is_evaluated = True
            if training.organiser_type == 'DD':
                evaluation = InternalEvaluationExtendedSerializer(evaluation, many=False).data
            elif training.organiser_type == 'LL':
                evaluation = ExternalEvaluationSerializer(evaluation, many=False).data
        else:
            is_evaluated = False
        
        data_ = {
            'is_evaluated': is_evaluated,
            'evaluation': evaluation
        }
        
        return JsonResponse(data_)


class TrainingNoteViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingNote.objects.all()
    serializer_class = TrainingNoteSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    ilterset_fields = [
        'training',
        'title'
    ]

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
        queryset = TrainingNote.objects.all()
        return queryset  


class TrainingCoreViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingCore.objects.all()
    serializer_class = TrainingCoreSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['core', 'staff', 'date']

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
        queryset = TrainingCore.objects.all()
        return queryset  


class TrainingApplicationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingApplication.objects.all()
    serializer_class = TrainingApplicationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training',
        'applicant',
        'status',
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
        applications = TrainingApplication.objects.filter(applicant=user, training__end_date__gte=datetime.datetime.now().date()).order_by('-modified_at')
        serializer_class = TrainingApplicationExtendedSelfSerializer(applications, many=True)
        
        return Response(serializer_class.data)
    

    @action(methods=['GET'], detail=False)
    def get_self_history(self, request, *args, **kwargs):

        user = request.user
        applications = TrainingApplication.objects.filter(applicant=user, training__end_date__lt=datetime.datetime.now().date()).order_by('-modified_at')
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
    
    @action(methods=['GET'], detail=False)
    def get_department_coordinator_list(self, request, *args, **kwargs):

        user = request.user
        applications = TrainingApplication.objects.filter(
            applicant__department_code=user.department_code,
            status='IP',
            approved_level_1_by=None,
            training__start_date__gte=datetime.datetime.now().date()
        )

        serializer_class = TrainingApplicationExtendedDepartmentSerializer(applications, many=True)
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=False)
    def get_department_head_list(self, request, *args, **kwargs):

        user = request.user
        applications = TrainingApplication.objects.filter(
            applicant__department_code=user.department_code,
            status='IP',
            approved_level_2_by=None,
            training__start_date__gte=datetime.datetime.now().date()
        )

        serializer_class = TrainingApplicationExtendedDepartmentSerializer(applications, many=True)
        return Response(serializer_class.data)
    
    @action(methods=['POST'], detail=False)
    def get_department_applicant_histories(self, request, *args, **kwargs):

        user = request.user
        request_ = json.loads(request.body)
        applications = TrainingApplication.objects.filter(
            applicant=request_['applicant']
        )

        serializer_class = TrainingApplicationExtendedDepartmentSerializer(applications, many=True)
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=False)
    def get_department_coordinator_histories(self, request, *args, **kwargs):

        user = request.user
        applications = TrainingApplication.objects.filter(
            applicant__department_code=user.department_code,
            approved_level_1_by__isnull=False
        )

        serializer_class = TrainingApplicationExtendedDepartmentSerializer(applications, many=True)
        return Response(serializer_class.data)

    @action(methods=['GET'], detail=False)
    def get_department_head_histories(self, request, *args, **kwargs):

        user = request.user
        applications = TrainingApplication.objects.filter(
            applicant__department_code=user.department_code,
            approved_level_2_by__isnull=False
        )

        serializer_class = TrainingApplicationExtendedDepartmentSerializer(applications, many=True)
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=True)
    def approve_level_1(self, request, *args, **kwargs):

        user = request.user
        application = self.get_object()
        application.approved_level_1_by = user
        application.save()

        serializer_class = TrainingApplicationSerializer(application, many=False)
        
        return Response(serializer_class.data)

    @action(methods=['GET'], detail=True)
    def approve_level_2(self, request, *args, **kwargs):

        user = request.user
        application = self.get_object()
        application.approved_level_2_by = user
        application.save()

        serializer_class = TrainingApplicationSerializer(application, many=False)
        
        return Response(serializer_class.data)

    @action(methods=['GET'], detail=True)
    def approve_level_3(self, request, *args, **kwargs):

        user = request.user
        application = self.get_object()
        application.status = 'AP'
        application.approved_level_3_by = user
        application.save()

        attendance = TrainingAttendee.objects.create(
            training=application.training,
            attendee=application.applicant,
        )

        serializer_class = TrainingApplicationSerializer(application, many=False)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=True)
    def reject(self, request, *args, **kwargs):

        user = request.user
        application = self.get_object()
        application.status = 'RJ'
        application.save()

        serializer_class = TrainingApplicationSerializer(application)
        
        return Response(serializer_class.data)
    
    @action(methods=['GET'], detail=True)
    def reserve(self, request, *args, **kwargs):

        user = request.user
        application = self.get_object()
        application.status = 'RS'
        application.save()

        serializer_class = TrainingApplicationSerializer(application)
        
        return Response(serializer_class.data)
    
    @action(methods=['POST'], detail=False)
    def apply_batch(self, request, *args, **kwargs):
        
        user = request.user
        request_ = json.loads(request.body)
        request_training_id_ = request_['training']
        request_applicants_= request_['applicants']
        applications = []
        training = Training.objects.filter(id=request_training_id_).first()

        for applicant_ in request_applicants_:
            applicant = CustomUser.objects.filter(id=applicant_['id']).first()
            
            if user.user_type == 'DC':
                applications.append(
                    TrainingApplication.objects.create(
                        training=training,
                        applicant=applicant,
                        approved_level_1_by=user,
                        application_type='PP'
                    )
                )
            elif user.user_type == 'DH':
                applications.append(
                    TrainingApplication.objects.create(
                        training=training,
                        applicant=applicant,
                        approved_level_2_by=user,
                        application_type='PP'
                    )
                )
            elif user.user_type == 'TC':
                applications.append(
                    TrainingApplication.objects.create(
                        training=training,
                        applicant=applicant,
                        approved_level_2_by=user,
                        application_type='PP'
                    )
                )

        serializer_class = TrainingApplicationSerializer(applications, many=True)
        
        return Response(serializer_class.data)

class TrainingAttendeeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAttendee.objects.all()
    serializer_class = TrainingAttendeeSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training', 
        'attendee',
        'verified_by',
        'is_attend'
    ]

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
        queryset = TrainingAttendee.objects.all()
        return queryset  
    
    @action(methods=['GET'], detail=True)
    def sign(self, request, *args, **kwargs):

        attendance = self.get_object()
        attendee = request.user
        
        if datetime.time(12) > datetime.datetime.now().time():
            attendance.check_in = datetime.datetime.now()
            attendance.checked_in_by = attendee
        else:
            attendance.check_out = datetime.datetime.now()
            attendance.checked_out_by = attendee
        
        # if attendance.check_in and attendance.check_out:
        #     attendance.is_attend = True

        attendance.save()

        serializer = TrainingAttendeeSerializer(attendance)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=True)
    def sign_coordinator(self, request, *args, **kwargs):

        attendance = self.get_object()
        coordinator = request.user
        request_ = json.loads(request.body)
        request_attendee_ = request_['attendee']
        request_type_ = request_['type']

        if request_type_ == 'check_in':
            attendance.check_in = datetime.datetime.now()
            attendance.checked_in_by = coordinator

        elif request_type_ == 'check_out':
            attendance.check_out = datetime.datetime.now()
            attendance.checked_out_by = coordinator

        attendance.is_attend = True

        attendance.save()

        serializer = TrainingAttendeeSerializer(attendance)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def sign_coordinator_in(self, request, *args, **kwargs):
        
        attendance = self.get_object()
        coordinator = request.user

        attendance.check_in = datetime.datetime.now()
        attendance.checked_in_by = coordinator

        attendance.save()

        serializer = TrainingAttendeeSerializer(attendance)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=True)
    def sign_coordinator_out(self, request, *args, **kwargs):

        attendance = self.get_object()
        coordinator = request.user

        attendance.check_out = datetime.datetime.now()
        attendance.checked_out_by = coordinator

        attendance.save()

        serializer = TrainingAttendeeSerializer(attendance)
        return Response(serializer.data)
    
    @action(methods=['POST'], detail=False)
    def check_today(self, request, *args, **kwargs):

        attendee = request.user
        request_ = json.loads(request.body)
        training_id_ = request_['training']

        training = Training.objects.filter(
            id=training_id_, 
            end_date__gte=datetime.datetime.now().date()
        ).first()

        if training:
            attendance = TrainingAttendee.objects.filter(
                attendee=attendee,
                training=training,
                created_at__date=datetime.datetime.now().date()
            ).first()
            
            if attendance:
                serializer = TrainingAttendeeSerializer(attendance)
                return Response(serializer.data)
            else:
                attendance_ = TrainingAttendee.objects.create(
                    attendee=attendee,
                    training=training
                )

                serializer = TrainingAttendeeSerializer(attendance_)
                return Response(serializer.data)
        else:
            return HttpResponse(status=204)
    
    @action(methods=['POST'], detail=False)
    def get_attendances(self, request, *args, **kwargs):

        attendee = request.user
        request_ = json.loads(request.body)
        training_id_ = request_['training']

        training = Training.objects.filter(
            id=training_id_
        ).first()

        attendances = TrainingAttendee.objects.filter(
            attendee=attendee,
            training=training
        )

        serializer = TrainingAttendeeSerializer(attendances, many=True)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=True)
    def verify(self, request, *args, **kwargs):

        verifier = request.user
        attendance = self.get_object()

        attendance.verified_by = verifier
        attendance.is_attend = True
        attendance.save()

        serializer = TrainingAttendeeSerializer(attendance)
        return Response(serializer.data)

class TrainingAbsenceMemoViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAbsenceMemo.objects.all()
    serializer_class = TrainingAbsenceMemoSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = TrainingAbsenceMemo.objects.all()
        return queryset  

    @action(methods=['POST'], detail=False)
    def check_memo(self, request, *args, **kwargs):

        attendee = request.user
        request_ = json.loads(request.body)
        request_training_id_ = request_['training']

        training = Training.objects.filter(
            id=request_training_id_
        ).first()
        memo = TrainingAbsenceMemo.objects.filter(
            training=training,
            attendee=attendee
        ).first()

        if memo:
            serializer = TrainingAbsenceMemoSerializer(memo)
            return Response(serializer.data)
        else:
            return HttpResponse(status=204)



class TrainingLogViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Training.history.all()
    serializer_class = TrainingLogSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = Training.history.all()
        return queryset  


class TrainerViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Trainer.objects.all()
    serializer_class = TrainerSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = Trainer.objects.all()
        return queryset  


class TrainingDomainViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingDomain.objects.all()
    serializer_class = TrainingDomainSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = TrainingDomain.objects.all()
        return queryset  


class TrainingTypeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingType.objects.all()
    serializer_class = TrainingTypeSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = TrainingType.objects.all()
        return queryset  


class ConfigurationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Configuration.objects.all()
    serializer_class = ConfigurationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        queryset = Configuration.objects.all()
        return queryset  


class TrainingNeedAnalysisViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingNeedAnalysis.objects.all()
    serializer_class = TrainingNeedAnalysisSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

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
        # data_to_pass_ = []
        # for core in cores:
        #     data_to_pass_.append({
        #         'core': core.child,
        #         'value': len(TrainingNeedAnalysis.objects.filter(core=core))
        #     })
        data_to_pass_fn_ = []
        data_to_pass_gn_ = []

        for core in cores:
            if core.parent == 'FN':
                data_to_pass_fn_.append({
                    'name': core.child,
                    'value': len(TrainingNeedAnalysis.objects.filter(core=core))
                })
            elif core.parent == 'GN':
                data_to_pass_gn_.append({
                    'name': core.child,
                    'value': len(TrainingNeedAnalysis.objects.filter(core=core))
                })

        data_to_pass_ = [
            {
                'type': 'FUNGSIONAL',
                'value': len(TrainingNeedAnalysis.objects.filter(core__parent='FN')),
                'subData': data_to_pass_fn_
            },
            {
                'type': 'GENERIK',
                'value': len(TrainingNeedAnalysis.objects.filter(core__parent='GN')),
                'subData': data_to_pass_gn_
            }
        ]
        """
        data_to_generate = [
            {
                'type': 'xx',
                'total': len(type),
                'subData': [
                    {
                        'name': 'xx',
                        'value': xx
                    }
                ]
            }
        ]
        """
        
        # print(data_to_pass_)
        data_ = {
            'statistics': data_to_pass_
        }

        return JsonResponse(data_)


class MonitoringPlanViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = MonitoringPlan.objects.all()
    serializer_class = MonitoringPlanSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
    ]

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
        queryset = MonitoringPlan.objects.all()
        return queryset  


class BasicLevelViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = BasicLevel.objects.all()
    serializer_class = BasicLevelSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
    ]

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
        queryset = BasicLevel.objects.all()
        return queryset  
    

    @action(methods=['GET'], detail=False)
    def check_report_config(self, request, *args, **kwargs):

        # Timezone set
        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        filter_year = str(datetime.datetime.now(tz=timezone_).year)

        is_plan_exist = MonitoringPlan.objects.filter(year=filter_year).exists()
        is_level_exist = BasicLevel.objects.filter(year=filter_year).exists()
        
        # print(data_to_pass_)
        data_ = {
            'plan': is_plan_exist,
            'level': is_level_exist
        }

        return JsonResponse(data_)
    
    # Tolerasi = level - (5*2)
    # 5 tahun sebeleum