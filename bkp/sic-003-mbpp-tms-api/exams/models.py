from __future__ import unicode_literals 
import uuid 
from django.db import models
from django.utils.formats import get_format

from django.contrib.gis.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
#from mbpp_api_tms_pn.helpers import PathAndRename

from users.models import CustomUser

class Exam(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    title = models.CharField(max_length=100, default='NA')
    exam_code = models.CharField(max_length=100, default='NA')
    max_participant = models.IntegerField(default=0)
    venue = models.CharField(max_length=100, default='NA')
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    start_time = models.TimeField(null=True)
    end_time = models.TimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class ExamApplication(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    exam_code = models.CharField(max_length=100, default='NA')
    applicant_staff_id = models.CharField(max_length=100, default='NA')
    current_position_appoint_date = models.DateTimeField(null=True)
    current_position_promotion_date = models.DateTimeField(null=True)  

    CURRENT_APPOINT_TYPE = [
        ('LT', 'Lantikan Terus'),
        ('KP', 'Kenaikan Pangkat Secara Latihan'),
        ('OT', 'Lain-Lain')
    ]

    current_appoint_type = models.CharField(max_length=2, choices=CURRENT_APPOINT_TYPE, default='OT')

    STATUS_TYPE = [
        ('PJ', 'Hantar Ke Penyelaras Jabatan'),
        ('PN', 'Hantar ke Pengarah Jabatan'),
        ('PL', 'Hantar Ke Penyelaras Latihan'),
        ('DD', 'Diterima'),
        ('TT', 'Ditolak'),
        ('NA', '-')
    ]

    status_type = models.CharField(max_length=2, choices=STATUS_TYPE, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

class ExamAttendance(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    check_in = models.DateTimeField(null=True)
    check_out = models.DateTimeField(null=True)
    exam_code = models.ForeignKey(Exam, on_delete=models.CASCADE, null=True)
    attendee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='exam_attendee')
    verified_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='exam_verified_by')

class ExamResult(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    exam_code = models.CharField(max_length=10, default='NA')
    staff_id = models.CharField(max_length=10, default='NA')
    result = models.CharField(max_length=10, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class ExamAbsence(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    staff_id = models.CharField(max_length=10, default='NA')
    exam_code = models.CharField(max_length=10, default='NA')
    reason = models.CharField(max_length=10, default='NA')
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='absence_approved_by')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

class ExamEvent(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)   
    action = models.CharField(max_length=100, default='NA')
    action_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='exam_event_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
