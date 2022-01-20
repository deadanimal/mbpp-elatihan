import json
import time
import pytz
import datetime
import uuid

from django.http import JsonResponse
from django.shortcuts import render
from django.db.models import Q, Count
from django.utils import timezone
from core.utils import get_departments, get_training_durations

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
        permission_classes = [IsAuthenticated]  # [IsAuthenticated]
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

        serializer = ContentEvaluationExtendedSerializer(
            evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluations = ContentEvaluation.objects.filter(
            training__id=request_training_
        )

        serializer = ContentEvaluationExtendedSerializer(
            evaluations, many=True)
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

        serializer = ContentEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_chart_24(self, request, *args, **kwargs):

        request_ = json.loads(request.body)

        querysetcontent = ContentEvaluation.objects.filter(evaluation__training=request_['training']).aggregate(
                    five=Count('content', filter=Q(content=5)),
                    four=Count('content', filter=Q(content=4)),
                    three=Count('content', filter=Q(content=3)),
                    two=Count('content', filter=Q(content=2)),
                    one=Count('content', filter=Q(content=1)),
                )

        querysetpresentation = ContentEvaluation.objects.filter(evaluation__training=request_['training']).aggregate(
                    five=Count('presentation', filter=Q(presentation=5)),
                    four=Count('presentation', filter=Q(presentation=4)),
                    three=Count('presentation', filter=Q(presentation=3)),
                    two=Count('presentation', filter=Q(presentation=2)),
                    one=Count('presentation', filter=Q(presentation=1)),
                )

        querysetrelevance = ContentEvaluation.objects.filter(evaluation__training=request_['training']).aggregate(
                    five=Count('relevance', filter=Q(relevance=5)),
                    four=Count('relevance', filter=Q(relevance=4)),
                    three=Count('relevance', filter=Q(relevance=3)),
                    two=Count('relevance', filter=Q(relevance=2)),
                    one=Count('relevance', filter=Q(relevance=1)),
                )

        queryset = {
            'soalanisikandungan': querysetcontent,
            'soalanpersembahan': querysetpresentation,
            'soalankaitan': querysetrelevance
        }

        return Response(queryset)


class ExternalEvaluationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = ExternalEvaluation.objects.all()
    serializer_class = ExternalEvaluationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training',
        'attendee'
    ]

    def get_permissions(self):
        permission_classes = [AllowAny]  # [IsAuthenticated]
        # """
        if self.action == 'generate_evaluation':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]
        # """
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        user = self.request.user
        queryset = ExternalEvaluation.objects.all()
        return queryset

    @action(methods=['GET'], detail=True)
    def extended(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()

        serializer = ExternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = ExternalEvaluation.objects.all()

        serializer = ExternalEvaluationExtendedSerializer(
            evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_self(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = ExternalEvaluation.objects.filter(
            attendee=user
        )

        serializer = ExternalEvaluationExtendedSerializer(
            evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluations = ExternalEvaluation.objects.filter(
            training__id=request_training_
        )

        serializer = ExternalEvaluationExtendedSerializer(
            evaluations, many=True)
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

        serializer = ExternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def approve(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.approved_by = user
        evaluation.save()

        serializer = ExternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def verify(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.verified_by = user
        evaluation.save()

        serializer = ExternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_chart_2(self, request, *args, **kwargs):

        request_ = json.loads(request.body)

        queryset = ExternalEvaluation.objects.filter(training=request_['training']).aggregate(
                    three=Count('answer_9', filter=Q(answer_9=3)),
                    two=Count('answer_9', filter=Q(answer_9=2)),
                    one=Count('answer_9', filter=Q(answer_9=1)),
                )

        return Response(queryset)
    
    @action(methods=['GET'], detail=True)
    def generate_evaluation(self, request, *args, **kwargs):

        evaluation = self.get_object()

        items = {
            'participant': {
                'full_name': evaluation.attendee.full_name,
                'place': '',
                'position': evaluation.attendee.position,
                'department': get_departments(evaluation.attendee.department_code)
            },
            'training': {
                'title': evaluation.training.title,
                'full_date': evaluation.training.start_date.strftime("%d %B %Y") +' - '+ evaluation.training.end_date.strftime("%d %B %Y"),
                'duration': get_training_durations('string', evaluation.training.start_date, evaluation.training.start_time, evaluation.training.end_date, evaluation.training.end_time),
                'venue': evaluation.training.venue,
                'organiser': evaluation.training.organiser.name,
                'sponsor_expenses': ''
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

        html_string = render_to_string(
            'report/external_evaluation.html', {'data': items})
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_file = html.write_pdf(
            stylesheets=[CSS(settings.STATIC_ROOT + '/css/bootstrap.css')])

        # Creating http response
        filename = 'Laporan_Penilaian_Dan_Keberkesanan_Kursus_Luar.pdf'
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="'+filename+'"'
        response['Content-Transfer-Encoding'] = 'binary'
        # with tempfile.NamedTemporaryFile(delete=True) as output:
        #     output.write(result)
        #     output.flush()
        #     output = open(output.name, 'rb')
        #     response.write(output.read())

        return response

    @action(methods=['POST'], detail=False)
    def generate_bulk(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']

        evaluations = ExternalEvaluation.objects.filter(training=request_training_, training__organiser_type='LL', evaluation__isnull=True)

        for evaluation in evaluations:
            attendee = CustomUser.objects.get(id=evaluation.attendee.id)

            items = {
                'participant': {
                    'full_name': evaluation.attendee.full_name,
                    'place': '',
                    'position': evaluation.attendee.position,
                    'department': get_departments(evaluation.attendee.department_code)
                },
                'training': {
                    'title': evaluation.training.title,
                    'full_date': evaluation.training.start_date.strftime("%d %B %Y") +' - '+ evaluation.training.end_date.strftime("%d %B %Y"),
                    'duration': get_training_durations('string', evaluation.training.start_date, evaluation.training.start_time, evaluation.training.end_date, evaluation.training.end_time),
                    'venue': evaluation.training.venue,
                    'organiser': evaluation.training.organiser.name,
                    'sponsor_expenses': ''
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

            html_string = render_to_string(
                'report/external_evaluation.html', {'data': items})
            html = HTML(string=html_string, base_url=request.build_absolute_uri())
            pdf_file = html.write_pdf(stylesheets=[CSS(settings.STATIC_ROOT + '/css/bootstrap.css')])
            file_path = 'evaluations/external/Laporan_Penilaian_Dan_Keberkesanan_Kursus_Luar' + '-' + attendee.nric + '.pdf'
            saved_file = default_storage.save(
                file_path,
                ContentFile(pdf_file)
            )
            full_url_path = saved_file

            external_evaluation = ExternalEvaluation.objects.get(id=evaluation.id)
            external_evaluation.generated_by = user
            external_evaluation.evaluation = full_url_path
            external_evaluation.save()

        evaluations = ExternalEvaluation.objects.filter(training=request_training_)

        serializer = ExternalEvaluationExtendedSerializer(evaluations, many=True)
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
        permission_classes = [AllowAny]  # [IsAuthenticated]
        # """
        if self.action == 'generate_evaluation':
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

        serializer = InternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def extended_all(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = InternalEvaluation.objects.all()

        serializer = InternalEvaluationExtendedSerializer(
            evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def get_self(self, request, *args, **kwargs):

        user = self.request.user
        evaluations = InternalEvaluation.objects.filter(
            attendee=user
        )

        serializer = InternalEvaluationExtendedSerializer(
            evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_training(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        evaluations = InternalEvaluation.objects.filter(
            training__id=request_training_
        )

        serializer = InternalEvaluationExtendedSerializer(
            evaluations, many=True)
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

        serializer = InternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def approve(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.approved_by = user
        evaluation.save()

        serializer = InternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def verify(self, request, *args, **kwargs):

        user = self.request.user
        evaluation = self.get_object()
        evaluation.verified_by = user
        evaluation.save()

        serializer = InternalEvaluationExtendedSerializer(
            evaluation, many=False)
        return Response(serializer.data)

    @action(methods=['GET'], detail=True)
    def generate_evaluation(self, request, *args, **kwargs):

        evaluation = self.get_object()
        content_evaluation = ContentEvaluation.objects.filter(
            evaluation=evaluation.id).values()

        contents = []
        for data in content_evaluation:
            contents.append({
                "topic_trainer": data['topic_trainer'],
                "content": data['content'],
                "presentation": data['presentation'],
                "relevance": data['relevance'],
            })

        items = {
            'training': {
                'title': evaluation.training.title,
                'full_date': evaluation.training.start_date.strftime("%d %B %Y"),
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
                'eight': evaluation.answer_8,
                'nine': evaluation.answer_9
            },
            'contents': contents
        }

        html_string = render_to_string(
            'report/internal_evaluation.html', {'data': items})
        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_file = html.write_pdf(
            stylesheets=[CSS(settings.STATIC_ROOT + '/css/bootstrap.css')])

        # Creating http response
        filename = 'Borang_Penilaian_Kursus_Dalaman.pdf'
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="'+filename+'"'
        response['Content-Transfer-Encoding'] = 'binary'
        # with tempfile.NamedTemporaryFile(delete=True) as output:
        #     output.write(result)
        #     output.flush()
        #     output = open(output.name, 'rb')
        #     response.write(output.read())

        return response

    @action(methods=['POST'], detail=False)
    def generate_bulk(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']

        evaluations = InternalEvaluation.objects.filter(training=request_training_, training__organiser_type='DD', evaluation__isnull=True)

        for evaluation in evaluations:
            attendee = CustomUser.objects.get(id=evaluation.attendee.id)
            content_evaluation = ContentEvaluation.objects.filter(evaluation=evaluation.id).values()

            contents = []
            for data in content_evaluation:
                contents.append({
                    "topic_trainer": data['topic_trainer'],
                    "content": data['content'],
                    "presentation": data['presentation'],
                    "relevance": data['relevance'],
                })

            items = {
                'training': {
                    'title': evaluation.training.title,
                    'full_date': evaluation.training.start_date.strftime("%d %B %Y"),
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
                    'eight': evaluation.answer_8,
                    'nine': evaluation.answer_9
                },
                'contents': contents
            }

            html_string = render_to_string(
                'report/internal_evaluation.html', {'data': items})
            html = HTML(string=html_string, base_url=request.build_absolute_uri())
            pdf_file = html.write_pdf(stylesheets=[CSS(settings.STATIC_ROOT + '/css/bootstrap.css')])
            file_path = 'evaluations/external/Borang_Penilaian_Kursus_Dalaman' + '-' + attendee.nric + '.pdf'
            saved_file = default_storage.save(
                file_path,
                ContentFile(pdf_file)
            )
            full_url_path = saved_file

            internal_evaluation = InternalEvaluation.objects.get(id=evaluation.id)
            internal_evaluation.generated_by = user
            internal_evaluation.evaluation = full_url_path
            internal_evaluation.save()

        evaluations = InternalEvaluation.objects.filter(training=request_training_)

        serializer = InternalEvaluationExtendedSerializer(evaluations, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def get_chart_21(self, request, *args, **kwargs):

        request_ = json.loads(request.body)

        queryset = InternalEvaluation.objects.filter(training=request_['training']).aggregate(
                    five=Count('answer_1', filter=Q(answer_1=5)),
                    four=Count('answer_1', filter=Q(answer_1=4)),
                    three=Count('answer_1', filter=Q(answer_1=3)),
                    two=Count('answer_1', filter=Q(answer_1=2)),
                    one=Count('answer_1', filter=Q(answer_1=1)),
                )

        return Response(queryset)

    @action(methods=['POST'], detail=False)
    def get_chart_22(self, request, *args, **kwargs):

        request_ = json.loads(request.body)

        queryset2 = InternalEvaluation.objects.filter(training=request_['training']).aggregate(
                    three=Count('answer_2', filter=Q(answer_2=3)),
                    two=Count('answer_2', filter=Q(answer_2=2)),
                    one=Count('answer_2', filter=Q(answer_2=1)),
                )

        queryset3 = InternalEvaluation.objects.filter(training=request_['training']).aggregate(
                    three=Count('answer_3', filter=Q(answer_3=3)),
                    two=Count('answer_3', filter=Q(answer_3=2)),
                    one=Count('answer_3', filter=Q(answer_3=1)),
                )

        queryset = {
            'soalan2': queryset2,
            'soalan3': queryset3
        }

        return Response(queryset)

    @action(methods=['POST'], detail=False)
    def get_chart_23(self, request, *args, **kwargs):

        request_ = json.loads(request.body)

        queryset4a = InternalEvaluation.objects.filter(training=request_['training']).aggregate(
                    five=Count('answer_4', filter=Q(answer_4=5)),
                    four=Count('answer_4', filter=Q(answer_4=4)),
                    three=Count('answer_4', filter=Q(answer_4=3)),
                    two=Count('answer_4', filter=Q(answer_4=2)),
                    one=Count('answer_4', filter=Q(answer_4=1)),
                )

        queryset4b = InternalEvaluation.objects.filter(training=request_['training']).aggregate(
                    five=Count('answer_5', filter=Q(answer_5=5)),
                    four=Count('answer_5', filter=Q(answer_5=4)),
                    three=Count('answer_5', filter=Q(answer_5=3)),
                    two=Count('answer_5', filter=Q(answer_5=2)),
                    one=Count('answer_5', filter=Q(answer_5=1)),
                )

        queryset4c = InternalEvaluation.objects.filter(training=request_['training']).aggregate(
                    five=Count('answer_6', filter=Q(answer_6=5)),
                    four=Count('answer_6', filter=Q(answer_6=4)),
                    three=Count('answer_6', filter=Q(answer_6=3)),
                    two=Count('answer_6', filter=Q(answer_6=2)),
                    one=Count('answer_6', filter=Q(answer_6=1)),
                )

        queryset = {
            'soalan4a': queryset4a,
            'soalan4b': queryset4b,
            'soalan4c': queryset4c
        }

        return Response(queryset)


class CertificateViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Certificate.objects.all()
    serializer_class = CertificateSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = [
        'training',
        'attendee',
        'created_at'
    ]

    def get_permissions(self):
        permission_classes = [AllowAny]  # [IsAuthenticated]
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
            data_ = {
                'name': attendee,
                'training_name': training.title,
                'start_date': training.start_date,
                'end_date': training.end_date,
                'venue': training.venue
            }

            html_string = render_to_string(
                'cert/cert.html',
                {'data': data_}
            )
            print("html string", html_string)
            
            html = HTML(string=html_string, base_url=request.build_absolute_uri())
            pdf_file = html.write_pdf(stylesheets=[CSS(settings.STATIC_ROOT + '/css/bootstrap.css')])
            file_path = 'certificates/Sijil' + '-' + training.course_code + '-' \
                + attendee.nric + '.pdf'
                
            # # TEST
            #    # Creating http response
            # filename = 'Sijil-Kursus-' + datetime.datetime.utcnow().strftime("%s") + "-" + uuid.uuid4().hex + '.pdf'
            # response = HttpResponse(pdf_file, content_type='application/pdf')
            # response['Content-Disposition'] = 'attachment; filename="'+filename+'"'
            # response['Content-Transfer-Encoding'] = 'binary'
            # return response
            # # TEST END
            
            saved_file = default_storage.save(
                file_path,
                ContentFile(pdf_file)
            )
            full_url_path = saved_file

            queryset = Certificate.objects.filter(training=request_training_, attendee=request_attendee_)

            if not queryset:
                certificate = Certificate.objects.create(
                    training=training,
                    attendee=attendee,
                    generated_by=user,
                    cert=full_url_path
                )

        certificates = Certificate.objects.filter(training=training)

        serializer = CertificateExtendedSerializer(certificates, many=True)
        return Response(serializer.data)

    @action(methods=['POST'], detail=False)
    def generate_pdf(self, request, *args, **kwargs):

        user = self.request.user
        request_ = json.loads(request.body)
        request_training_ = request_['training']
        request_attendee_ = request_['attendees']

        training = Training.objects.get(id=request_training_)
        attendee = CustomUser.objects.get(id=request_attendee_)

        # Start certificate generation
        data_ = {
            'name': attendee,
            'training_name': training.title,
            'start_date': training.start_date,
            'end_date': training.end_date,
            'venue': training.venue
        }

        html_string = render_to_string(
            'cert/cert.html',
            {'data': data_}
        )

        html = HTML(string=html_string, base_url=request.build_absolute_uri())
        pdf_file = html.write_pdf(stylesheets=[CSS(settings.STATIC_ROOT + '/css/bootstrap.css')])
        
        # Creating http response
        filename = 'Sijil-Kursus-' + datetime.datetime.utcnow().strftime("%s") + "-" + uuid.uuid4().hex + '.pdf'
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="'+filename+'"'
        response['Content-Transfer-Encoding'] = 'binary'
        # with tempfile.NamedTemporaryFile(delete=True) as output:
        #     output.write(result)
        #     output.flush()
        #     output = open(output.name, 'rb')
        #     response.write(output.read())

        return response
