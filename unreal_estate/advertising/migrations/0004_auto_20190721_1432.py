# Generated by Django 2.2.2 on 2019-07-21 14:32

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('advertising', '0003_auto_20190721_1251'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='location',
            field=django.contrib.gis.db.models.fields.PointField(default=None, null=True, srid=4326),
        ),
    ]
