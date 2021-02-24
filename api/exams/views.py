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
    Exam,
    ExamAttendee
)

from .serializers import (
    ExamSerializer,
    ExamExtendedSerializer,
    ExamAttendeeSerializer,
    ExamAttendeeExtendedSerializer
)

class ExamViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)

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
        queryset = Exam.objects.all()
        return queryset  
    
    @action(methods=['GET'], detail=True)
    def extended(self, request, *args, **kwargs):
        exam = self.get_object()
        serializer = ExamExtendedSerializer(exam, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):
        exams = Exam.objects.all()

        serializer = ExamExtendedSerializer(exams, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def get_statistics(self, request, *args, **kwargs):
        
        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        current_year = str(datetime.datetime.now(timezone_).year)

        filter_year = datetime.datetime.now(tz=timezone.utc).year

        by_department = {
            'dep_11': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='11')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='11')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='11'))
            },
            'dep_15': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='15')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='15')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='15'))
            },
            'dep_21': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='21')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='21')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='21'))
            },
            'dep_31': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='31')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='31')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='31'))
            },
            'dep_41': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='41')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='41')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='41'))
            },
            'dep_45': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='45')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='45')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='45'))
            },
            'dep_47': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='47')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='47')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='47'))
            },
            'dep_51': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='51')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='51')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='51'))
            },
            'dep_55': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='55')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='55')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='55'))
            },
            'dep_61': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='11')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='11')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='11'))
            },
            'dep_63': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='63')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='63')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='63'))
            },
            'dep_71': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='71')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='71')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='71'))
            },
            'dep_81': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='81')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='81')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='81'))
            },
            'dep_86': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='86')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='86')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='86'))
            },
            'dep_90': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='90')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='90')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='90'))
            },
            'dep_91': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='91')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='91')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='91'))
            },
            'dep_92': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='92')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='92')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='92'))
            },
            'dep_93': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='93')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='93')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='93'))
            },
            'dep_94': {
                'total': len(ExamAttendee.objects.filter(staff__department_code='94')),
                'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code='94')),
                'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code='94'))
            }
        }

        by_month = {
            'january': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=1
            )),
            'february': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=2
            )),
            'march': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=3
            )),
            'april': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=4
            )),
            'may': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=5
            )),
            'june': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=6
            )),
            'july': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=7
            )),
            'august': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=8
            )),
            'september': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=9
            )),
            'october': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=10
            )),
            'november': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=11
            )),
            'december': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=12
            ))
        }

        data_ = {
            'departments': by_department,
            'months': by_month
        }

        return JsonResponse(data_)

    
    @action(methods=['GET'], detail=False)
    def get_statistics_department(self, request, *args, **kwargs):
        user = request.user

        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        current_year = str(datetime.datetime.now(timezone_).year)

        filter_year = datetime.datetime.now(tz=timezone.utc).year

        by_result = {
            'total': len(ExamAttendee.objects.filter(staff__department_code=user.department_code)),
            'passed': len(ExamAttendee.objects.filter(result='PA', staff__department_code=user.department_code)),
            'failed': len(ExamAttendee.objects.filter(result='FA', staff__department_code=user.department_code))
        }

        by_month = {
            'january': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=1,
                staff__department_code=user.department_code
            )),
            'february': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=2,
                staff__department_code=user.department_code
            )),
            'march': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=3,
                staff__department_code=user.department_code
            )),
            'april': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=4,
                staff__department_code=user.department_code
            )),
            'may': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=5,
                staff__department_code=user.department_code
            )),
            'june': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=6,
                staff__department_code=user.department_code
            )),
            'july': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=7,
                staff__department_code=user.department_code
            )),
            'august': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=8,
                staff__department_code=user.department_code
            )),
            'september': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=9,
                staff__department_code=user.department_code
            )),
            'october': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=10,
                staff__department_code=user.department_code
            )),
            'november': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=11,
                staff__department_code=user.department_code
            )),
            'december': len(ExamAttendee.objects.filter(
                date__year=filter_year,
                date__month=12,
                staff__department_code=user.department_code
            ))
        }

        data_ = {
            'result': by_result,
            'months': by_month
        }

        return JsonResponse(data_)


class ExamAttendeeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExamAttendee.objects.all()
    serializer_class = ExamAttendeeSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'staff',
        'date'
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
        queryset = ExamAttendee.objects.all()
        return queryset  
    
    @action(methods=['GET'], detail=False)
    def get_self(self, request, *args, **kwargs):
        user = self.request.user
        exams = ExamAttendee.objects.filter(
            staff=user
        )

        serializer = ExamAttendeeExtendedSerializer(exams, many=True)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=True)
    def extended(self, request, *args, **kwargs):
        exam = self.get_object()
        serializer = ExamAttendeeExtendedSerializer(exam, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):
        exams = ExamAttendee.objects.all()

        serializer = ExamAttendeeExtendedSerializer(exams, many=True)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=False)
    def get_department_attendees(self, request, *args, **kwargs):
        user = request.user
        
        if user.user_type == 'DC' or user.user_type == 'DH':
            users = ExamAttendee.objects.filter(staff__department_code=user.department_code).order_by('-date')
            serializer = ExamAttendeeExtendedSerializer(users, many=True)

            return Response(serializer.data)
        else:
            users = ExamAttendee.objects.none()
            serializer = ExamAttendeeExtendedSerializer(users, many=True)