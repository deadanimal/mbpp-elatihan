from __future__ import unicode_literals 
import uuid
from django.db import models
from django.utils.formats import get_format

from django.contrib.gis.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from mbpp_tms_api.helpers import PathAndRename

from users.models import CustomUser
from organisations.models import Organisation

class Training(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    title = models.CharField(max_length=100, default='NA') #
    description = models.CharField(max_length=100, default='NA') #
    
    ORGANISER_TYPE = [
        ('LL', 'Luaran'),
        ('DD', 'Dalaman'),
        ('OT', 'Lain-Lain')
    ]

    organiser_type = models.CharField(max_length=2, choices=ORGANISER_TYPE, default='OT') #

    COURSE_TYPE = [
        ('KK', 'Kursus'),
        ('PP', 'Persidangan'),
        ('SS', 'Seminar'),
        ('BB', 'Bengkel'),
        ('LK', 'Lawatan Kerja'),
        ('TT', 'Taklimat'),
        ('SP', 'Sesi Perjumpaan'),
        ('OT', 'Lain-Lain')
    ]
    
    course_type = models.CharField(max_length=2, choices=COURSE_TYPE, default='OT') #
    category = models.CharField(max_length=100, default="-") #
    course_code = models.CharField(max_length=100, default='NA') #

    TARGET_GROUP_TYPE = [
        ('TB', 'Terbuka'),
        ('TH', 'Terhad')
    ]
    target_group_type = models.CharField(max_length=2, choices=TARGET_GROUP_TYPE, default='TB') #

    TARGET_GROUP = [
        ('GD', 'Gred'),
        ('JB', 'Jabatan'),
        ('JW', 'Jawatan'),
        ('SM', 'Semua'),
        ('SP', 'Skim Perkhidmatan')
    ]

    target_group = models.CharField(max_length=2, choices=TARGET_GROUP, default='SM') #
    
    DEPARTMENT_TYPE = [
        ('KA', 'Kawalan Bangunan'),
        ('KN', 'Kejuruteraan'),
        ('KK', 'Kesihatan, Persekitaraan dan Pelesenan'),
        ('PB', 'Perbendaharaan'),
        ('PP', 'Penilaian dan Pengurusan Harta'),
        ('UU', 'Undang-undang'),
        ('KP', 'Khidmat Pengurusan'),
        ('KM', 'Khidmat Kemasyarakatan'),
        ('KW', 'Konservasi Warisan'),
        ('PB', 'Pesuruhjaya Bangunan'),
        ('PG', 'Penguatkuasaan'),
        ('PN', 'Perkhidmatan Perbandaran'),
        ('LL', 'Landskap'),
        ('BP', 'Bahagian Pelesenan'),
        ('UD', 'Unit Audit Dalaman'),
        ('UO', 'Unit OSC'),
        ('OT', 'Other')
    ]

    department_type = models.CharField(max_length=2, choices=DEPARTMENT_TYPE, default='OT') #
    organiser = models.CharField(max_length=50, null=True, default='NA') #
    max_participant = models.IntegerField(default=0) #
    venue = models.CharField(max_length=50, null=True, default='NA') #
    address = models.CharField(max_length=50, null=True, default='NA') #
    start_date = models.DateField(null=True) #
    end_date = models.DateField(null=True) #
    start_time = models.TimeField(null=True) #
    end_time = models.TimeField(null=True) #
    cost = models.IntegerField(default=0) #
    duration = models.IntegerField(default=0) #

    STATUS_TYPE = [
        ('DB','Dibuka'),
        ('DT','Ditutup'),
        ('PN','Penuh'),
        ('TN','Tangguh'),
        ('OT','Lain-lain')
    ]

    status_type = models.CharField(max_length=2, choices=STATUS_TYPE, default='OT') #
    speaker = models.CharField(max_length=100, null=True, default='NA') # #
    agency = models.CharField(max_length=100, null=True, default='NA') # #
    fasilitator = models.CharField(max_length=100, null=True, default='NA') # #

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class TrainingCode(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    course_code = models.CharField(max_length=50, null=True, default='NA')
    code = models.CharField(max_length=70, null=True, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']
    
class TrainingAttendance(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    check_in = models.DateTimeField(null=True)
    check_out = models.DateTimeField(null=True)
    training = models.ForeignKey(Training, on_delete=models.CASCADE, null=True)
    attendee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='attendance_attendee')
    verified_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='attendance_verified_by')

  #  def __str__(self):
   #     return self.name

class TrainingAbsence(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    staff_id = models.CharField(max_length=10, default='NA')
    course_code = models.CharField(max_length=10, default='NA')
    reason = models.CharField(max_length=10, default='NA')
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='trainingabsence_approved_by')        
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

class TrainingApplication(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    course_code = models.CharField(max_length=10, default='NA')
    applicant_staff_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='application_staff_id')
    department_coordinator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='application_department_coordinator')
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,null=True, related_name='application_approved_by')

    STATUS_TYPE = [
        ('PJ', 'Hantar Ke Penyelaras Jabatan'),
        ('PN', 'Hantar ke Pengarah Jabatan'),
        ('PL', 'Hantar Ke Penyelaras Latihan'),
        ('DD', 'Diterima'),
        ('TT', 'Ditolak'),
        ('NA', '-')
    ]

    status_type = models.CharField(max_length=2, choices=STATUS_TYPE, default='NA')
    comment = models.CharField(blank=True, max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

class TrainingNeedQuestion(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    question = models.CharField(max_length=100, default='NA')
    question_type = models.CharField(max_length=100, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.question

class TrainingNeedAnswer(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    question_id = models.CharField(max_length=100, default='NA')
    answered_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='answer_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

class TrainingNote(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    course_code = models.CharField(max_length=10, default='NA')
    title = models.CharField(max_length=10, default='NA')
    note_code = models.CharField(max_length=10, default='NA')
    note_file = models.ImageField(null=True, upload_to=PathAndRename('notes'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class TrainingAssessmentQuestion(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    assessment_type = models.CharField(max_length=100, default='NA')
    assessment_question = models.CharField(max_length=100, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.assessment_question

class TrainingAssessmentAnswer(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    assessment_type = models.CharField(max_length=100, default='NA')
    answer = models.CharField(max_length=100, default='NA')
    answered_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='comment_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
  
   # def __str__(self):
   #     return self.name

class TrainingEvent(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    action = models.CharField(max_length=100, default='NA')
    action_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='training_event_by')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['-created_at']

class TrainingCodeGroup(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    group_name = models.CharField(max_length=100, default='NA')
    group_code = models.CharField(max_length=100, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)
    
    class Meta:
        ordering = ['group_code']

    def __str__(self):
        return (self.group_code + ' ' + self.group_name)

class TrainingCodeClass(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    group_id = models.ForeignKey(TrainingCodeGroup, on_delete=models.CASCADE, null=True, related_name='group_id')
    class_name = models.CharField(max_length=100, default='NA')
    class_code = models.CharField(max_length=100, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['class_code']

    def __str__(self):
        return (self.class_code + ' ' + self.class_name)

class TrainingCodeCategory(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    class_id = models.ForeignKey(TrainingCodeClass, on_delete=models.CASCADE, null=True, related_name='class_id')
    category_name = models.CharField(max_length=100, default='NA')
    category_code = models.CharField(max_length=100, default='NA')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(null=True)

    class Meta:
        ordering = ['category_code']

    def __str__(self):
        return (self.category_code + ' ' + self.category_name)