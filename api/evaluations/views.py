import json
import time
import pytz
import datetime
import uuid

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

from django.template.loader import render_to_string
from weasyprint import HTML, CSS
from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings

from .models import (
    ContentEvaluation,
    ExternalEvaluation,
    InternalEvaluation,
    Certificate
)

from .serializers import (
    ContentEvaluationSerializer,
    ExternalEvaluationSerializer,
    InternalEvaluationSerializer,
    CertificateSerializer,
    ContentEvaluationExtendedSerializer,
    ExternalEvaluationExtendedSerializer,
    InternalEvaluationExtendedSerializer,
    CertificateExtendedSerializer
)

from trainings.models import (
    Training
)

from users.models import (
    CustomUser
)

class ContentEvaluationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ContentEvaluation.objects.all()
    serializer_class = ContentEvaluationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'evaluation',
        'created_at'
    ]

    def get_permissions(self):
        permission_classes = [IsAuthenticated]#[IsAuthenticated]
        # """
        if self.action == 'generate_evaluation':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        # """
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        queryset = ContentEvaluation.objects.all()
        return queryset  
    
    @action(methods=['POST'], detail=False)
    def get_self(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = ContentEvaluation.objects.filter(
            evaluation__attendee=user
        )

        serializer = ContentEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluations = ContentEvaluation.objects.filter(
            training__id=request_training_
        )

        serializer = ContentEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training_self(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluation = ContentEvaluation.objects.get(
            training__id=request_training_,
            evaluation__training__attendee=user
        )

        serializer = ContentEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)


class ExternalEvaluationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExternalEvaluation.objects.all()
    serializer_class = ExternalEvaluationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training',
        'attendee'
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
        queryset = ExternalEvaluation.objects.all()
        return queryset
    
    @action(methods=['GET'], detail=True)
    def extended(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()

        serializer = ExternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)

    
    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = ExternalEvaluation.objects.all()

        serializer = ExternalEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)
    

    @action(methods=['POST'], detail=False)
    def get_self(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = ExternalEvaluation.objects.filter(
            attendee=user
        )

        serializer = ExternalEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)
    
    @action(methods=['POST'], detail=False)
    def get_training(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluations = ExternalEvaluation.objects.filter(
            training__id=request_training_
        )

        serializer = ExternalEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)
    
    @action(methods=['POST'], detail=False)
    def get_training_self(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluation = ExternalEvaluation.objects.get(
            training__id=request_training_,
            attendee=user
        )

        serializer = ExternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def approve(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.approved_by = user
        evaluation.save()

        serializer = ExternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def verify(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.verified_by = user
        evaluation.save()

        serializer = ExternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)


class InternalEvaluationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = InternalEvaluation.objects.all()
    serializer_class = InternalEvaluationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training',
        'attendee'
    ]

    def get_permissions(self):
        permission_classes = [IsAuthenticated]#[IsAuthenticated]
        # """
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]
        # """
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        queryset = InternalEvaluation.objects.all()
        return queryset  
    

    @action(methods=['GET'], detail=True)
    def extended(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()

        serializer = InternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)

    
    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = InternalEvaluation.objects.all()

        serializer = InternalEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=False)
    def get_self(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = InternalEvaluation.objects.filter(
            attendee=user
        )

        serializer = InternalEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)
    
    @action(methods=['POST'], detail=False)
    def get_training(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluations = InternalEvaluation.objects.filter(
            training__id=request_training_
        )

        serializer = InternalEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training_self(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluation = InternalEvaluation.objects.get(
            training__id=request_training_,
            attendee=user
        )

        serializer = InternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def approve(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.approved_by = user
        evaluation.save()

        serializer = InternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def verify(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.verified_by = user
        evaluation.save()

        serializer = InternalEvaluationExtendedSerializer(evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def generate_evaluation(self, request, *args, **kwargs):

        evaluation = self.get_object()

        items = {
            'training': {
                'title': evaluation.training.title,
                'full_date': '',
                'venue': evaluation.training.venue
            },
            'evaluation': {
                'one': evaluation.answer_1,
                'two': evaluation.answer_2,
                'three': evaluation.answer_3,
                'four': evaluation.answer_4,
                'five': evaluation.answer_5,
                'six': evaluation.answer_6,
                'seven': evaluation.answer_7,
                'eight': evaluation.answer_8
            }
        }

        html_string = render_to_string('report/internal_evaluation.html', {'data': items})
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


class CertificateViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'evaluation',
        'created_at'
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
        queryset = Certificate.objects.all()
        return queryset  
    
    @action(methods=['GET'], detail=False)
    def get_self(self, request, *args, **kwargs):

        user = self.request.user
        certicates = Certificate.objects.filter(
            certicate__attendee=user
        )

        serializer = CertificateExtendedSerializer(certicates, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        certificates = Certificate.objects.filter(
            training__id=request_training_
        )

        serializer = CertificateExtendedSerializer(certificates, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training_self(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        certificate = Certificate.objects.get(
            training__id=request_training_,
            certificate__training__attendee=user
        )

        serializer = CertificateExtendedSerializer(certificate, many=False)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def generate_bulk(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        request_attendees_ = request_['attendees']

        training = Training.objects.get(id=request_training_)

        for request_attendee_ in request_attendees_:
            attendee = CustomUser.objects.get(id=request_attendee_)

            # Start certificate generation
            css_file = 'https://pipeline-project.sgp1.digitaloceanspaces.com/mbpp-elatihan/css/template.css'
            data_ = {
                'name': 'name',
                'training_name': 'name',
                'start_date': 'start_date',
                'end_date': 'end_date'
            }

            html_string = render_to_string(
                'cert/cert.html', 
                { 'data': data_ }
            )
            html = HTML(string=html_string)
            pdf_file = html.write_pdf(stylesheets=[CSS(css_file)])
            file_path = 'mbpp-elatihan/certificates/Sijil' + '-' + training.course_code + '-' \
                + attendee.nric + '.pdf'
            saved_file = default_storage.save(
                file_path,
                ContentFile(pdf_file)
            )
            full_url_path = settings.MEDIA_ROOT + saved_file

            certificate = Certificate.objects.create(
                training=training,
                attendee=attendee,
                generated_by=user,
                cert=full_url_path
            )
        
        certificates = Certificate.objects.filter(training=training)

        serializer = CertificateExtendedSerializer(certificates, many=True)
        return Response(serializer.data)