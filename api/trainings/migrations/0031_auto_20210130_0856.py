# Generated by Django 2.2.6 on 2021-01-30 00:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trainings', '0030_auto_20210128_1139'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicaltraining',
            name='cost',
            field=models.FloatField(default=0),
        ),
        migrations.AlterField(
            model_name='training',
            name='cost',
            field=models.FloatField(default=0),
        ),
    ]
