# Generated by Django 2.2.6 on 2021-02-08 20:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_auto_20210124_1802'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='user_type',
            field=models.CharField(choices=[('ST', 'Staff'), ('DC', 'Department Coordinator'), ('TC', 'Training Coordinator'), ('AD', 'Administrator'), ('DH', 'Department Head')], default='ST', max_length=2),
        ),
        migrations.AlterField(
            model_name='historicalcustomuser',
            name='user_type',
            field=models.CharField(choices=[('ST', 'Staff'), ('DC', 'Department Coordinator'), ('TC', 'Training Coordinator'), ('AD', 'Administrator'), ('DH', 'Department Head')], default='ST', max_length=2),
        ),
    ]
