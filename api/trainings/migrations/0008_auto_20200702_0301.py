# Generated by Django 2.2.6 on 2020-07-02 03:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('trainings', '0007_auto_20200701_0954'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='historicaltraining',
            name='fasilitator',
        ),
        migrations.RemoveField(
            model_name='training',
            name='fasilitator',
        ),
        migrations.AddField(
            model_name='historicaltraining',
            name='country',
            field=models.CharField(choices=[('DN', 'Dalam Negara'), ('LN', 'Luar Negara')], default='DN', max_length=2),
        ),
        migrations.AddField(
            model_name='historicaltraining',
            name='facilitator',
            field=models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='historicaltraining',
            name='method',
            field=models.CharField(choices=[('BS', 'Bersemuka'), ('TB', 'Tidak Bersemuka (online)')], default='BS', max_length=2),
        ),
        migrations.AddField(
            model_name='training',
            name='country',
            field=models.CharField(choices=[('DN', 'Dalam Negara'), ('LN', 'Luar Negara')], default='DN', max_length=2),
        ),
        migrations.AddField(
            model_name='training',
            name='facilitator',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='training_facilitator', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='training',
            name='method',
            field=models.CharField(choices=[('BS', 'Bersemuka'), ('TB', 'Tidak Bersemuka (online)')], default='BS', max_length=2),
        ),
    ]
