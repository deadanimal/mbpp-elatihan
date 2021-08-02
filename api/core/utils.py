from datetime import datetime

def get_departments(department_code):

    if department_code == '11':
        department = 'JABATAN KHIDMAT PENGURUSAN'
    elif department_code == '15':
        department = 'JABATAN PENGUATKUASAAN'
    elif department_code == '21':
        department = 'JABATAN PERBENDAHARAAN'
    elif department_code == '31':
        department = 'JABATAN KEJURUTERAAN'
    elif department_code == '41':
        department = 'JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN'
    elif department_code == '45':
        department = 'JABATAN PERKHIDMATAN DAN PERBANDARAAN'
    elif department_code == '47':
        department = 'JABATAN KESIHATAN PERSEKITARAN DAN PELESENAN - PELESENAN'
    elif department_code == '51':
        department = 'JABATAN KAWALAN BANGUNAN'
    elif department_code == '55':
        department = 'JABATAN KONSERVASI WARISAN'
    elif department_code == '61':
        department = 'JABATAN PENILAIAN DAN PENGURUSAN HARTA'
    elif department_code == '63':
        department = 'JABATAN PESURUHJAYA BANGUNAN'
    elif department_code == '71':
        department = 'JABATAN PERANCANGAN PEMBANGUNAN'
    elif department_code == '81':
        department = 'JABATAN KHIDMAT KEMASYARAKATAN'
    elif department_code == '86':
        department = 'JABATAN LANDSKAP'
    elif department_code == '90':
        department = 'PEJABAT DATUK BANDAR'
    elif department_code == '91':
        department = 'PEJABAT DATUK BANDAR - UNDANG - UNDANG'
    elif department_code == '92':
        department = 'PEJABAT DATUK BANDAR - PENYELARASAN PEMBANGUNAN'
    elif department_code == '93':
        department = 'PEJABAT DATUK BANDAR - AUDIT DALAM'
    elif department_code == '94':
        department = 'PEJABAT DATUK BANDAR - OSC'
        
    return department

def get_training_durations(start_date, start_time, end_date, end_time):
    
    start_dt = str(start_date) + ' ' + str(start_time)
    end_dt = str(end_date) + ' ' + str(end_time)

    start_dt_obj = datetime.strptime(start_dt, '%Y-%m-%d %H:%M:%S')
    end_dt_obj = datetime.strptime(end_dt, '%Y-%m-%d %H:%M:%S')

    time = (end_dt_obj - start_dt_obj).total_seconds()

    day = time // (24 * 3600)
    time = time % (24 * 3600)
    hour = time // 3600
    time %= 3600
    minutes = time // 60
    time %= 60
    seconds = time

    str_day = ''
    if day > 0:
        str_day = str(int(day)) + ' hari'

    str_hour = ''
    if hour > 0:
        str_hour = str(int(hour)) + ' jam'

    str_minutes = ''
    if minutes > 0:
        str_minutes = str(int(minutes)) + ' minit'
        
    return ' '.join([str_day, str_hour, str_minutes])
