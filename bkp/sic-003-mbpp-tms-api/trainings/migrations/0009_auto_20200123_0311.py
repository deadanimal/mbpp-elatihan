# Generated by Django 2.0.5 on 2020-01-23 03:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trainings', '0008_auto_20200123_0254'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trainingcode',
            name='code',
            field=models.CharField(default='NA', max_length=70, null=True),
        ),
    ]
