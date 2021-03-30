from __future__ import unicode_literals
import uuid
import pytz
import datetime

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

class TrainingCore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # Done
    CORE_PARENT = [
        ('FN', 'Fungsional'),
        ('GN', 'Generik')
    ]
    parent = models.CharField(max_length=2, choices=CORE_PARENT, default='GN')
    child = models.CharField(max_length=100, default='NA')
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['parent', 'child']

    def __str__(self):
        return ('%s %s'%(self.parent, self.child))

 
class TrainingDomain(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, null=False)
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class TrainingType(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False)
    active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Training(models.Model):
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False) # Done
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

    # COURSE_TYPE = [
    #     ('BB', 'Bengkel'),
    #     ('KK', 'Kursus'),
    #     ('LK', 'Lawatan Kerja'),
    #     ('LT', 'Latihan'),
    #     ('PG', 'Program'),
    #     ('PP', 'Persidangan'),
    #     ('SB', 'Sambutan'),
    #     ('SP', 'Sesi Perjumpaan'),
    #     ('SS', 'Seminar'),
    #     ('TT', 'Taklimat')
    # ]
    
    # course_type = models.CharField(max_length=2, choices=COURSE_TYPE, default='OT') # Done
    # category = models.CharField(max_length=100, default="-") # Hmm

    training_type = models.ForeignKey(
        TrainingType, 
        on_delete=models.CASCADE,
        null=True,
        related_name='training_type'
    )
    core = models.ForeignKey(
        TrainingCore,
        on_delete=models.CASCADE,
        null=True,
        related_name='training_training_core'
    ) # Done
    domain = models.ForeignKey(
        TrainingDomain,
        on_delete=models.CASCADE,
        null=True,
        related_name='training_domain'
    )
    course_code = models.CharField(max_length=100, null=True) # Hmm

    TARGET_GROUP_TYPE = [
        ('TB', 'Terbuka'),
        ('TH', 'Terhad')
    ]
    target_group_type = models.CharField(max_length=2, choices=TARGET_GROUP_TYPE, default='TB') # Done

    is_group_KP_A = models.BooleanField(default=False)  # 19 - 40
    is_group_KP_B = models.BooleanField(default=False)  # 11 - 18
    is_group_KP_C = models.BooleanField(default=False)  # 1 - 10
    is_group_KP_D = models.BooleanField(default=False)  # ~

    is_department_11 = models.BooleanField(default=False)   # JABATAN KHIDMAT PENGURUSAN
    is_department_15 = models.BooleanField(default=False)   # JABATAN PENGUATKUASAAN
    is_department_21 = models.BooleanField(default=False)   # JABATAN PERBENDAHARAAN
    is_department_31 = models.BooleanField(default=False)   # JABATAN KEJURUTERAAN
    is_department_41 = models.BooleanField(default=False)   # JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN
    is_department_45 = models.BooleanField(default=False)   # JABATAN PERKHIDMATAN DAN PERBANDARAAN
    is_department_47 = models.BooleanField(default=False)   # JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN - PELESENAN
    is_department_51 = models.BooleanField(default=False)   # JABATAN KAWALAN BANGUNAN
    is_department_55 = models.BooleanField(default=False)   # JABATAN KONSERVASI WARISAN
    is_department_61 = models.BooleanField(default=False)   # JABATAN PENILAIAN DAN PENGURUSAN HARTA
    is_department_63 = models.BooleanField(default=False)   # JABATAN PESURUHJAYA BANGUNAN
    is_department_71 = models.BooleanField(default=False)   # JABATAN PERANCANGAN PEMBANGUNAN
    is_department_81 = models.BooleanField(default=False)   # JABATAN KHIDMAT KEMASYARAKATAN
    is_department_86 = models.BooleanField(default=False)   # JABATAN LANDSKAP
    is_department_90 = models.BooleanField(default=False)   # PEJABAT DATUK BANDAR
    is_department_91 = models.BooleanField(default=False)   # PEJABAT DATUK BANDAR - UNDANG - UNDANG
    is_department_92 = models.BooleanField(default=False)   # PEJABAT DATUK BANDAR - PENYELARASAN PEMBANGUNAN
    is_department_93 = models.BooleanField(default=False)   # PEJABAT DATUK BANDAR - AUDIT DALAM
    is_department_94 = models.BooleanField(default=False)   # PEJABAT DATUK BANDAR - OSC

    is_position_01 = models.BooleanField(default=False)     # AKAUNTAN
    is_position_02 = models.BooleanField(default=False)     # ARKITEK
    is_position_03 = models.BooleanField(default=False)     # ARKITEK LANDSKAP
    is_position_04 = models.BooleanField(default=False)     # DATUK BANDAR
    is_position_05 = models.BooleanField(default=False)     # JURUAUDIO VISUAL
    is_position_06 = models.BooleanField(default=False)     # JURUAUDIT
    is_position_07 = models.BooleanField(default=False)     # JURURAWT
    is_position_08 = models.BooleanField(default=False)     # JURURAWAT MASYARAKAT
    is_position_09 = models.BooleanField(default=False)     # JURUTEKNIK KOMPUTER
    is_position_10 = models.BooleanField(default=False)     # JURUTERA
    is_position_11 = models.BooleanField(default=False)     # JURUUKUR BAHAN
    is_position_12 = models.BooleanField(default=False)     # PEGAWAI KESELAMATAN
    is_position_13 = models.BooleanField(default=False)     # PEGAWAI KESIHATAN PERSEKITARAN
    is_position_14 = models.BooleanField(default=False)     # PEGAWAI KHIDMAT PELANGGAN
    is_position_15 = models.BooleanField(default=False)     # PEGAWAI PENILAIAN
    is_position_16 = models.BooleanField(default=False)     # PEGAWAI PERANCANG BANDAR DAN DESA
    is_position_17 = models.BooleanField(default=False)     # PEGAWAI PERTANIAN
    is_position_18 = models.BooleanField(default=False)     # PEGAWAI PERUBATAN
    is_position_19 = models.BooleanField(default=False)     # PEGAWAI TADBIR
    is_position_20 = models.BooleanField(default=False)     # PEGAWAI TEKNOLOGI MAKLUMAT
    is_position_21 = models.BooleanField(default=False)     # PEGAWAI UNDANG-UNDANG
    is_position_22 = models.BooleanField(default=False)     # PEGAWAI VETERINAR
    is_position_23 = models.BooleanField(default=False)     # PEGAWAI PEKERJA AWAM
    is_position_24 = models.BooleanField(default=False)     # PELUKIS PELAN 
    is_position_25 = models.BooleanField(default=False)     # PELUKIS PELAN (KEJURUTERAAN AWAM) / PENOLONG JURUTERA
    is_position_26 = models.BooleanField(default=False)     # PELUKIS PELAN (SENI BINA) / PENOLONG PEGAWAI  SENI BINA
    is_position_27 = models.BooleanField(default=False)     # PEMANDU KENDERAAN
    is_position_28 = models.BooleanField(default=False)     # PEMANDU KENDERAAN BERMOTOR
    is_position_29 = models.BooleanField(default=False)     # PEMBANTU AWAM
    is_position_30 = models.BooleanField(default=False)     # PEMBANTU KEMAHIRAN
    is_position_31 = models.BooleanField(default=False)     # PEMBANTU KESIHATAN AWAM
    is_position_32 = models.BooleanField(default=False)     # PEMBANTU OPERASI
    is_position_33 = models.BooleanField(default=False)     # PEMBANTU PENGUATKUASA
    is_position_34 = models.BooleanField(default=False)     # PEMBANTU PENGUATKUASA RENDAH
    is_position_35 = models.BooleanField(default=False)     # PEMBANTU PENILAIAN
    is_position_36 = models.BooleanField(default=False)     # PEMBANTU PERAWATAN KESIHATAN
    is_position_37 = models.BooleanField(default=False)     # PEMBANTU SETIAUSAHA PEJABAT / SETIAUSAHA PEJABAT
    is_position_38 = models.BooleanField(default=False)     # PEMBANTU TADBIR (PERKERANIAN / OPERASI)
    is_position_39 = models.BooleanField(default=False)     # PEMBANTU TADBIR KEWANGAN
    is_position_40 = models.BooleanField(default=False)     # PEMBANTU VETERINAR
    is_position_41 = models.BooleanField(default=False)     # PEMBANTU KESELAMATAN
    is_position_42 = models.BooleanField(default=False)     # PENGHANTAR NOTIS 
    is_position_43 = models.BooleanField(default=False)     # PENOLONG AKAUNTAN
    is_position_44 = models.BooleanField(default=False)     # PENOLONG ARKITEK LANDSKAP
    is_position_45 = models.BooleanField(default=False)     # PENOLONG JURUAUDIT
    is_position_46 = models.BooleanField(default=False)     # PENOLONG PEGAWAI KESIHATAN PERSEKITARAN
    is_position_47 = models.BooleanField(default=False)     # PENOLONG PEGAWAI PENGUATKUASA
    is_position_48 = models.BooleanField(default=False)     # PENOLONG PEGAWAI PENILAIAN
    is_position_49 = models.BooleanField(default=False)     # PENOLONG PEGAWAI PERANCANG BANDAR DAN DESA
    is_position_50 = models.BooleanField(default=False)     # PENOLONG PEGAWAI PERTANIAN
    is_position_51 = models.BooleanField(default=False)     # PENOLONG PEGAWAI TADBIR
    is_position_52 = models.BooleanField(default=False)     # PENOLONG PEGAWAI TEKNOLOGI MAKLUMAT
    is_position_53 = models.BooleanField(default=False)     # PENOLONG PEGAWAI UNDANG-UNDANG
    is_position_54 = models.BooleanField(default=False)     # PENOLONG PEGAWAI VETERINAR
    is_position_55 = models.BooleanField(default=False)     # PEREKA
    is_position_60 = models.BooleanField(default=False)     # SETIAUSAHA

    is_ba19 = models.BooleanField(default=False)    # BA19
    is_fa29 = models.BooleanField(default=False)    # FA29
    is_fa32 = models.BooleanField(default=False)    # FA32
    is_fa41 = models.BooleanField(default=False)    # FA41
    is_fa44 = models.BooleanField(default=False)    # FA44
    is_fa48 = models.BooleanField(default=False)    # FA48
    is_ft19 = models.BooleanField(default=False)    # FT19
    is_ga17 = models.BooleanField(default=False)    # GA17
    is_ga19 = models.BooleanField(default=False)    # GA19
    is_ga22 = models.BooleanField(default=False)    # GA22
    is_ga26 = models.BooleanField(default=False)    # GA26
    is_ga29 = models.BooleanField(default=False)    # GA29
    is_ga32 = models.BooleanField(default=False)    # GA32
    is_ga41 = models.BooleanField(default=False)    # GA41
    is_gv41 = models.BooleanField(default=False)    # GV41
    is_ha11 = models.BooleanField(default=False)    # HA11
    is_ha14 = models.BooleanField(default=False)    # HA14
    is_ha16 = models.BooleanField(default=False)    # HA16
    is_ha19 = models.BooleanField(default=False)    # HA19
    is_ha22 = models.BooleanField(default=False)    # HA22
    is_ja19 = models.BooleanField(default=False)    # JA19
    is_ja22 = models.BooleanField(default=False)    # JA22
    is_ja29 = models.BooleanField(default=False)    # JA29
    is_ja36 = models.BooleanField(default=False)    # JA36
    is_ja38 = models.BooleanField(default=False)    # JA38
    is_ja40 = models.BooleanField(default=False)    # JA40
    is_ja41 = models.BooleanField(default=False)    # JA41
    is_ja44 = models.BooleanField(default=False)    # JA44
    is_ja48 = models.BooleanField(default=False)    # JA48
    is_ja52 = models.BooleanField(default=False)    # JA52
    is_ja54 = models.BooleanField(default=False)    # JA54
    is_kp11 = models.BooleanField(default=False)    # KP11
    is_kp14 = models.BooleanField(default=False)    # KP14
    is_kp19 = models.BooleanField(default=False)    # KP19
    is_kp22 = models.BooleanField(default=False)    # KP22
    is_kp29 = models.BooleanField(default=False)    # KP29
    is_kp32 = models.BooleanField(default=False)    # KP32
    is_kp41 = models.BooleanField(default=False)    # KP41
    is_la29 = models.BooleanField(default=False)    # LA29
    is_la41 = models.BooleanField(default=False)    # LA41
    is_la44 = models.BooleanField(default=False)    # LA44
    is_la52 = models.BooleanField(default=False)    # LA52
    is_la54 = models.BooleanField(default=False)    # LA54
    is_na01 = models.BooleanField(default=False)    # NA01
    is_na11 = models.BooleanField(default=False)    # NA11
    is_na14 = models.BooleanField(default=False)    # NA14
    is_na17 = models.BooleanField(default=False)    # NA17
    is_na19 = models.BooleanField(default=False)    # NA19
    is_na22 = models.BooleanField(default=False)    # NA22
    is_na26 = models.BooleanField(default=False)    # NA26
    is_na29 = models.BooleanField(default=False)    # NA29
    is_na30 = models.BooleanField(default=False)    # NA30
    is_na32 = models.BooleanField(default=False)    # NA32
    is_na36 = models.BooleanField(default=False)    # NA36
    is_na41 = models.BooleanField(default=False)    # NA41
    is_na44 = models.BooleanField(default=False)    # NA44
    is_na48 = models.BooleanField(default=False)    # NA48
    is_na52 = models.BooleanField(default=False)    # NA52
    is_na54 = models.BooleanField(default=False)    # NA54
    is_ra01 = models.BooleanField(default=False)    # RA01
    is_ra03 = models.BooleanField(default=False)    # RA03
    is_ua11 = models.BooleanField(default=False)    # UA11
    is_ua14 = models.BooleanField(default=False)    # UA14
    is_ua17 = models.BooleanField(default=False)    # UA17
    is_ua19 = models.BooleanField(default=False)    # UA19
    is_ua24 = models.BooleanField(default=False)    # UA24
    is_ua29 = models.BooleanField(default=False)    # UA29
    is_ua32 = models.BooleanField(default=False)    # UA32
    is_ua36 = models.BooleanField(default=False)    # UA36
    is_ua41 = models.BooleanField(default=False)    # UA41
    is_ud43 = models.BooleanField(default=False)    # UD43
    is_ud48 = models.BooleanField(default=False)    # UD48
    is_ud52 = models.BooleanField(default=False)    # UD53
    is_vu06 = models.BooleanField(default=False)    # VU06
    is_vu07 = models.BooleanField(default=False)    # VU07
    is_wa17 = models.BooleanField(default=False)    # WA17
    is_wa19 = models.BooleanField(default=False)    # WA19
    is_wa22 = models.BooleanField(default=False)    # WA22
    is_wa26 = models.BooleanField(default=False)    # WA26
    is_wa28 = models.BooleanField(default=False)    # WA28
    is_wa29 = models.BooleanField(default=False)    # WA29
    is_wa32 = models.BooleanField(default=False)    # WA32
    is_wa36 = models.BooleanField(default=False)    # WA36
    is_wa41 = models.BooleanField(default=False)    # WA41
    is_wa44 = models.BooleanField(default=False)    # WA44
    is_wa48 = models.BooleanField(default=False)    # WA48
    is_wa52 = models.BooleanField(default=False)    # WA52
    is_wa54 = models.BooleanField(default=False)    # WA54
    is_waa41 = models.BooleanField(default=False)   # WAA41
    is_waa44 = models.BooleanField(default=False)   # WAA44

    max_participant = models.IntegerField(default=0) # Done
    venue = models.CharField(max_length=50, null=True, default='NA') # Done
    address = models.CharField(max_length=50, null=True, default='NA') # Done
    start_date = models.DateField(null=True) # Done
    start_time = models.TimeField(null=True) # Done
    end_date = models.DateField(null=True) # Done
    end_time = models.TimeField(null=True) # Done
    schedule_notes = models.TextField(null=True) #~
    cost = models.FloatField(default=0) # Done
    duration_days = models.IntegerField(null=True) # Done
    transportation = models.BooleanField(default=False)

    STATUS_TYPE = [
        ('DB','Dibuka'),
        ('DT','Ditutup'),
        ('PN','Penuh'),
        ('TN','Tangguh'),
        ('SL','Selesai'),
        ('OT','Lain-lain')
    ]

    status = models.CharField(max_length=2, choices=STATUS_TYPE, default='DB') # Done
    attachment = models.FileField(null=True, upload_to=PathAndRename('mbpp-elatihan/attachments')) # Done
    attachment_approval = models.FileField(null=True, upload_to=PathAndRename('mbpp-elatihan/attachments')) # Done

    history = HistoricalRecords()
    created_by = models.ForeignKey(
        CustomUser,
        null=True,
        on_delete=models.CASCADE,
        related_name='training_created_by',
        limit_choices_to={
            'user_type': 'TC'
        }
    )
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def save(self,*args, **kwargs):
        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        if not self.course_code:
            prefix = 'MBPP{}'.format(datetime.datetime.now(timezone_).strftime('%y%m'))
            prev_instances = self.__class__.objects.filter(course_code__contains=prefix)
            print('Prevs', prev_instances)
            print('Prev', prev_instances.first())
            if prev_instances.exists():
                last_instance_id = prev_instances.first().course_code[-4:]
                self.course_code = prefix+'{0:04d}'.format(int(last_instance_id)+1)
            else:
                self.course_code = prefix+'{0:04d}'.format(1)

        if not self.duration_days:
            delta_duration = self.end_date - self.start_date
            self.duration_days = delta_duration.days
            
        super(Training, self).save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class TrainingNote(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    training = models.ForeignKey(
        Training, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='training_training_notes'
    )
    title = models.CharField(max_length=50, default='NA')
    note_code = models.CharField(max_length=100, null=True)
    note_file = models.FileField(null=True, upload_to=PathAndRename('mbpp-elatihan/notes'))

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def save(self,*args, **kwargs):
        timezone_ = pytz.timezone('Asia/Kuala_Lumpur')
        if not self.note_code:
            prefix = 'NOTA{}'.format(datetime.datetime.now(timezone_).strftime('%y%m'))
            prev_instances = self.__class__.objects.filter(note_code__contains=prefix)
            if prev_instances.exists():
                last_instance_id = prev_instances.first().note_code[-4:]
                self.note_code = prefix+'{0:04d}'.format(int(last_instance_id)+1)
            else:
                self.note_code = prefix+'{0:04d}'.format(1)
            
        super(TrainingNote, self).save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return (self.title)


class TrainingApplication(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    training = models.ForeignKey(
        Training, 
        on_delete=models.CASCADE, 
        null=True,
        related_name='training_application'
    )
    applicant = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='application_attendee'
    )
    # is_accepted = models.BooleanField(default=True)
    STATUS = [
        ('AP', 'Diterima'),
        ('RJ', 'Ditolak'),
        ('RS', 'Disimpan'),
        ('IP', 'Dalam proses')
    ]
    status = models.CharField(
        max_length=2,
        choices=STATUS,
        default='IP'
    )
    approved_level_1_by = models.ForeignKey( # Department coordinator / penyelaras jabatan
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='application_approved_level_1_by'
    )
    approved_level_2_by = models.ForeignKey( # Department Head / ketua jabatan
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='application_approved_level_2_by'
    )
    approved_level_3_by = models.ForeignKey( # Training coordinator / penyelaras latihan
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='application_approved_level_3_by'
    )

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

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    training = models.ForeignKey(
        Training, 
        on_delete=models.CASCADE, 
        null=True,
        related_name='training_attendee'
    )
    attendee = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='attendee'
    )
    is_attend = models.BooleanField(default=False)
    check_in = models.DateTimeField(null=True)
    check_out = models.DateTimeField(null=True)
    checked_in_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='attendee_checked_in_by'
    )
    checked_out_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='attendee_checked_out_by'
    )
    verified_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='attendee_verified_by'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.attendee.full_name


