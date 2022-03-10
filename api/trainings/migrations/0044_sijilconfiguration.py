# Generated by Django 2.2.6 on 2022-03-10 03:52

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('trainings', '0043_auto_20220308_1238'),
    ]

    operations = [
        migrations.CreateModel(
            name='SijilConfiguration',
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
    ]
