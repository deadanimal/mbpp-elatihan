# Generated by Django 2.2.6 on 2021-08-23 13:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('evaluations', '0004_internalevaluation_answer_9'),
    ]

    operations = [
        migrations.AddField(
            model_name='externalevaluation',
            name='answer_9',
            field=models.CharField(max_length=1, null=True),
        ),
    ]