class TrainingAbsenceMemo(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attendee = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE, 
        null=True, 
        related_name='absence_attendee'
    )
    training = models.ForeignKey(
        Training, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='training_absence_memo'
    )
    reason = models.TextField(blank=True, null=True)
    verified_by = models.ForeignKey(
        CustomUser, 
        on_delete=models.CASCADE, 
        null=True, 
        related_name='absence_verified_by'
    )
    attachment = models.FileField(null=True, upload_to=PathAndRename('mbpp-elatihan/attachments'))
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.attendee.full_name


class TrainingNeedAnalysis(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    staff = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE, 
        null=True, 
        related_name='training_need_analysis_staff'
    )
    core = models.ForeignKey(
        TrainingCore,
        on_delete=models.CASCADE,
        null=True,
        related_name='training_need_analysis_core'
    )
    suggested_title = models.CharField(max_length=255, null=True)
    suggested_facilitator = models.CharField(max_length=255, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.staff.full_name


class Trainer(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False)
    phone = models.CharField(max_length=20, null=True)
    training = models.ForeignKey(
        Training,
        on_delete=models.CASCADE,
        null=True,
        related_name='trainer_training'
    )

    TRAINER_TYPE = [
        ('FC', 'Facilitator'),
        ('SP', 'Speaker')
    ]
    trainer_type = models.CharField(max_length=2, choices=TRAINER_TYPE, default='FC')
    
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.question


class Configuration(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False)
    slug = models.CharField(max_length=100, null=False)
    value = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.slug

class MonitoringPlan(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    q1 = models.IntegerField(default=0)
    q2 = models.IntegerField(default=0)
    q3 = models.IntegerField(default=0)
    q4 = models.IntegerField(default=0)
    year = models.CharField(default=datetime.datetime.now().year, max_length=4)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return self.year

class BasicLevel(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    year = models.CharField(default=datetime.datetime.now().year, max_length=4)
    level = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year']

    def __str__(self):
        return ('%s - %s'%(self.year, self.level))
