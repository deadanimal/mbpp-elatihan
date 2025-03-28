# Generated by Django 2.2.6 on 2021-03-11 23:47

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('trainings', '0039_auto_20210227_1538'),
    ]

    operations = [
        migrations.CreateModel(
            name='BasicLevel',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('year', models.CharField(default=2021, max_length=4)),
                ('level', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-year'],
            },
        ),
        migrations.CreateModel(
            name='MonitoringPlan',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('q1', models.IntegerField(default=0)),
                ('q2', models.IntegerField(default=0)),
                ('q3', models.IntegerField(default=0)),
                ('q4', models.IntegerField(default=0)),
                ('year', models.CharField(default=2021, max_length=4)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
