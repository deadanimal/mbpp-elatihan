# Generated by Django 2.0.5 on 2020-01-23 09:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('trainings', '0009_auto_20200123_0311'),
    ]

    operations = [
        migrations.CreateModel(
            name='TrainingEvent',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('action', models.CharField(default='NA', max_length=100)),
                ('date_time', models.DateTimeField(auto_now=True, null=True)),
                ('action_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='training_event_by', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
