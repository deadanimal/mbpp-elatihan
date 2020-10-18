from __future__ import unicode_literals
import uuid

from django.contrib.gis.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

from simple_history.models import HistoricalRecords

from core.helpers import PathAndRename

from users.models import (
    CustomUser
)
from organisations.models import (
    Organisation
)

class Training(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True) # Done
    title = models.CharField(max_length=100, default='NA') # Done
    description = models.CharField(max_length=100, default='NA') # Done

    METHOD = [
        ('BS', 'Bersemuka'),
        ('TB', 'Tidak Bersemuka (online)')
    ]
    method = models.CharField(max_length=2, choices=METHOD, default='BS')
    
    COUNTRY = [
        ('DN', 'Dalam Negara'),
        ('LN', 'Luar Negara')
    ]
    country = models.CharField(max_length=2, choices=COUNTRY, default='DN') # Done
    
    ORGANISER_TYPE = [
        ('LL', 'Luaran'),
        ('DD', 'Dalaman'),
        ('OT', 'Lain-Lain')
    ]

    organiser_type = models.CharField(
        max_length=2,
        choices=ORGANISER_TYPE, 
        default='OT'
    ) # Done
    organiser = models.ForeignKey(
        Organisation, 
        on_delete=models.CASCADE,
        null=True,
        related_name='training_organiser'
    ) # Done

    COURSE_TYPE = [
        ('BB', 'Bengkel'),
        ('KK', 'Kursus'),
        ('LK', 'Lawatan Kerja'),
        ('LT', 'Latihan'),
        ('PG', 'Program'),
        ('PP', 'Persidangan'),
        ('SB', 'Sambutan'),
        ('SP', 'Sesi Perjumpaan'),
        ('SS', 'Seminar'),
        ('TT', 'Taklimat')
    ]
    
    course_type = models.CharField(max_length=2, choices=COURSE_TYPE, default='OT') # Done
    # category = models.CharField(max_length=100, default="-") # Hmm
    course_code = models.CharField(max_length=100, default='NA') # Hmm

    TARGET_GROUP_TYPE = [
        ('TB', 'Terbuka'),
        ('TH', 'Terhad')
    ]
    target_group_type = models.CharField(max_length=2, choices=TARGET_GROUP_TYPE, default='TB') # Done

    is_group_KPP_A = models.BooleanField(default=False) # 48 above
    is_group_KPP_B = models.BooleanField(default=False)  # 44
    is_group_KPP_C = models.BooleanField(default=False)  # 41
    is_group_KP_A = models.BooleanField(default=False)  # 19 - 40
    is_group_KP_B = models.BooleanField(default=False)  # 11 - 18
    is_group_KP_C = models.BooleanField(default=False)  # 1 - 10

    is_department_PDB = models.BooleanField(default=False)  # Pejabat Datuk Bandar
    is_department_UUU = models.BooleanField(default=False)  # Pejabat Datuk Bandar ; Unit Undang-undang
    is_department_UAD = models.BooleanField(default=False)  # Pejabat Datuk Bandar ; Unit Audit Dalam
    is_department_UPP = models.BooleanField(default=False)  # Pejabat Datuk Bandar ; Unit Penyelarasan Pembangunan
    is_department_UPS = models.BooleanField(default=False)  # Pejabat Datuk Bandar ; Unit Pusat Sehenti

    is_department_JKP = models.BooleanField(default=False)  # Jabatan Khidmat Pengurusan /
    is_department_JPD = models.BooleanField(default=False)  # Jabatan Perbendaharaan /
    is_department_JPH = models.BooleanField(default=False)  # Jabatan Penilaian Pengurusan Harta /
    is_department_JPP = models.BooleanField(default=False)  # Jabatan Perancangan Pembangunan /
    is_department_JKJ = models.BooleanField(default=False)  # Jabatan Kejuruteraan /
    is_department_JKB = models.BooleanField(default=False)  # Jabatan Kawalan Bangunan /
    is_department_JKEA = models.BooleanField(default=False)  # Jabatan Kesihatan Persekitaran dan Pelesenan ; Bahagian Kesihatan Awam /
    is_department_JKEB = models.BooleanField(default=False)  # Jabatan Kesihatan Persekitaran dan Pelesenan ; Bahagian Pelesenan /
    is_department_JPR = models.BooleanField(default=False)  # Jabatan Perkhidmatan Perbandaraan /
    is_department_JKK = models.BooleanField(default=False)  # Jabatan Khidmat Kemasyarakatan /
    is_department_JKW = models.BooleanField(default=False)  # Jabatan Konservasi Warisan /
    is_department_JLK = models.BooleanField(default=False)  # Jabatan Lanskap /
    is_department_JPU = models.BooleanField(default=False)  # Jabatan Penguatkuasaan /
    is_department_JPB = models.BooleanField(default=False)  # Jabatan Pesuruhjaya Bangunan /


    # TARGET_GROUP = [
    #     ('KA', 'Kumpulan A'),
    #     ('KB', 'Kumpulan B'),
    #     ('KC', 'Kumpulan C'),
    #     ('KD', 'Kumpulan D'),
    #     ('SM', 'Semua')
    # ]

    # target_group = models.CharField(max_length=2, choices=TARGET_GROUP, default='SM') # Done
    
    # DEPARTMENT_TYPE = [
    #     ('KA', 'Kawalan Bangunan'),
    #     ('KN', 'Kejuruteraan'),
    #     ('KK', 'Kesihatan, Persekitaraan dan Pelesenan'),
    #     ('PB', 'Perbendaharaan'),
    #     ('PP', 'Penilaian dan Pengurusan Harta'),
    #     ('UU', 'Undang-undang'),
    #     ('KP', 'Khidmat Pengurusan'),
    #     ('KM', 'Khidmat Kemasyarakatan'),
    #     ('KW', 'Konservasi Warisan'),
    #     ('PB', 'Pesuruhjaya Bangunan'),
    #     ('PG', 'Penguatkuasaan'),
    #     ('PN', 'Perkhidmatan Perbandaran'),
    #     ('LL', 'Landskap'),
    #     ('BP', 'Bahagian Pelesenan'),
    #     ('UD', 'Unit Audit Dalaman'),
    #     ('UO', 'Unit OSC'),
    #     ('SM', 'Semua')
    # ]

    # department = models.CharField(max_length=2, choices=DEPARTMENT_TYPE, default='SM') # Done
    max_participant = models.IntegerField(default=0) # Done
    venue = models.CharField(max_length=50, null=True, default='NA') # Done
    address = models.CharField(max_length=50, null=True, default='NA') # Done
    start_date = models.DateField(null=True) # Done
    start_time = models.TimeField(null=True) # Done
    end_date = models.DateField(null=True) # Done
    end_time = models.TimeField(null=True) # Done
    cost = models.IntegerField(default=0) # Done
    duration_days = models.IntegerField(default=1) # Done
    transportation = models.BooleanField(default=False)

    STATUS_TYPE = [
        ('DB','Dibuka'),
        ('DT','Ditutup'),
        ('PN','Penuh'),
        ('TN','Tangguh'),
        ('OT','Lain-lain')
    ]

    status = models.CharField(max_length=2, choices=STATUS_TYPE, default='OT') # Done
    speaker = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='training_speaker') # Done
    facilitator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='training_facilitator') # Done
    attachment = models.FileField(null=True, upload_to=PathAndRename('attachments')) # Done

    history = HistoricalRecords()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class TrainingNote(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    training = models.ForeignKey(Training, on_delete=models.CASCADE, null=True)
    title = models.CharField(max_length=50, default='NA')
    note_code = models.CharField(max_length=10, default='NA')
    note_file = models.FileField(null=True, upload_to=PathAndRename('notes'))

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return (self.title)


class TrainingCode(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    # course_code = models.CharField(max_length=50, null=True, default='NA')
    code = models.CharField(max_length=70, null=True, default='NA')

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


class TrainingApplication(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    training = models.ForeignKey(Training, on_delete=models.CASCADE, null=True)
    applicant = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='application_attendee')
    is_approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='application_verified_by')

    APPLICATION_TYPE = [
        ('PS', 'Permohonan Persendirian'),
        ('PP', 'Permohonan Pencalonan')
    ]
    application_type = models.CharField(max_length=2, choices=APPLICATION_TYPE, default='PS')

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.attendee.full_name
    

class TrainingAttendee(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    training = models.ForeignKey(Training, on_delete=models.CASCADE, null=True)
    attendee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='attendee')
    is_attend = models.BooleanField(default=False)
    check_in = models.DateTimeField(null=True)
    check_out = models.DateTimeField(null=True)
    verified_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='attendee_verified_by')

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.attendee.full_name


class TrainingAbsenceMemo(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=True)
    attendee = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='absence_attendee')
    training = models.ForeignKey(Training, on_delete=models.CASCADE, null=True, related_name='absence_training')
    reason = models.TextField(blank=True, null=True)
    verified_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, related_name='absence_verified_by')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.attendee.full_name
