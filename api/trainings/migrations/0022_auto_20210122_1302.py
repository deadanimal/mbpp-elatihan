# Generated by Django 2.2.6 on 2021-01-22 05:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('trainings', '0021_auto_20210122_1126'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historicaltraining',
            name='course_type',
        ),
        migrations.RemoveField(
            model_name='training',
            name='course_type',
        ),
    ]
