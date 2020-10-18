# Generated by Django 2.0.5 on 2020-01-22 07:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_auto_20200121_0715'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='user_type',
            field=models.CharField(choices=[('ST', 'Staff'), ('DC', 'Department Coordinator'), ('TC', 'Training Coordinator'), ('AD', 'Administrator'), ('TR', 'Trainer'), ('OT', 'Other')], default='OT', max_length=2),
        ),
    ]
