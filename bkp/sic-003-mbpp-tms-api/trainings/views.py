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
    Training,
    TrainingCode,
    TrainingAttendance,
    TrainingApplication,
    TrainingAbsence,
    TrainingNeedQuestion,
    TrainingNeedAnswer,
    TrainingNote,
    TrainingAssessmentQuestion,
    TrainingAssessmentAnswer,
    TrainingEvent,
    TrainingCodeGroup,
    TrainingCodeClass,
    TrainingCodeCategory
)

from .serializers import (
    TrainingSerializer,
    TrainingCodeSerializer,
    TrainingAttendanceSerializer,
    TrainingAbsenceSerializer,
    TrainingApplicationSerializer,
    TrainingNeedQuestionSerializer,
    TrainingNeedAnswerSerializer,
    TrainingNoteSerializer,
    TrainingAssessmentQuestionSerializer,
    TrainingAssessmentAnswerSerializer,
    TrainingEventSerializer,
    TrainingCodeGroupSerializer,
    TrainingCodeClassSerializer,
    TrainingCodeCategorySerializer
)

class TrainingViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Training.objects.all()
    serializer_class = TrainingSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['organiser_type', 'course_type', 'target_group', 'department_type', 'status_type']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
       
        queryset = Training.objects.all()
        return queryset   
    #----------------------AUDIT TRAIL-----------------------

    #--------------------------------------------------------

class TrainingCodeViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingCode.objects.all()
    serializer_class = TrainingCodeSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['course_code', 'code', 'created_at', 'updated_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes] 
    
    def get_queryset(self):
        queryset = TrainingCode.objects.all()
        return queryset

class TrainingAttendanceViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAttendance.objects.all()
    serializer_class = TrainingAttendanceSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = []

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingAttendance.objects.all()
        return queryset
    #-----------------------ATTENDANT CHECK-------------------

    @action(detail=True, methods=['post'])

    def new_attendance(self,request,pk=None):
        TrainingAttendance=self.get_object.all()
        serializer = TrainingAttendanceSerializer(data=reques.data)
        if serializer.is_valid():
            TrainingAttendance.get_attendance(serializer.data['New attendance'])
            TrainingAttendance.save()
            return Response({'status':'Attendance set'})
        else:
            return Response(serializer.errors,
                              status=status.HTTP_400_BAD_REQUEST)

    #----------------------------------------------------------         
  
    #   def create(self, request):
    #       TrainingEvent.objects.create(
    #           action = 'Create training attendance',
    #           action_by = self.request.user
    #       )
    #       return super().create(request)
        
    #   def update(self, request, pk=None):
    #       TrainingEvent.objects.create(
    #           action = 'Update training attendance',
    #           action_by = self.request.user
    #       )
    #       return super().update(request)  
    
    #--------------------------REPORT---------------------------
    #    def generate_attendance_report(request):
    #        queryset = TrainingAttendance.objects.all()
    #        params = {
    #                'training-attendance': TrainingAttendance,
    #                'request': request,
    #        }
    #        return Render.render('pdf.html',params)

    @action(detail=True, methods=['post'])

    def generate_attendance_report(self,request,pk=None):
        TrainingAttendance=self.get_object.all()
        serializer = TrainingAttendanceSerializer(data=reques.data)
        if serializer.is_valid():
            TrainingAttendance.get_attendance(serializer.data['report'])
            TrainingAttendance.save()
            return Response({'status':'report generate'})
        else :
            return Response(serializer.errors,
                              status=status.HTTP_400_BAD_REQUEST)

    #------------------------------------------------------------

class TrainingAbsenceViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAbsence.objects.all()
    serializer_class = TrainingAbsenceSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['approved_by', 'created_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = TrainingAbsence.objects.all()
        return queryset 

class TrainingApplicationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingApplication.objects.all()
    serializer_class = TrainingApplicationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['status_type', 'updated_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingApplication.objects.all()
        return queryset

class TrainingNeedQuestionViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingNeedQuestion.objects.all()
    serializer_class = TrainingNeedQuestionSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['question_type', 'created_at', 'updated_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingNeedQuestion.objects.all()
        return queryset 

class TrainingNeedAnswerViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingNeedAnswer.objects.all()
    serializer_class = TrainingNeedAnswerSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingNeedAnswer.objects.all()
        return queryset 

class TrainingNoteViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingNote.objects.all()
    serializer_class = TrainingNoteSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at', 'updated_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingNote.objects.all()
        return queryset

class TrainingAssessmentQuestionViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAssessmentQuestion.objects.all()
    serializer_class = TrainingAssessmentQuestionSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['assessment_type', 'created_at', 'updated_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingAssessmentQuestion.objects.all()
        return queryset

class TrainingAssessmentAnswerViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingAssessmentAnswer.objects.all()
    serializer_class = TrainingAssessmentAnswerSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['assessment_type', 'answered_by', 'created_at']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingAssessmentAnswer.objects.all()
        return queryset

class TrainingEventViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingEvent.objects.all()
    serializer_class = TrainingEventSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at', 'updated_at', 'action_by', 'action']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingEvent.objects.all()
        return queryset

class TrainingCodeGroupViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingCodeGroup.objects.all()
    serializer_class = TrainingCodeGroupSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at', 'updated_at', 'group_code']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingCodeGroup.objects.all()
        return queryset

class TrainingCodeClassViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingCodeClass.objects.all()
    serializer_class = TrainingCodeClassSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at', 'updated_at', 'group_id']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingCodeClass.objects.all()
        return queryset

class TrainingCodeCategoryViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = TrainingCodeCategory.objects.all()
    serializer_class = TrainingCodeCategorySerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    filterset_fields = ['created_at', 'updated_at', 'class_id']

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = TrainingCodeCategory.objects.all()
        return queryset
