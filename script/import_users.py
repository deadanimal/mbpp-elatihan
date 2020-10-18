# import csv
import requests
import json
# Reading an excel file using Python 
import xlrd
import csv


with open('data/staffs.csv', mode='r') as csv_file:
    csv_reader = csv.reader(csv_file)
    fields = [next(csv_reader)]
    base_url = 'https://mbpp-elatihan-api.pipe.my/'

    for row in csv_reader:
        # print(row)
        account = {
            'username': row[1],
            'password1': row[1],
            'password2': row[1]
        }

        profile = {
            'staff_id': row[0],
            'nric': row[1],
            'full_name': row[2],
            'service_status': row[3],
            'date_appointed': row[4],
            'date_confirmed': row[5],
            'department_code': row[6],
            'unit_code': row[7],
            'position': row[8],
            'grade_code': row[9],
            'salary_code': row[10]
        }
        # print(account)
        # print(profile)

        r_reg = requests.post(base_url + 'auth/registration/', data=account)
        res_reg = r_reg.json()
        
        if r_reg.status_code == requests.codes.created:
            print('Registered')

            r_upd = requests.patch(base_url + 'v1/' + res_reg['user']['pk'] + '/', data=profile)
            res_upd = r_updt.json()
            
            if r_upd.status_code == requests.codes.ok:
                print('Updated')

