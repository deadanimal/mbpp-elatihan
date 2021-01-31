# Generated by Django 2.2.6 on 2021-01-24 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_auto_20200912_0336'),
    ]

    operations = [
        migrations.RenameField(
            model_name='customuser',
            old_name='unit_code',
            new_name='section_code',
        ),
        migrations.RenameField(
            model_name='historicalcustomuser',
            old_name='unit_code',
            new_name='section_code',
        ),
        migrations.RemoveField(
            model_name='customuser',
            name='department',
        ),
        migrations.RemoveField(
            model_name='historicalcustomuser',
            name='department',
        ),
        migrations.AlterField(
            model_name='customuser',
            name='service_status',
            field=models.CharField(choices=[('K', 'Kontrak'), ('S', 'Sementara'), ('T', 'Tetap')], default='T', max_length=1),
        ),
        migrations.AlterField(
            model_name='historicalcustomuser',
            name='service_status',
            field=models.CharField(choices=[('K', 'Kontrak'), ('S', 'Sementara'), ('T', 'Tetap')], default='T', max_length=1),
        ),
    ]
