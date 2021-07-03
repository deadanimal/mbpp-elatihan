import json
import time
import requests

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
from django.core.mail import send_mail

from .models import (
    Organisation
)

from .serializers import (
    OrganisationSerializer
)


class OrganisationViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    # filterset_fields = ['code', 'staff', 'date']

    def get_permissions(self):
        permission_classes = [AllowAny]#[IsAuthenticated]
        """
        if self.action == 'list':
            permission_classes = [AllowAny]
        else:
            permission_classes = [AllowAny]
        """
        return [permission() for permission in permission_classes]    

    
    def get_queryset(self):
        user = self.request.user
        queryset = Organisation.objects.all()
        return queryset  
    
    # @action(methods=['GET'], detail=True)
    # def completed(self, request, *args, **kwargs):
    #     organisation = self.get_object()
    #     organisation.status = 'CM'
    #     organisation.save()

    #     serializer = OrganisationSerializer(organisation)
    #     return Response(serializer.data)
    
    action(methods=['POST'], detail=False)
    def sending_email(self, request, *args, **kwargs):
        
        nric = request.username
        print (nric)
        send_mail('Reset kata laluan pengguna', 'Terdapat pengguna sistem ingin memohan untuk pihak admin menukarkan kata laluan yang sedia ada kepada kata laluan umum.', 'reset-katalaluan-pengguna@mbpp.com', ['raziman@pipeline.com.my'], fail_silently=False)
    
    
    
