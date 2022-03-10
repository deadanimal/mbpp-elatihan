# Generated by Django 2.2.6 on 2022-03-08 04:38

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('trainings', '0042_trainingattendee_check_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Certificate',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('value', models.CharField(max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.AlterField(
            model_name='basiclevel',
            name='year',
            field=models.CharField(default=2022, max_length=4),
        ),
        migrations.AlterField(
            model_name='historicaltraining',
            name='address',
            field=models.CharField(default='NA', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='historicaltraining',
            name='description',
            field=models.CharField(default='NA', max_length=255),
        ),
        migrations.AlterField(
            model_name='historicaltraining',
            name='title',
            field=models.CharField(default='NA', max_length=255),
        ),
        migrations.AlterField(
            model_name='historicaltraining',
            name='venue',
            field=models.CharField(default='NA', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='monitoringplan',
            name='year',
            field=models.CharField(default=2022, max_length=4),
        ),
        migrations.AlterField(
            model_name='training',
            name='address',
            field=models.CharField(default='NA', max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='training',
            name='description',
            field=models.CharField(default='NA', max_length=255),
        ),
        migrations.AlterField(
            model_name='training',
            name='title',
            field=models.CharField(default='NA', max_length=255),
        ),
        migrations.AlterField(
            model_name='training',
            name='venue',
            field=models.CharField(default='NA', max_length=255, null=True),
        ),
    ]
