from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        token['user_type'] = user.user_type

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


from django.shortcuts import render
from django.db.models import Q

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework import viewsets, status
from rest_framework_extensions.mixins import NestedViewSetMixin

from django_filters.rest_framework import DjangoFilterBackend

import json

from .models import (
    CustomUser,
    SecurityQuestion,
    SecurityAnswer
)

from .serializers import (
    CustomUserSerializer,
    UserLogSerializer,
    SecurityQuestionSerializer,
    SecurityAnswerSerializer
)

class CustomUserViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)

    def get_permissions(self):
        permission_classes = [AllowAny] #permission_classes = [IsAuthenticated]
        """
        if self.action == 'list':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated]
        """

        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        queryset = CustomUser.objects.all()
        # history(self)
        return queryset
    
    @action(methods=['GET'], detail=False)
    def current_user_detail(self, request, *args, **kwargs):
        
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=True)
    def complete_first_login(self, request, *args, **kwargs):
        user = self.get_object()
        print('User: ', user)
        user.is_first_login = False
        user.save()

        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    
    @action(methods=['GET'], detail=True)
    def history(self, request, *args, **kwargs):
        user = CustomUser.history.all()
        serializer = CustomUserSerializer(user, many=True)
        return Response(serializer.data)


    @action(methods=['POST'], detail=True)
    def update_staff(self, request, *args, **kwargs):
        received_data = json.loads(request.body)
        users = CustomUser.objects.all()
        is_find_last_final = False

        for staff in reversed(received_data):
            while is_find_last_final == False:
                for user in reversed(users):
                    if staff['staff_id'] != user['staff_id']:
                        # add new user
                        break
                    else:
                        is_find_last_final = True
                        break
                if is_find_last_final == True:
                    break

        return Response('Ok')


class UserLogViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserLogSerializer
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
        queryset = CustomUser.history.all()
        return queryset  


class SecurityQuestionViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = SecurityQuestion.objects.all()
    serializer_class = SecurityQuestionSerializer
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
        queryset = SecurityQuestion.objects.all()
        return queryset
    

class SecurityAnswerViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = SecurityAnswer.objects.all()
    serializer_class = SecurityAnswerSerializer
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
        queryset = SecurityAnswer.objects.all()
        return queryset
    
    @action(methods=['POST'], detail=False)
    def get_user_answer(self, request, *args, **kwargs):
        request_ = json.loads(request.body)
        request_user_id_ = request_['user']
        print('testttt')
        answer_ = SecurityAnswer.objects.filter(user=request_user_id_).first()

        serializer = SecurityAnswerSerializer(answer_)
        return Response(serializer.data)
