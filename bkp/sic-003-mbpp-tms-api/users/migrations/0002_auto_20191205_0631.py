# Generated by Django 2.0.5 on 2019-12-05 06:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='emergency_contact',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='customuser',
            name='emergency_number',
            field=models.CharField(blank=True, max_length=11),
        ),
    ]
